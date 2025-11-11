import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [reactRouter(), svgr()],
  base: "/athlio-code/",
});
