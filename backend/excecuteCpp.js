const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, inputPath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.out`);

    return new Promise((resolve, reject) => {
        exec(
            `g++ "${filepath}" -o "${outPath}" && cd "${outputPath}" && ./"${jobId}.out" < "${inputPath}"`,
            { timeout: 1000, maxBuffer: 1024 * 1024 * 256 },  // Set timeout to 2 seconds
            (error, stdout, stderr) => {
                if (error) {
                    // Check if the error is due to a timeout
                    if (error.signal === 'SIGTERM') {
                        reject("Execution timed out");
                    } else {
                        reject({ error, stderr });
                    }
                    return;
                }
                if (stderr) {
                    reject(stderr);
                    return;
                }
                resolve(stdout);
            }
        );
    });
};

module.exports = {
    executeCpp,
};
