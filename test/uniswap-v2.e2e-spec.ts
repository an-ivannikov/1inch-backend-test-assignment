import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";



// Example mainnet WETH/USDC (addresses left as placeholders)
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";


describe("/return (e2e)", () => {
  let app: INestApplication;


  beforeAll(async () => {
    process.env.ETH_RPC_URL = process.env.ETH_RPC_URL || "http://localhost:8545";
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });


  afterAll(async () => { await app.close(); });


  it("quotes WETH->USDC", async () => {
    const amountIn = "100000000000000000"; // 0.1 WETH
    const res = await request(app.getHttpServer()).get(`/return/${WETH}/${USDC}/${amountIn}`).expect(200);
    expect(res.body).toHaveProperty("outputAmount");
  });
});
