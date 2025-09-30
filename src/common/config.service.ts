import { Injectable } from "@nestjs/common";



@Injectable()
export class ConfigService {
  readonly ethRpcUrl = process.env.ETH_RPC_URL!;
  readonly chainId = Number(process.env.CHAIN_ID ?? 1);

  readonly uniswapV2Factory = process.env.UNISWAP_V2_FACTORY ?? "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

  readonly gasPollIntervalMs = Number(process.env.GAS_POLL_INTERVAL_MS ?? 1000);
  readonly gasCacheTtlMs = Number(process.env.GAS_CACHE_TTL_MS ?? 10000);
}
