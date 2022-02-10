# `parcel-transformer-codegen`

A plugin for `parcel` (v2) to allow bundle-time asset generation. This can be useful to work efficiently with established conventions and reduce duplication and boilerplate code.

It follows pretty much the [parcel-plugin-codegen](https://www.npmjs.com/package/parcel-plugin-codegen) implementation.

## Usage

Install the plugin:

```sh
npm i parcel-transformer-codegen --save-dev
```

Now in your `parcel` configuration file you can do:

```json
{
  // ...
  "transformers": {
    "*.codegen": ["parcel-transformer-codegen"]
  }
}
```

At this point you can reference a `.codegen` file in any file, e.g., in a TypeScript asset

```js
import generatedModule from './my.codegen';
```

Create a `.codegen` file with the structure:

```js
module.exports = function() {
  return `export default function() {}`;
};
```

### Async Generation

You can also use promises in your code generation. As an example, if your `.codegen` file looks similar to this:

```js
module.exports = function() {
  return callSomeApi().then(result => `export default function() { return ${JSON.stringify(result)}; }`);
};
```

The new asset will be created asynchronously. Furthermore, you can obviously use `require` or `import` directly in your generated code. Since the asset will be run through `parcel` like any other asset, you can use this mechanism to include files from a directory without referencing them explicitly:

```js
module.exports = function() {
  return `
    import { lazy } from 'react';
    export default lazy(() => import(${JSON.stringify(filePath)}));
  `;
};
```

## License

This plugin is released using the MIT license. For more information see the [LICENSE file](LICENSE).
