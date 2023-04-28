const fs = require('fs');

const format = function(list) {
  return list.join(',').replaceAll(',' , ' '); 
};

const pwd = function() {
  console.log(process.env.PWD);
};

const getOrDefault = function(path) {
  return path || '.';
};

const ls = function(directory) {
  const directories = fs.readdirSync(getOrDefault(directory));
  console.log(format(directories));
};

const cd = function(path) {
  process.chdir(getOrDefault(path));
  process.env.PWD = process.cwd();
};

pwd();
ls();
cd('workspace');
pwd();
ls();
cd('personal');
pwd();
ls();
pwd();
