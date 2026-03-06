const fs = require('fs');
const parser = require('@babel/parser');
const code = fs.readFileSync('c:/Users/yashw/Documents/Python/client/src/App.js', 'utf8');
try {
  parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
  console.log('Parsed successfully');
} catch (e) {
  console.error('Error:', e.message);
  console.error(e.loc);
}
