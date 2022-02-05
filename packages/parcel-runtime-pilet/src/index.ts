import { Runtime } from '@parcel/plugin';

export default new Runtime({
  async apply({ bundle, bundleGraph }) {
    if (bundle.type === 'js') {
      const name = process.env.BUILD_PCKG_NAME;
      const debug = process.env.NODE_ENV !== 'production';
      const [refCss] = bundleGraph
        .getReferencedBundles(bundle)
        .map((b) => b.displayName)
        .filter((b) => b.endsWith('.css'));

      if (refCss) {
        const { publicUrl } = bundle.target;
        const url = publicUrl ? (publicUrl.endsWith('/') ? `${publicUrl}${refCss}` : `${publicUrl}/${refCss}`) : refCss;

        return {
          code: [
            `var d=document`,
            `var u=${JSON.stringify(url)}`,
            `var e=d.createElement("link")`,
            `e.setAttribute('data-origin', ${JSON.stringify(name)})`,
            `e.type="text/css"`,
            `e.rel="stylesheet"`,
            `e.href=${debug ? 'u+"?_="+Math.random()' : 'u'}`,
            `d.head.appendChild(e)`,
          ].join(';'),
          filePath: `load-css.js`,
          isEntry: true,
        };
      }
    }
  },
});
