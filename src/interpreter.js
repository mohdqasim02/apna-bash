const fs = require('fs');
const {ls, cd, pwd, echo} = require('../lib/utilities.js');

const handleWildCard = function(env, args) {
  return args.flatMap(function (arg) {
    switch(arg) {
      case '~': return [env.home];
      case '-': return [env.oldPwd];
      case '*': return fs.readdirSync(env.pwd);
    }
    return arg;
  });
};

const isValidCommand = function(expression) {
  const commands = ['ls', 'cd', 'pwd', 'echo'];
  return commands.includes(expression.command);
};

const execute = function(env, command, args) {
  const commands = {
    ls: ls,
    cd: cd,
    pwd: pwd,
    echo: echo
  }
  return commands[command](env, handleWildCard(env, args))
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
