import fs from 'fs';
import path from 'path';

const filePath = path.resolve('node_modules/next/dist/compiled/jest-worker/index.js');

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Wrap kill calls in try-catch to avoid Windows process kill EPERM
  content = content.replace(/this\._child\.kill\([^)]*\)/g, (match) => `(function(){ try { ${match}; } catch(e){} })()`);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully patched jest-worker process kill for Windows.');
} else {
  console.log('jest-worker file not found.');
}
