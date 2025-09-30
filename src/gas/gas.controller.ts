import { Controller, Get } from "@nestjs/common";
import { GasService } from "./gas.service";



@Controller("gasPrice")
export class GasController {
  constructor(private gasService: GasService) { }

  @Get()
  get() { return this.gasService.getGasPrice(); }
}
