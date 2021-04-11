require('esbuild').build({
    ...require("./builder").options
}).catch(() => process.exit(1))
