const fs=require('fs');
const lines=fs.readFileSync('src/App.js','utf-8').split('\n');
for(let i=339;i<348;i++){
  let l=lines[i];
  console.log(i+1, l);
  for(let j=0;j<l.length;j++){
    let c=l.charCodeAt(j);
    if(c>127) console.log('  char',j,l[j],'code',c.toString(16));
  }
}
