const fs = require('fs');
const utils = require('../lib/utilities.js');

const expand = function(path) {
  const startsWithQuote = /^[\"\']/;
  if(startsWithQuote.test(path) || !path.includes('*')) return [path];

  let contents = fs.readdirSync('.');
  const [prefix, postfix] = path.split('*');

  contents = contents.map(function(file) {
    return prefix + file + postfix;
  });

  return contents.filter(fs.existsSync);
};

const isValidCommand = function(expression) {
  return utils[expression.command] !== undefined;
};

const execute = function(env, command, args) {
  const commandToExecute = utils[command];
  const resolvedArgs = args.flatMap(expand);
  return commandToExecute(env, resolvedArgs);
};

const print = function(output, error) {
  output && console.log(output);
  error && console.log(error);
};

const interpret = function(environment, expression) {
  if(!isValidCommand(expression)) {
    console.error(`zsh: is not a valid command: ${expression.command}`);
    return environment;
  }

  const {env, output, error} = execute(environment, expression.command, expression.args);
  print(output, error);

  return env;
};

const run = function(commands) {
  const env = {
    pwd: process.env.PWD,
    home: process.env.HOME,
    oldPwd: process.env.OLDPWD,
  }
  return commands.reduce(interpret, env);
};

exports.run = run;
