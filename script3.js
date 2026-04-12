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
        
        // Pattern 1:
        // <div className="flex items-center gap-2 mb-6">\s*<div className="p-2[^>]*>\s*<[A-Za-z]+[^>]*/>\s*</div>\s*<h1[^>]*>.*?</h1>\s*</div>
        content = content.replace(/<div className="flex items-center gap-2 mb-6">\s*<div className="p-2[^>]*>\s*<[A-Za-z]+[^>]*\/>\s*<\/div>\s*<h1[^>]*>.*?<\/h1>\s*<\/div>/g, '');
        
        // Pattern 1.1: with tracking-tight
        content = content.replace(/<div className="flex items-center gap-2 mb-6">\s*<div className="p-2[^>]*>\s*<[A-Za-z]+[^>]*\/>\s*<\/div>\s*<h1[^>]*>.*?<\/h1>\s*<\/div>/g, '');

        // Pattern 2: 
        // <div>\s*<h1[^>]*>.*?</h1>\s*<p[^>]*>.*?</p>\s*</div>
        // which sometimes is inside <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        // If we remove this entirely inside such a div, it leaves the button? Yes, which is fine, we can change justify-between to justify-end later if needed.
        content = content.replace(/<div>\s*<h1[^>]*>.*?<\/h1>\s*<p[^>]*>.*?<\/p>\s*<\/div>/g, '');

        // Pattern 3:
        // <div className="flex flex-col gap-1">\s*<h1[^>]*>.*?</h1>\s*<p[^>]*>.*?</p>\s*</div>
        content = content.replace(/<div className="flex flex-col gap-1">\s*<h1[^>]*>.*?<\/h1>\s*<p[^>]*>.*?<\/p>\s*<\/div>/g, '');

        // Pattern 4: just <h1 ...>...</h1>
        // Need to be careful. If it's a standalone h1 with className "text-2xl font-bold" etc used as a page heading.
        // Let's do cases: 
        content = content.replace(/<h1 className="text-xl font-bold text-slate-800[^"]*">.*?<\/h1>/g, '');
        content = content.replace(/<h1 className="text-3xl font-black text-slate-900[^"]*">.*?<\/h1>/g, '');
        content = content.replace(/<h1 className="text-3xl font-bold text-slate-900[^"]*">.*?<\/h1>/g, '');
        content = content.replace(/<h1 className="text-2xl font-bold[^"]*">.*?<\/h1>/g, '');
        // For StudentProfile
        content = content.replace(/<h1 className="text-3xl font-bold tracking-tight">Profile<\/h1>\s*<p[^>]*>.*?<\/p>/g, '');
        // For Settings
        content = content.replace(/<h1 className="text-2xl font-bold text-gray-800 mb-2">Portal Settings<\/h1>/g, '');

        
        // Pattern 5: navbars inside student portal
        // <h1 className="text-lg font-bold text-slate-900 tracking-tight">Document </h1>
        content = content.replace(/<h1 className="text-lg font-bold text-slate-900 tracking-tight">.*?<\/h1>/g, '');
        content = content.replace(/<h1 className="text-lg font-semibold text-slate-900 tracking-tight">.*?<\/h1>/g, '');
        content = content.replace(/<h1 className="text-2xl font-extrabold tracking-tight text-slate-900">.*?<\/h1>\s*<p[^>]*>.*?<\/p>\s*<\/div>\s*<div/g, '<div/g'); // tricky
        // This regex replaces things loosely. For Eligibility and InterviewScheduler, maybe it's better to manually replace.

        if (content !== originalContent) {
            console.log(`Modified: ${filePath}`);
            fs.writeFileSync(filePath, content, 'utf8');
        }
    }
});
