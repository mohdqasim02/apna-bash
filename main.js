const fs = require('fs');
let PWD = process.env.PWD; 

const formatDirectories = function(list) {
  return list.join(',').replaceAll(',' , ' '); 
};

const formatInput = function(commands) {
  return commands.split('\n').slice(0, -1).map(function(command) {
    return command.split(' ');
  }); 
};

const getOrDefault = function(path) {
  return path || '.';
};

const display = function(text) {
  if(text !== undefined)
    console.log(text);
};

const execute = function(command, arg) {
  const commands = {
    ls: ls,
    cd: cd,
    pwd: pwd,
  };
  return commands[command](arg);
};

const pwd = function() {
  return PWD; 
};

const ls = function(directory) {
  const directories = fs.readdirSync(getOrDefault(directory));
  return formatDirectories(directories);
};

const cd = function(path) {
  PWD = `${PWD}/${path}`;
};

const bash = function() {
  const input = fs.readFileSync(process.argv[2], 'utf-8');
  const commands = formatInput(input);

  commands.forEach(function(command) {
    display(execute(command[0], command[1]));
  });
};

bash();
