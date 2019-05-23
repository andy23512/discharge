const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: null,
  terminal: false
})

rl.on('line', function(line){
    console.log('line', line);
})
