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
  if(path === '~') return env.pwd;
  if(path === '-') return env.oldPwd;
  return `${env.pwd}/${path}`;
};

const isValidPath = function(path) {
  return fs.existsSync(path);
};

const format = function(list) {
  return list.map(function(item) {
    return item.join(' ');
  }).join('\n');
};

const getErrorMessage = function(command, path) {
  return [command, ': no such file or directory :', path];
};

const updateState = function(env, output = [], error = []) {
  return {
    env, 
    output: format(output),
    error: format(error)
  };
};

const registerError = function(stream, error) {
  return stream.error.concat([error]);
}

const registerOutput = function(stream, output) {
  return stream.output.concat([output]);
}

const listFiles = function(stream, absPath) {
  if(!isValidPath(absPath)) {
    stream.error = registerError(stream, getErrorMessage('ls', absPath));
    return stream;
  }

  stream.output = registerOutput(stream, fs.readdirSync(absPath));
  return stream;
};

const ls = function(env, args) {
  const directories = args.length === 0 ? [env.pwd] : args;
  const initialStreams = {output: [], error: []};

  const stream = directories.reduce(function(stream, arg) {
    return listFiles(stream, getAbsPath(env, arg));
  }, initialStreams);

  return updateState(env, stream.output, stream.error); 
};

const pwd = function(env) {
  return updateState(env, [[env.pwd]]); 
};

const cd = function(env, args) {
  const absPath = getAbsPath(env, args[0]);

  if(!isValidPath(absPath)) {
    return updateState(env, [], [getErrorMessage('cd', absPath)]); 
  }

  env.oldPwd = env.pwd;
  env.pwd = resolvePath(absPath);

  return updateState(env); 
};

const echo = function(env, text) {
  return updateState(env, [text]);
};

exports.cd = cd;
exports.ls = ls;
exports.pwd = pwd;
exports.echo = echo;
