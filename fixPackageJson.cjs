const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '../hotel 2/package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

if (!pkg.dependencies.firebase) {
  pkg.dependencies.firebase = "^11.0.0";
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log('✅ Added firebase to customer app package.json');
} else {
  console.log('Firebase already exists in package.json');
}
