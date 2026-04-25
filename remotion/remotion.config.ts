import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setEntryPoint("./src/index.ts");
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
Config.setCrf(18);
