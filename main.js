const fs = require('fs');
let pwd = process.env.PWD; 

const formatFiles = function(files) {
  return files.join(' '); 
};

const getCommands = function(script) {
  return script.split('\n').slice(0, -1).map(function(command) {
    return command.split(' ');
  }); 
};

const getOrDefault = function(path) {
  return path || '.';
};

const display = function(text) {
  if(text !== undefined) {
    console.log(text);
  }
};

const execute = function(command, arg) {
  const commands = {
    ls: ls,
    cd: cd,
    pwd: getPwd,
  };

  return commands[command](arg);
};

const getPwd = function() {
  return pwd; 
};

const ls = function(directory) {
  const files = fs.readdirSync(getOrDefault(directory));
  return formatFiles(files);
};

const cd = function(path) {
  pwd = `${pwd}/${path}`;
};

const main = function() {
  const script = fs.readFileSync(process.argv[2], 'utf-8');
  const commands = getCommands(script);

  commands.forEach(function(command) {
    display(execute(command[0], command[1]));
  });
};

main();
