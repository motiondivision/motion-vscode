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
    // Copy .html and .css files from src/plus/views to dist/plus/views
    const srcViewsDir = path.join(__dirname, "src", "plus", "views")
    const destViewsDir = path.join(__dirname, "dist", "plus", "views")
    if (!fs.existsSync(destViewsDir)) {
        fs.mkdirSync(destViewsDir, { recursive: true })
    }
    const files = fs.readdirSync(srcViewsDir)
    files.forEach((file) => {
        if (file.endsWith(".html") || file.endsWith(".css")) {
            fs.copyFileSync(
                path.join(srcViewsDir, file),
                path.join(destViewsDir, file)
            )
        }
    })
}

async function bundleViewTSX() {
    // Bundle each .tsx file in src/plus/views to dist/plus/views/[name].js
    const srcViewsDir = path.join(__dirname, "src", "plus", "views")
    const destViewsDir = path.join(__dirname, "dist", "plus", "views")
    if (!fs.existsSync(destViewsDir)) {
        fs.mkdirSync(destViewsDir, { recursive: true })
    }
    const files = fs.readdirSync(srcViewsDir)
    const tsxFiles = files.filter((file) => file.endsWith(".tsx"))
    await Promise.all(
        tsxFiles.map((file) => {
            const name = path.basename(file, ".tsx")
            return esbuild.build({
                entryPoints: [path.join(srcViewsDir, file)],
                bundle: true,
                format: "esm",
                minify: production,
                sourcemap: !production,
                outfile: path.join(destViewsDir, name + ".js"),
                platform: "browser",
                jsx: "automatic",
                jsxImportSource: "react",
                external: [],
                logLevel: "silent",
            })
        })
    )
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
        await copyStaticFiles()
        await bundleViewTSX()
        await ctx.watch()
    } else {
        await ctx.rebuild()
        await copyStaticFiles()
        await bundleViewTSX()
        await ctx.dispose()
    }
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
