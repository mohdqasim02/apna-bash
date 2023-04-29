const {ls, cd, pwd} = require('../lib/utilities.js');

const isValidCommand = function(expression) {
  const commands = ['ls', 'cd', 'pwd'];
  return commands.includes(expression.command);
};

const execute = function(env, command, args) {
  const commands = {
    ls: ls,
    cd: cd,
    pwd: pwd
  }
  return commands[command](env, ...args)
};

const interpret = function(environment, expression) {
  if(!isValidCommand(expression)) {
    console.error(`zsh: is not a valid command: ${expression.command}`);
    return environment;
  }

  const {env, output, error} = execute(environment, expression.command, expression.args);
  output && console.log(output);
  error && console.error(error);
  return env;
};

const run = function(commands) {
  const env = {
    pwd: process.env.PWD,
    home: process.env.HOME,
    oldPwd: process.env.OLDPWD
  }
  return commands.reduce(interpret, env);
};

exports.run = run;
