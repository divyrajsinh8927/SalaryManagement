import type { NextConfig } from "next";
import fs from "fs";

try {
  const content = fs.readFileSync("temp_salaries.html", "utf16le");
  fs.writeFileSync("temp_salaries_utf8.html", content, "utf8");
} catch (e) {}

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
