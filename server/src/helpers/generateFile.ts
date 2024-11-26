import fs from "fs";
import path from "path";
import { v4 } from "uuid";

const dirCodes = path.join(__dirname, "../../", "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

export default async function geenrateFile(code: string, format: string) {
  const fileName = `${v4()}.${format}`;
  const filePath = path.join(dirCodes, fileName);
  await fs.writeFileSync(filePath, code);
  return { fileName, filePath };
}
