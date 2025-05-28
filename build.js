const esbuild = require('esbuild');
const sassPlugin = require('esbuild-sass-plugin').default;
const fs = require('fs');
const path = require('path');

// Копируем статические файлы
function copyStaticFiles() {
  const staticDirs = ['i'];
  const distDir = 'dist';

  // Создаем dist директорию если её нет
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }

  // Копируем статические директории
  staticDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const targetDir = path.join(distDir, dir);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      copyDir(dir, targetDir);
    }
  });
}

// Рекурсивное копирование директории
function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Сборка проекта
async function build(serve = false) {
  try {
    // Копируем статические файлы
    copyStaticFiles();

    const buildOptions = {
      entryPoints: ['index.html', 'styles/main.scss'],
      bundle: true,
      outdir: 'dist',
      minify: !serve,
      sourcemap: serve, // Добавляем sourcemap для разработки
      plugins: [
        sassPlugin({
          type: 'css',
          loadPaths: ['styles'],
          cssImports: true,
          watch: serve // Включаем отслеживание изменений для SCSS
        })
      ],
      loader: {
        '.html': 'copy',
        '.png': 'copy',
        '.jpg': 'copy',
        '.jpeg': 'copy',
        '.gif': 'copy',
        '.svg': 'copy'
      }
    };

    if (serve) {
      // Режим разработки
      const ctx = await esbuild.context(buildOptions);
      
      // Включаем режим наблюдения за файлами
      await ctx.watch();
      
      // Запускаем сервер разработки
      const { host, port } = await ctx.serve({
        servedir: 'dist',
        port: 3001,
        onRequest: (args) => {
          console.log(`${args.method}: ${args.path}`);
        }
      });
      
      console.log(`Server running at http://${host}:${port}`);
      console.log('Watching for changes...');
    } else {
      // Режим сборки
      await esbuild.build(buildOptions);
      console.log('Build completed successfully!');
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Проверяем, запущен ли скрипт через npm start
const isStart = process.env.npm_lifecycle_event === 'start';
build(isStart); 