[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# piral-cli-parcel2 &middot; [![Build Status](https://smapiot.visualstudio.com/piral-pipelines/_apis/build/status/smapiot.piral-cli-parcel2?branchName=develop)](https://smapiot.visualstudio.com/piral-pipelines/_build/latest?definitionId=106&branchName=develop) ![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)

The `piral-cli` plugin for using `parcel` (v2) as bundler.

## Important Links

* 📢 **[We are hiring!](https://smapiot.com/jobs)** - work with us on Piral, its ecosystem and our users
* 🌍 [Website](https://piral.io/) - learn more about Piral
* 📖 [Documentation](https://docs.piral.io/) - everything to get started and master micro frontends
* 🉐 **Help translating Piral!** - making PRs in the [documentation branch](https://github.com/smapiot/piral/tree/documentation)
* 🐞 [Issue Tracker](https://github.com/smapiot/piral/issues) - report bugs or suggest new features
* 🗨  [Forums](https://stackoverflow.com/questions/tagged/piral) - use the community support on StackOverflow
* 👪 [Community Chat](https://gitter.im/piral-io/community) - ask questions and provide answers in our Gitter room

## Status

- [x] Pilets (tested / working)
    - [x] Codegen
    - [x] Bundle Splitting
    - [x] ESM output
    - [x] CSS / SASS
    - [x] Importmap references
    - [x] Importmap bundles
    - [ ] v0 format (not implemented)
    - [ ] v1 format (not implemented)
    - [x] v2 format
    - [x] tsconfig changes
    - [x] Building
    - [x] Debugging
    - [x] Reloading
- [x] Piral instances (tested / working)
    - [x] Codegen
    - [x] HTML entry point
    - [x] Emulator build
    - [x] Release build
    - [x] tsconfig changes
    - [x] Debugging
    - [x] Reloading

Piral instances require changes:

1. `type="module"` in the `<script>` of *index.html*
2. In the *package.json* we need to include `"@parcel/transformer-js": { "inlineEnvironment": true }`
3. In the *package.json* we need to include `"@parcel/resolver-default": { "packageExports": true }`

Pilets may also require changes:

1. Centrally shared dependencies have to be in the `dependencies` - not the `devDependencies` (e.g., move `react` from `devDependencies` to `dependencies`)
2. Parcel handles the JSX transform of React a bit different - you may need to configure `"jsxFactory": "React.createElement"` in the *tsconfig.json*

## License

This code is released using the MIT license. For more information see the [LICENSE file](LICENSE).
