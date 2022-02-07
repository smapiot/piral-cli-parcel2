import type { PiralBuildHandler } from 'piral-cli';
import { Parcel } from '@parcel/core';
import { getFreePort } from 'piral-cli/utils';
import { getLevel } from './common';
import { runParcel } from './bundler-run';

const handler: PiralBuildHandler = {
  async create(options) {
    const port = options.hmr ? await getFreePort(62123) : undefined;
    const bundler = new Parcel({
      entries: options.entryFiles,
      config: require.resolve('../../piral.config.json'),
      hmrOptions: port && { port },
      mode: process.env.NODE_ENV || 'development',
      shouldContentHash: options.contentHash,
      shouldPatchConsole: false,
      serveOptions: false,
      shouldProfile: undefined,
      shouldBuildLazily: undefined,
      shouldAutoInstall: true,
      additionalReporters: [
        {
          packageName: '@parcel/reporter-cli',
          resolveFrom: __filename,
        },
      ],
      defaultTargetOptions: {
        shouldOptimize: options.minify,
        sourceMaps: options.sourceMaps,
        shouldScopeHoist: process.env.NODE_ENV === 'production',
        publicUrl: options.publicUrl,
        distDir: undefined,
      },
      targets: {
        app: {
          context: 'browser',
          outputFormat: 'commonjs',
          distDir: options.outDir || 'dist',
          distEntry: options.outFile || 'index.html',
          isLibrary: false,
        },
      },
      logLevel: getLevel(options.logLevel),
    });

    return runParcel(bundler, options);
  },
};

export const create = handler.create;
