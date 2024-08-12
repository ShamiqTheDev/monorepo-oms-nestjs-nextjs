import { VitePluginNode } from "vite-plugin-node";
import { ENV } from "@atdb/types";
import { defineConfig, loadEnv } from "vite";

// @ts-ignore
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "") as unknown as ENV.Api;

  return {
    server: {
      port: env.VITE_PORT,
      host: true,
    },
    build: {
      target: "es2020",
    },
    ssr: { external: ["@node-rs/argon2"] },
    plugins: [
      ...VitePluginNode({
        // Nodejs native Request adapter
        // currently this plugin support 'express', 'nest', 'koa' and 'fastify' out of box,
        // you can also pass a function if you are using other frameworks, see Custom Adapter section
        adapter: "nest",
        // tell the plugin where is your project entry
        appPath: "./src/main.ts",
        // Optional, default: 'viteNodeApp'
        // the name of named export of you app from the appPath file
        exportName: "viteNodeApp",
        // Optional, default: 'esbuild'
        // The TypeScript compiler you want to use
        // by default this plugin is using vite default ts compiler which is esbuild
        // 'swc' compiler is supported to use as well for frameworks
        // like Nestjs (esbuild dont support 'emitDecoratorMetadata' yet)
        // you need to INSTALL `@swc/core` as dev dependency if you want to use swc
        tsCompiler: "swc",
      }),
    ],
    optimizeDeps: {
      // Vite does not work well with optionnal dependencies,
      // mark them as ignored for now
      exclude: [
        "@nestjs/microservices",
        "@nestjs/websockets",
        "cache-manager",
        "class-transformer",
        "class-validator",
        "fastify-swagger",
        "@node-rs/argon2-darwin-arm64",
        "@node-rs/argon2-linux-x64-gnu",
        "@node-rs/argon2-linux-x64-musl",
      ],
    },
  };
});
