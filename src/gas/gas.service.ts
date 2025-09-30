import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { JsonRpcProvider } from "ethers";
import { ConfigService } from "../common/config.service";



type GasCache = { valueWei: bigint; updatedAt: number };


@Injectable()
export class GasService implements OnModuleInit {
  private readonly logger = new Logger(GasService.name);
  private cache: GasCache | null = null;
  private provider: JsonRpcProvider;
  private pollInterval!: number;
  private cacheTtl!: number;
  private timer?: NodeJS.Timeout;

  constructor(private configService: ConfigService) {
    this.provider = new JsonRpcProvider(this.configService.ethRpcUrl);

    this.pollInterval = this.configService.gasPollIntervalMs;
    this.cacheTtl = this.configService.gasCacheTtlMs;
  }

  async onModuleInit() {
    await this.refresh();
    this.timer = setInterval(() => this.refresh().catch(() => undefined), this.pollInterval);
  }

  private async refresh() {
    const hex: string = await this.provider.send("eth_gasPrice", []);
    const valueWei = BigInt(hex);
    this.cache = { valueWei, updatedAt: Date.now(), };
  }

  /** Fast (cached) read; falls back to one live call if stale */
  async getGasPrice() {
    const now = Date.now();
    if (this.cache && now - this.cache.updatedAt <= this.cacheTtl) {
      return this.format(this.cache.valueWei, this.cache.updatedAt);
    }
    const hex: string = await this.provider.send("eth_gasPrice", []);
    const valueWei = BigInt(hex);
    this.cache = { valueWei, updatedAt: Date.now(), };
    return this.format(valueWei, this.cache.updatedAt);
  }

  private format(valueWei: bigint, updatedAt: number) {
    const gwei = valueWei / 1_000_000_000n; // wei -> gwei
    return {
      network: "ethereum",
      wei: valueWei.toString(),
      gwei: Number(gwei),
      updatedAt: new Date(updatedAt).toISOString(),
    };
  }
}
