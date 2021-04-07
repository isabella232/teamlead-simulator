const esbuild = require('esbuild');

esbuild.build({
    ...require("./build-options").options,
    watch: {
        onRebuild(error, result) {
            if (error) console.error('watch build failed:', error)
            else console.log('watch build succeeded:', result)
        },
    },
}).then(result => {
    console.log("Build ok");

    const messages = esbuild.formatMessagesSync(result.warnings, { kind: "warning" });

    for (const message of messages) {
        console.log(message);
    }
})
