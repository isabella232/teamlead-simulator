const createServer = require("http").createServer;
const readFileSync = require("fs").readFileSync;

function read_once(path, content_type) {
    return ({ content: readFileSync(path, "utf8"), type: content_type });
}

function static_file(dev_mode, path, content_type) {
    if (dev_mode) {
        return () => read_once(path, content_type);
    }

    const contents = read_once(path, content_type);
    return () => contents;
}

function start_server(dev_mode) {
    const extra_handlers = {
        ["/"]: static_file(dev_mode, "dist/game.html", "text/html"),
        ["/main.js"]: static_file(dev_mode, "dist/main.js", "application/javascript")
    };

    const server = createServer((req, res) => {
        const url = req.url;

        if (!url) {
            req.connection.destroy();
            return;
        }

        console.log(req.method, url);

        req.on("data", () => {});

        req.on("end", () => {
            if (req.method === "GET") {
                const static_file_getter = extra_handlers[url];
                if (static_file_getter) {
                    const file = static_file_getter();

                    res.writeHead(200, {
                        ["Content-Type"]: `${file.type}; charset=UTF-8`
                    });
                    res.end(file.content);
                } else {
                    res.writeHead(404);
                    res.end("Not found");
                }
            } else {
                res.writeHead(404);
                res.end("Not found");
            }
        });
    }).listen(3333);

    server.on("listening", () => {
        const address = server.address();

        if (address && typeof address == "object") {
            console.log(`Started at http://${address.address}:${address.port}`)
        } else {
            console.log(`Started`);
        }
    });
}

console.log("Starting server");

const args = process.argv.slice(2);

let dev = false;

if (args.length > 0) {
    for (let index = 0; index < args.length; index++) {
        const arg = args[index];

        if (arg === "dev") {
            dev = true;
        }
    }
}

start_server(dev);
