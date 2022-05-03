const esbuild = require("esbuild");
const path = require("path");

esbuild.build({
    entryPoints: [
        path.resolve(__dirname, "..", "src", "main.ts")],
    bundle: true,
    platform: "node",
    minify: true,
    sourcemap: true,
    outfile: path.resolve(__dirname, "..", "dist", "index.js"),
    plugins: [],
});
