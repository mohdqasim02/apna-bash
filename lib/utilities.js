const fs = require('fs');

const getOrDefault = function(env, path) {
  return path || env.pwd;
};

const isValidPath = function(env, path) {
  const absPath = `${env.pwd}/${path}`;
  return fs.existsSync(path) || fs.existsSync(absPath);
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

const ls = function(env, directory) {
  const path = getOrDefault(env, directory);
  if(!isValidPath(env, path)) {
    return {
      env, 
      output: "",
      error: getErrorMessage()
    }
  }
  return {
    env, 
    output: fs.readdirSync(path).join(' '),
    error: ""
  };
};

const cd = function(env, directory) {
  const path = getOrDefault(env, directory);
  if(!isValidPath(env, path)) {
    return {
      env, 
      output: "",
      error: getErrorMessage()
    }
  }

  env.pwd = `${env.pwd}/${path}`;

  return {
    env, 
    output: "",
    error: ""
  };
};

exports.cd = cd;
exports.ls = ls;
exports.pwd = pwd;
