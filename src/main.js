const fs = require('fs');
const {parse} = require('./parser.js');
const {run} = require('./interpreter.js');

const main = function() {
  const file = process.argv[2];

  if (!fs.existsSync(file)) {
    console.error(`${file}: no such file found`);
    process.exit(1);
  }

  const script = fs.readFileSync(file, 'utf-8');
  const executableScript = parse(script);

  run(executableScript);
};

main();
