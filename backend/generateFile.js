const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

//const dirCodes = path.join(__dirname, 'codes');
const dirCodes = "/tmp";

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (language, code) => {
    const jobID = uuid();
    const filename = `${jobID}.${language}`;
    const filePath = path.join(dirCodes, filename);
    await fs.writeFileSync(filePath, code);
    return filePath;
};

module.exports = {
    generateFile,
};