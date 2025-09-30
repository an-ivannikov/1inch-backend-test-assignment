import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";



describe("/gasPrice (e2e)", () => {
  let app: INestApplication;


  beforeAll(async () => {
    process.env.ETH_RPC_URL = process.env.ETH_RPC_URL || "http://localhost:8545";
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });


  afterAll(async () => { await app.close(); });


  it("returns gas price", async () => {
    const res = await request(app.getHttpServer()).get("/gasPrice").expect(200);
    expect(res.body).toHaveProperty("wei");
    expect(res.body).toHaveProperty("gwei");
    expect(res.body).toHaveProperty("updatedAt");
  });
});
