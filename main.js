const fs = require('fs');

const formatDirectories = function(list) {
  return list.join(',').replaceAll(',' , ' '); 
};

const formatInput = function(commands) {
  return commands.split('\n').slice(0, -1).map(function(command) {
    return command.split(' ');
  }); 
};

const pwd = function() {
  console.log(process.env.PWD);
};

const getOrDefault = function(path) {
  return path || '.';
};

const ls = function(directory) {
  const directories = fs.readdirSync(getOrDefault(directory));
  console.log(formatDirectories(directories));
};

const cd = function(path) {
  process.chdir(getOrDefault(path));
  process.env.PWD = process.cwd();
};

const main = function() {
  const input = fs.readFileSync('./apna-script.ab', 'utf-8');
  const commands = formatInput(input);
  console.log(commands);
};

main();
