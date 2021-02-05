const cmd = `npx tsc-watch -b ../main/tsconfig.json --incremental --compiler ttypescript/bin/tsc`;
const process = require("child_process").exec(cmd, { cwd: "codegen" })

process.stdout.on('data', function (data) {
    console.log(data.toString());
});

process.stderr.on('data', function (data) {
    console.log(data.toString());
});

process.on('exit', function (code) {
    console.log('Exit with code ' + code.toString());
});