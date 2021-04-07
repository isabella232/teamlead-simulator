const properties = require("dot-properties");
const fs = require("fs");
const path = require("path");
const MessageFormat = require("@messageformat/core");
const compileModule = require("@messageformat/core/compile-module");

const messageFormatPlugin = {
    name: 'messageformat',
    setup(build) {
        build.onLoad({ filter: /\.properties$/ }, async (args) => {
            const result = properties.parse(fs.readFileSync(args.path, "utf8"), true);
            const filename = path.relative(process.cwd(), args.path)
            const locale = filename.substring(0, filename.indexOf("."));
            const format = new MessageFormat(locale);
            const contents = compileModule(format, result);

            return { contents };
        })
    },
}

exports.options = {
    entryPoints: ['main/src/main.ts'],
    bundle: true,
    // minify: true,
    sourcemap: true,
    outfile: 'public/bundle.js',
    charset: 'utf8',
    plugins: [messageFormatPlugin]
};
