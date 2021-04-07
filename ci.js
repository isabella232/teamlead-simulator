const util = require('util');
const std_exec = util.promisify(require('child_process').exec);

async function exec(cmd, opts) {
    const { stdout, stderr } = await std_exec(cmd, opts);

    console.log(stdout);
    console.log(stderr);
}

async function main() {
    await exec(`npm ci`);
    await exec(`node build`);
}

main();
