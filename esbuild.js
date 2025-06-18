const esbuild = require("esbuild")
const fs = require("fs")
const path = require("path")

const production = process.argv.includes("--production")
const watch = process.argv.includes("--watch")

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
    name: "esbuild-problem-matcher",

    setup(build) {
        build.onStart(() => {
            console.log("[watch] build started")
        })
        build.onEnd((result) => {
            result.errors.forEach(({ text, location }) => {
                console.error(`✘ [ERROR] ${text}`)
                console.error(
                    `    ${location.file}:${location.line}:${location.column}:`
                )
            })
            console.log("[watch] build finished")
        })
    },
}

async function copyStaticFiles() {
    const srcDir = path.join(__dirname, "src", "plus")
    const destDir = path.join(__dirname, "dist", "plus")
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true })
    }
    const files = fs.readdirSync(srcDir)
    files.forEach((file) => {
        if (file.endsWith(".html")) {
            fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file))
        }
    })
}

async function main() {
    const ctx = await esbuild.context({
        entryPoints: ["src/extension.ts"],
        bundle: true,
        format: "cjs",
        minify: production,
        sourcemap: !production,
        sourcesContent: false,
        platform: "node",
        outfile: "dist/extension.js",
        external: ["vscode"],
        logLevel: "silent",
        plugins: [
            /* add to the end of plugins array */
            esbuildProblemMatcherPlugin,
        ],
    })
    if (watch) {
        await ctx.watch()
        await copyStaticFiles()
    } else {
        await ctx.rebuild()
        await copyStaticFiles()
        await ctx.dispose()
    }
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
