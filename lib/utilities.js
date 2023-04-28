const fs = require('fs');

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

const getErrorMessage = function(path) {
  return `${path}: no such file or directory`;
};

const pwd = function(env) {
  return {
    env,
    output: env.pwd,
    error: ""
  }; 
};

const ls = function(env, path) {
  const absPath = getAbsPath(env, path);
  if(!isValidPath(absPath)) {
    return {
      env, 
      output: "",
      error: getErrorMessage(absPath)
    }
  }
  return {
    env, 
    output: fs.readdirSync(absPath).join(' '),
    error: ""
  };
};

const cd = function(env, path) {
  const absPath = getAbsPath(env, path);
  if(!isValidPath(absPath)) {
    return {
      env, 
      output: "",
      error: getErrorMessage(absPath)
    }
  }

  env.pwd = absPath;

  return {
    env, 
    output: "",
    error: ""
  };
};

exports.cd = cd;
exports.ls = ls;
exports.pwd = pwd;
