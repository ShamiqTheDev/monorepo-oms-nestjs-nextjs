"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var vite_plugin_node_1 = require("vite-plugin-node");
var vite_1 = require("vite");
// @ts-ignore
exports.default = (0, vite_1.defineConfig)(function (_a) {
    var mode = _a.mode;
    var env = (0, vite_1.loadEnv)(mode, process.cwd(), "");
    return {
        server: {
            port: env.VITE_PORT,
            host: true,
        },
        build: {
            target: "es2022",
        },
        ssr: { external: ["@node-rs/argon2"] },
        plugins: __spreadArray([], (0, vite_plugin_node_1.VitePluginNode)({
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
        }), true),
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
