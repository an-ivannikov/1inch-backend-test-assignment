import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";



const candidates = [".env.test.local", ".env.test", ".env.local", ".env"];

for (const file of candidates) {
  const p = path.resolve(process.cwd(), file);
  if (fs.existsSync(p)) {
    dotenvExpand.expand(dotenv.config({ path: p }));
    break;
  }
}
