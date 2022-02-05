import type { PiletBuildHandler } from 'piral-cli';
import { Parcel } from '@parcel/core';
import { resolve } from 'path';
import { getLevel } from './common';
import { runParcel } from './bundler-run';

const handler: PiletBuildHandler = {
  create(options) {
    process.env.PILET_ENTRY = resolve(options.root, options.entryModule);
    process.env.PILET_IMPORTMAP = JSON.stringify(options.importmap);

    const includeNodeModules = {};

    options.externals.forEach((name) => {
      includeNodeModules[name] = false;
    });

    options.importmap.forEach((dep) => {
      includeNodeModules[dep.name] = false;
    });

    const bundler = new Parcel({
      entries: options.entryModule,
      config: require.resolve('../../pilet.config.json'),
      mode: process.env.NODE_ENV || 'development',
      shouldContentHash: options.contentHash,
      shouldPatchConsole: false,
      serveOptions: false,
      shouldProfile: undefined,
      shouldBuildLazily: undefined,
      shouldAutoInstall: true,
      additionalReporters: [],
      defaultTargetOptions: {
        shouldOptimize: options.minify,
        sourceMaps: options.sourceMaps,
        shouldScopeHoist: true,
        publicUrl: undefined,
        distDir: undefined,
      },
      targets: {
        module: {
          context: 'browser',
          outputFormat: 'esmodule',
          includeNodeModules,
          distDir: options.outDir,
          distEntry: options.outFile,
          isLibrary: true,
        },
      },
      logLevel: getLevel(options.logLevel),
    });

    return runParcel(bundler, options);
  },
};

export const create = handler.create;
