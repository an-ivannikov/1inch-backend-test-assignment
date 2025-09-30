import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Contract, JsonRpcProvider } from "ethers";
import { ConfigService } from "../common/config.service";
import { UNISWAP_V2_FACTORY_ABI, UNISWAP_V2_PAIR_ABI, ERC20_ABI } from "./uniswap-v2.abis";



const ZERO = 0n;


@Injectable()
export class UniswapV2Service {
  private provider: JsonRpcProvider;
  private factory: Contract;

  constructor(private configService: ConfigService) {
    this.provider = new JsonRpcProvider(this.configService.ethRpcUrl);
    this.factory = new Contract(this.configService.uniswapV2Factory, UNISWAP_V2_FACTORY_ABI, this.provider);
  }

  /**
   * Compute amountOut for exact-input trade on UniswapV2 using reserves.
   * @param from token address (checksum or lowercase)
   * @param to token address
   * @param amountInStr integer string in smallest unit of `from`
   */
  async getReturn(from: string, to: string, amountInStr: string) {
    if (!/^0x[0-9a-fA-F]{40}$/.test(from) || !/^0x[0-9a-fA-F]{40}$/.test(to)) {
      throw new BadRequestException("Invalid token address");
    }
    if (!/^\d+$/.test(amountInStr)) throw new BadRequestException("amountIn must be integer string in smallest unit");

    const amountIn = BigInt(amountInStr);
    if (amountIn === ZERO) return this.zeroResult(from, to);

    const pairAddr: string = await this.factory.getPair(from, to);
    if (!pairAddr || pairAddr === "0x0000000000000000000000000000000000000000") {
      throw new NotFoundException("Pair not found on UniswapV2");
    }

    const pair = new Contract(pairAddr, UNISWAP_V2_PAIR_ABI, this.provider);
    const [token0, token1] = await Promise.all([pair.token0(), pair.token1()]);
    const { reserve0, reserve1 } = await pair.getReserves();

    const [fromDec, toDec, fromSym, toSym] = await Promise.all([
      new Contract(from, ERC20_ABI, this.provider).decimals().then((d) => Number(d)).catch(() => 18),
      new Contract(to, ERC20_ABI, this.provider).decimals().then((d) => Number(d)).catch(() => 18),
      new Contract(from, ERC20_ABI, this.provider).symbol().catch(() => ""),
      new Contract(to, ERC20_ABI, this.provider).symbol().catch(() => ""),
    ]);

    const isFromToken0 = from.toLowerCase() === token0.toLowerCase();
    const reserveIn: bigint = isFromToken0 ? reserve0 : reserve1;
    const reserveOut: bigint = isFromToken0 ? reserve1 : reserve0;

    if (reserveIn === ZERO || reserveOut === ZERO) {
      throw new NotFoundException("Insufficient liquidity");
    }

    // UniswapV2 amountOut with 0.3% fee (997/1000)
    const amountInWithFee = amountIn * 997n;
    const numerator = amountInWithFee * reserveOut;
    const denominator = reserveIn * 1000n + amountInWithFee;
    const amountOut = numerator / denominator;

    return {
      dex: "UniswapV2",
      factory: this.configService.uniswapV2Factory,
      pair: pairAddr,
      from: { address: from, symbol: fromSym, decimals: fromDec, },
      to: { address: to, symbol: toSym, decimals: toDec, },
      inputAmount: amountIn.toString(),
      outputAmount: amountOut.toString(),
    };
  }

  private zeroResult(from: string, to: string) {
    return {
      dex: "UniswapV2",
      factory: this.configService.uniswapV2Factory,
      pair: null,
      from: { address: from, },
      to: { address: to, },
      inputAmount: "0",
      outputAmount: "0",
    };
  }
}
