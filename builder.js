const messageFormatPlugin = {
    name: 'messageformat',
    setup(build) {
        const properties = require("dot-properties");
        const fs = require("fs");
        const path = require("path");
        const MessageFormat = require("@messageformat/core");
        const compileModule = require("@messageformat/core/compile-module");

        build.onResolve({ filter: /\.properties$/ }, (args) => {
            return {
                path: path.join(args.resolveDir, "messages", args.path)
            }
        });

        build.onLoad({ filter: /\.properties$/ }, async (args) => {
            const result = properties.parse(fs.readFileSync(args.path, "utf8"), true);
            const filename = path.basename(args.path)
            const locale = filename.substring(0, filename.indexOf("."));
            const format = new MessageFormat(locale, {
                customFormatters: {
                    x: (value, locale, arg) => {
                        return value[arg];
                    }
                }
            });
            const contents = compileModule(format, result);

            return { contents };
        });
    },
};

exports.generate_declarations = function(module_name, content) {
    const parser = require("@messageformat/parser");

    function output_tree(tree, indent) {
        const result = [];

        for (const [key, value] of Object.entries(tree)) {
            if (typeof value === "object") {
                result.push(`${indent}${key}: {\n${output_tree(value, indent + "    ")}\n${indent}}`);
            } else if (typeof value === "string") {
                const tokens = parser.parse(value);
                const args = [];

                function maybe_push_arg(name, type) {
                    if (!args.find(arg => arg.name === name)) {
                        args.push({ name, type })
                    }
                }

                for (const token of tokens) {
                    switch (token.type) {
                        case "content": break; // skip
                        case "argument": {
                            maybe_push_arg(token.arg, "string");
                            break;
                        }

                        case "function": {
                            maybe_push_arg(token.arg, "unknown");
                            break;
                        }

                        case "selectordinal":
                        case "plural": {
                            maybe_push_arg(token.arg, "number");
                            break;
                        }

                        default: throw "Unsupported token type " + token.type;
                    }
                }

                const object_types = args.map(arg => `${arg.name}: ${arg.type}`).join(", ");
                const arguments_string =
                    args.length > 0 ? `arg: { ${object_types} }` : ``;

                result.push(indent + `${key}(${arguments_string}): string;`)
            } else {
                throw "Unsupported value type " + typeof value;
            }
        }

        return result.join("\n");
    }

    return `
declare module "${module_name}" {
    type Keys = {
${output_tree(content, "        ")}
    }
    
    const def: Keys;
    export default def;
}
`.trim();
}

exports.localization = {
    folder: "main/src/messages",
    files: ["ru.properties", "en.properties"]
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
