#!/usr/bin / env node
const fs = require('fs');
const cwd = process.cwd(); // current Work Directory
const path = require('path');
const MD = require('markdown').markdown;

function run(argv) {
  switch (argv[2]) {
    case '-v':
    case '--version': console.log('v1.0.0'); break;

    case '-h':
    case '--help': showHelp(); break;

    default: main(argv);
  }
}
run(process.argv)

function showHelp() {
  console.group('help : ');
  console.log('-v --version');
  console.log('-h --help');
  console.groupEnd();
}

/**
 * 把md转换成html, 并在同目录下生成 同名.html
 * @param {string} filename 
 */
function convert(filename){
  fs.readFile(path.join(cwd, filename), 'utf-8', (err, data) => {
    if(err) throw err;
    // 此处导个包处理一下data
    const name = path.basename(filename, '.md');
    const html = MD.toHTML(data);
    fs.readFile(path.join(__dirname, 'index.html'), 'utf-8', (err, template) => {
      if(err) throw err;
      result = template.replace('$o_O$', html);
      fs.writeFile(path.join(cwd, name + '.html'), result, err => {
        if(err) throw err;
        console.log('convert ok');
      })
    })
  })
}

function main(argv) {
  // console.log(cwd);
  fs.readdir(cwd, (err, result) => { // 读取当前文件夹目录
    if (err) throw err;
    result.forEach(filename => {
      fs.stat(path.join(cwd, filename), (err, stat) => { // 读取当前文件信息
        if(err) throw err;
        if(stat.isFile()){
          if(path.extname(filename) === '.md'){
            // 如果是markdown文档
            convert(filename);
          }else{
            // console.log('not md');
          }
        }
      }) 
    });
  })
}

