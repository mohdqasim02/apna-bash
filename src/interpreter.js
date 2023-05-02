const fs = require('fs');
const utils = require('../lib/utilities.js');

const expand = function(path) {
  const startsWithQuote = /^[\"\']/;
  if(startsWithQuote.test(path) || !path.includes('*')) return [path];
  const [prefix, ...postfixes] = path.split('*');

  if(!fs.existsSync(`${prefix}/`)) {
    return [];
  }

  const postfix = postfixes.join('*');
  const contents = fs.readdirSync(prefix || '.');

  return contents.flatMap(function(file) {
    return expand(`${prefix}${file}${postfix}`);
  });
};

const isValidCommand = function(programs, expression) {
  return programs[expression.command] !== undefined;
};

const execute = function(programs, command, args) {
  const commandToExecute = programs[command];
  const resolvedArgs = args.flatMap(expand);
  return commandToExecute(resolvedArgs);
};

const print = function(output, error) {
  output && console.log(output);
  error && console.log(error);
};

const interpret = function(environment, expression) {
  const programs = utils.shell(environment);
  if(!isValidCommand(programs, expression)) {
    console.error(`zsh: is not a valid command: ${expression.command}`);
    return environment;
  }

  const {env, output, error} = execute(programs, expression.command, expression.args);
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
