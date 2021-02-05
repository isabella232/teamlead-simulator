const util = require('util');
const std_exec = util.promisify(require('child_process').exec);
const copy = require("fs").copyFileSync;

async function exec(cmd, opts) {
    const { stdout, stderr } = await std_exec(cmd, opts);

    console.log(stdout);
    console.log(stderr);
}

async function main() {
    await exec(`npm ci`, {cwd: "codegen"});
    await exec(`npx ttsc -b ../main/tsconfig.json`, { cwd: "codegen" });

    copy("main/src/game.html", "dist/game.html");
}

main();