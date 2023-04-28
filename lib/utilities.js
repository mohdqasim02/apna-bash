const fs = require('fs');

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

const ls = function(env, directory) {
  if(!isValidPath(directory)) {
    return {
      env, 
      output: "",
      error: getErrorMessage()
    }
  }
  return {
    env, 
    output: fs.readdirSync(directory).join(' '),
    error: ""
  };
};

const cd = function(env, directory) {
  if(!isValidPath(directory)) {
    return {
      env, 
      output: "",
      error: getErrorMessage()
    }
  }

  env.pwd = `${env.pwd}/${directory}`;

  return {
    env, 
    output: "",
    error: ""
  };
};

exports.cd = cd;
exports.ls = ls;
exports.pwd = pwd;
