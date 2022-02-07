# piral-cli-parcel2

The `piral-cli` plugin for using `parcel` (v2) as bundler.

## Status

- [x] Pilets (tested / working)
    - [x] Codegen
    - [x] Bundle Splitting
    - [x] ESM output
    - [x] CSS / SASS
    - [x] Importmap references
    - [x] Importmap bundles
    - [x] v2 banner
    - [x] tsconfig changes
    - [x] Building
    - [x] Debugging
    - [ ] Reloading (problem on every second turn)
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
