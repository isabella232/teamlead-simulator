require('esbuild').build({
    ...require("./build-options").options
}).catch(() => process.exit(1))
