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
        let originalContent = content;
        
        // Remove empty or redundant icon containers that were left after h1 removal
        // Pattern: <div className="flex items-center gap-2 mb-[68]">[\s\n]*<div className="p-2[^>]*>[\s\n]*<[A-Z][a-zA-Z]+[^>]*/>[\s\n]*</div>[\s\n]*</div>
        content = content.replace(/<div className="flex items-center gap-2 mb-[68]">[\s\n]*<div className="p-2[^>]*>[\s\n]*<[A-Z][a-zA-Z]+[^>]*\/>[\s\n]*<\/div>[\s\n]*<\/div>/g, '');
        
        // Also handle the case where it might be slightly different
        content = content.replace(/<div className="flex items-center gap-2 mb-6">[\s\n]*<div className="p-2[^>]*>[\s\n]*<[A-Z][a-zA-Z]+[^>]*\/>[\s\n]*<\/div>[\s\n]*<\/div>/g, '');
        content = content.replace(/<div className="flex items-center gap-2 mb-8">[\s\n]*<div className="p-2[^>]*>[\s\n]*<[A-Z][a-zA-Z]+[^>]*\/>[\s\n]*<\/div>[\s\n]*<\/div>/g, '');

        if (content !== originalContent) {
            console.log(`Cleaned up: ${filePath}`);
            fs.writeFileSync(filePath, content, 'utf8');
        }
    }
});
