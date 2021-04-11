const esbuild = require('esbuild');
const { options, generate_declarations } = require("./builder");

options.plugins.unshift({
    name: "regenerate-localization",
    setup(build) {
        const properties = require("dot-properties");
        const fs = require("fs");
        const path = require("path");

        build.onResolve({ filter: /\.properties$/ }, (args) => {
            const full_path = path.join(args.resolveDir, "messages", args.path);
            const filename = path.relative(path.join(args.resolveDir, "messages"), full_path);
            const property_tree = properties.parse(fs.readFileSync(full_path, "utf8"), true);
            const module_content = generate_declarations(filename, property_tree);

            fs.writeFileSync(path.join(args.resolveDir, "messages", `${filename}.d.ts`), module_content);
        });
    }
});

esbuild.build({
    ...options,
    watch: {
        onRebuild(error, result) {
            if (error) console.error('watch build failed:', error)
            else console.log('watch build succeeded:', result)
        },
    },
}).then(result => {
    console.log("Build ok", result);

    const messages = esbuild.formatMessagesSync(result.warnings, { kind: "warning" });

    for (const message of messages) {
        console.log(message);
    }
})
