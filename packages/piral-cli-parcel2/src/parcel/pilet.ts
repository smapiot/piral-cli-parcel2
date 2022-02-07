import type { PiletBuildHandler } from 'piral-cli';
import { createWorkerFarm, Parcel } from '@parcel/core';
import { resolve } from 'path';
import { getLevel } from './common';
import { runParcel } from './bundler-run';

type WorkerFarm = ReturnType<typeof createWorkerFarm>;

interface BundlerOptions {
  workerFarm: WorkerFarm;
  entry: string;
  distEntry: string;
  contentHash: boolean;
  minify: boolean;
  sourceMaps: boolean;
  outDir: string;
  logLevel: number;
  includeNodeModules: Record<string, boolean>;
}

function createBundler(options: BundlerOptions) {
  return new Parcel({
    workerFarm: options.workerFarm,
    entries: options.entry,
    config: require.resolve('../../pilet.config.json'),
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
      shouldScopeHoist: true, // otherwise does not seem to make esm as it should
      publicUrl: undefined,
      distDir: undefined,
    },
    targets: {
      module: {
        context: 'browser',
        outputFormat: 'esmodule',
        includeNodeModules: options.includeNodeModules,
        distDir: options.outDir,
        distEntry: options.distEntry,
        isLibrary: true,
      },
    },
    logLevel: getLevel(options.logLevel),
  });
}

const handler: PiletBuildHandler = {
  create(options) {
    process.env.PILET_ENTRY = resolve(options.root, options.entryModule);
    process.env.PILET_IMPORTMAP = JSON.stringify(options.importmap);

    const workerFarm = createWorkerFarm();
    const includeNodeModules = {};
    const sideBundlers: Array<Parcel> = [];

    // first populate with global externals
    options.externals.forEach((name) => {
      includeNodeModules[name] = false;
    });

    // then populate with distributed externals
    options.importmap.forEach((dep) => {
      includeNodeModules[dep.name] = false;
    });

    // for the distributed ones also fill the extra bundlers
    options.importmap.forEach((dep) => {
      sideBundlers.push(
        createBundler({
          ...options,
          distEntry: dep.ref,
          entry: dep.entry,
          includeNodeModules,
          workerFarm,
        }),
      );
    });

    const bundler = createBundler({
      ...options,
      distEntry: options.outFile,
      entry: options.entryModule,
      includeNodeModules,
      workerFarm,
    });

    return runParcel(bundler, { ...options, sideBundlers });
  },
};

export const create = handler.create;
