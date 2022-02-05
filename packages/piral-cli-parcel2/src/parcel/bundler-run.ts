import { Parcel } from '@parcel/core';
import { EventEmitter } from 'events';

interface ParcelOptions {
  watch: boolean;
  outFile: string;
  outDir: string;
  sideBundlers?: Array<Parcel>;
}

export function runParcel(bundler: Parcel, options: ParcelOptions) {
  const eventEmitter = new EventEmitter();
  const { sideBundlers = [] } = options;
  const bundle = {
    outFile: `/${options.outFile}`,
    outDir: options.outDir,
    name: options.outFile,
    requireRef: undefined,
  };

  return Promise.resolve({
    async bundle() {
      const promises: Array<Promise<any>> = sideBundlers.map((b) => b.run());

      if (options.watch) {
        promises.push(
          bundler.watch((err, event) => {
            if (err) {
              // fatal error
              throw err;
            }

            if (event.type === 'buildSuccess') {
              // let bundles = event.bundleGraph.getBundles();
              eventEmitter.emit('end', bundle);
            } else if (event.type === 'buildFailure') {
              console.log(event.diagnostics);
            } else {
              // should not enter here
              console.log((event as any).type);
            }
          }),
        );
      } else {
        promises.push(bundler.run());
      }

      await Promise.all(promises);
      return bundle;
    },
    onStart(cb) {
      eventEmitter.on('start', cb);
    },
    onEnd(cb) {
      eventEmitter.on('end', cb);
    },
  });
}
