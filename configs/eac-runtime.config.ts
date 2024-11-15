import { EaCRuntime } from '@fathym/eac/runtime';
import { defineEaCApplicationsConfig } from '@fathym/eac-applications/runtime';
import DocumentViewerRuntimePlugin from '../src/plugins/DocumentViewerRuntimePlugin.ts';

export const config = defineEaCApplicationsConfig({
  Plugins: [new DocumentViewerRuntimePlugin()],
});

export function configure(_rt: EaCRuntime): Promise<void> {
  return Promise.resolve();
}
