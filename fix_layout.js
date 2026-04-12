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
        
        // Change justify-between to justify-end when it's likely just buttons left
        // Pattern: <div className="[^"]*flex[^"]*justify-between[^"]*">[\s\n]*<Button
        // Or similar.
        
        // This is a bit risky if there are multiple children, but if I removed the h1, 
        // there's often nothing on the left anymore.
        
        // Case 1: Just buttons
        // Let's just find the files that have the empty space and fix them manually or with a smarter regex.
        
        // In StudentProfile:
        // <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">\n        \n        <Button
        content = content.replace(/<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">[\s\n]*<Button/g, '<div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-6">\n        <Button');
        content = content.replace(/<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">[\s\n]*<Button/g, '<div className="flex flex-col md:flex-row md:items-center justify-end gap-4">\n        <Button');
        
        // Handle variations
        content = content.replace(/<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">[\s\n]*<div className="flex gap-3">/g, '<div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-6">\n        <div className="flex gap-3">');

        if (content !== originalContent) {
            console.log(`Adjusted layout: ${filePath}`);
            fs.writeFileSync(filePath, content, 'utf8');
        }
    }
});
