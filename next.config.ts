import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the file-tracing root to this project directory so Next.js does not
  // infer an unrelated parent lockfile (e.g. one in the user's home folder)
  // as the workspace root.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
