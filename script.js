const fs = require('fs');
const path = require('path');

const baseDir = path.join('e:', 'scpms', 'Frontend', 'src', 'pages', 'private');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(baseDir, (filePath) => {
    if (filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('<h1')) {
            let lines = content.split('\n');
            let h1Index = lines.findIndex(line => line.includes('<h1'));
            if (h1Index !== -1) {
                let start = Math.max(0, h1Index - 10);
                let end = Math.min(lines.length, h1Index + 10);
                console.log(`\n--- ${filePath} ---`);
                console.log(lines.slice(start, end).join('\n'));
            }
        }
    }
});
