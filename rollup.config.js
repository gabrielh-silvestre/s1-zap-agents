const typescript = require('rollup-plugin-typescript2');
const pkg = require('./package.json');

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: 'inline',
      strict: true,
    },
  ],
  external: ['whatsapp-web.js', 's1-agents'],
  plugins: [typescript()],
};
