import { Transformer } from '@parcel/plugin';

function reloadGenerator(name: string) {
  delete require.cache[require.resolve(name)];
  return require(name);
}

interface CodegenOptions {
  outDir: string;
  rootDir: string;
}

async function compile(name: string, options: CodegenOptions) {
  const watchFiles = [];
  const generator = reloadGenerator(name);
  const contents = await generator.call({
    name,
    options,
    addDependency: (file, options) => {
      watchFiles.push(file);
    },
  });
  return {
    watchFiles,
    contents,
  };
}

export default new Transformer({
  async transform({ asset, options }) {
    const outDir = options.projectRoot + '/dist';

    const result = await compile(asset.filePath, {
      outDir,
      rootDir: options.projectRoot,
    });

    for (const specifier of result.watchFiles) {
      asset.addDependency({
        specifier,
        specifierType: 'esm',
      });
    }

    asset.type = 'js';
    asset.setCode(result.contents);

    return [asset];
  },
});
