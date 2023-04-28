const parseLine = function(commands, expression) {
  const [command, ...args] = expression.split(' ');
  return [...commands, {command: command, args: args}];
};

const parse = function(file) {
  const script = file.trim().split('\n'); 
  return script.reduce(parseLine, []);
};

exports.parse = parse;
