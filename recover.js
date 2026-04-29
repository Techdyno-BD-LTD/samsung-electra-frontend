const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const content = execSync('git show HEAD:"app/products/[slug]/page.tsx"').toString();
const targetPath = path.join(__dirname, 'app', 'products', '[slug]', 'ProductClient.tsx');
fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully recovered ProductClient.tsx');
