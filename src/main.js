const fs = require('fs');
let pwd = process.env.PWD; 

const getCommands = function(script) {
  return script.trim().split('\n').map(function(command) {
    return command.split(' ');
  }); 
};

const getOrDefault = function(path) {
  return path || '.';
};

const display = function(text) {
  console.log(text);
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
  return files.join(' ');
};

const cd = function(path) {
  pwd = `${pwd}/${path}`;
};

const main = function() {
  const file = process.argv[2];
  if (!fs.existsSync(file)) {
    console.error(`${file}: no such file found`);
    process.exit(1);
  }

  const script = fs.readFileSync(process.argv[2], 'utf-8');
  const commands = getCommands(script);

  commands.map(function(command) {
    return execute(command[0], command[1]);
  }).filter(function(commandOutput) {
    return commandOutput !== undefined;
  }).forEach(display);
};

main();
