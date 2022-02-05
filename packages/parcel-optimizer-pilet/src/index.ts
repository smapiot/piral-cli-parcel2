import { Optimizer } from '@parcel/plugin';
import { blobToString } from '@parcel/utils';
import SourceMap from '@parcel/source-map';
import { transformAsync } from '@babel/core';

export default new Optimizer({
  async optimize({ contents, map, bundle, getSourceMapReference }) {
    const entry = bundle.getMainEntry();
    const path = entry.filePath;
    const name = process.env.BUILD_PCKG_NAME;
    const requireRef = `parcel2pr_${name.replace(/\W/gi, '')}`;
    const isEntryModule = path === process.env.PILET_ENTRY;
    const importmap = JSON.parse(process.env.PILET_IMPORTMAP);
    const plugins: Array<any> = [
      [
        require.resolve('./importmap-plugin'),
        {
          importmap,
        },
      ],
    ];

    if (isEntryModule) {
      plugins.push([
        require.resolve('./banner-plugin'),
        {
          name,
          importmap,
          requireRef,
          cssFiles: [],
        },
      ]);
    }

    const code = await blobToString(contents);

    const result = await transformAsync(code, {
      sourceMaps: true,
      inputSourceMap: map.toVLQ() as any,
      comments: isEntryModule,
      plugins,
      presets: [
        [
          '@babel/preset-env',
          {
            modules: 'systemjs',
          },
        ],
      ],
    });

    const sourceMap = new SourceMap();
    sourceMap.addVLQMap(result.map);

    // Add source map reference to compiled code
    const url = await getSourceMapReference(sourceMap);
    result.code += `\n//# sourceMappingURL=${url}\n`;

    return { contents: result.code, map: sourceMap };
  },
});
