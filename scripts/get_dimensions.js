const fs = require('fs');
const path = 'd:/code/braweb/public/bravi-ai';

fs.readdirSync(path).forEach(file => {
    if (!file.endsWith('.png')) return;
    const buf = fs.readFileSync(`${path}/${file}`);
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    console.log(`${file}: ${width}x${height}`);
});
