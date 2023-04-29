const fs = require('fs');

const navigate = function(directories, directory) {
  if(directory !== '..') {
    directories.push(directory);
  } else {
    directories.pop();
  } 

  return directories;
};

const resolvePath = function(path) {
  return path.split('/')
    .filter(function(element) {
      return element !== '.'
    })
    .reduce(navigate, []).join('/');
};

const isAbsPath = function(path) {
  return path.startsWith('/');
};

const getAbsPath = function(env, path = '.') {
  if(isAbsPath(path)) return path;
  return `${env.pwd}/${path}`;
};

const isValidPath = function(path) {
  return fs.existsSync(path);
};

const updateState = function(env, output = [], error = []) {
  return {
    env, 
    output: output.join(' '),
    error: error.join(' ')
  };
};

const getErrorMessage = function(command, path) {
  return [command, ': no such file or directory :', path];
};

const pwd = function(env) {
  return updateState(env, [env.pwd]); 
};

const ls = function(env, args) {
  const absPath = getAbsPath(env, args[0]);

  if(!isValidPath(absPath)) {
    return updateState(env, [], getErrorMessage('ls', absPath)); 
  }

  return updateState(env, fs.readdirSync(absPath)); 
};

const cd = function(env, args) {
  const absPath = getAbsPath(env, args[0]);

  if(!isValidPath(absPath)) {
    return updateState(env, [], getErrorMessage('cd', absPath)); 
  }

  env.oldPwd = env.pwd;
  env.pwd = resolvePath(absPath);

  return updateState(env); 
};

const echo = function(env, text) {
  return updateState(env, text, []);
};

exports.cd = cd;
exports.ls = ls;
exports.pwd = pwd;
exports.echo = echo;
