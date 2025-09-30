import { Module } from "@nestjs/common";

import { ConfigService } from "./common/config.service";

import { GasController } from "./gas/gas.controller";
import { GasService } from "./gas/gas.service";

import { UniswapV2Controller } from "./uniswap-v2/uniswap-v2.controller";
import { UniswapV2Service } from "./uniswap-v2/uniswap-v2.service";



@Module({
  imports: [],
  controllers: [GasController, UniswapV2Controller],
  providers: [ConfigService, GasService, UniswapV2Service],
})

export class AppModule { };
