const esbuild = require('esbuild');
const sassPlugin = require('esbuild-sass-plugin').default;

esbuild.build({
  entryPoints: ['index.html'],
  bundle: true,
  outdir: 'dist',
  minify: true,
  plugins: [sassPlugin()],
  loader: {
    '.html': 'copy',
    '.png': 'copy',
    '.jpg': 'copy',
    '.jpeg': 'copy',
    '.gif': 'copy',
    '.svg': 'copy'
  }
}).catch(() => process.exit(1)); 