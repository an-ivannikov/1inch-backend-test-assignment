import { Controller, Get, Param } from "@nestjs/common";
import { UniswapV2Service } from "./uniswap-v2.service";



@Controller("return")
export class UniswapV2Controller {
  constructor(private uniswapV2Service: UniswapV2Service) { }

  @Get(":fromToken/:toToken/:amountIn")
  quote(@Param("fromToken") from: string, @Param("toToken") to: string, @Param("amountIn") amountIn: string) {
    return this.uniswapV2Service.getReturn(from, to, amountIn);
  }
}
