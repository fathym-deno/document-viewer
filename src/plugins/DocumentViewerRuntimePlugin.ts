import { EaCRuntimeConfig } from '@fathym/eac/runtime/config';
import { EaCRuntimePlugin, EaCRuntimePluginConfig } from '@fathym/eac/runtime/plugins';
import {
  EaCProjectAsCode,
  EaCProjectResolverConfiguration,
  EverythingAsCodeApplications,
} from '@fathym/eac-applications';
import { EaCPreactAppProcessor, EaCRedirectProcessor } from '@fathym/eac-applications/processors';
import type { EaCLocalDistributedFileSystemDetails, EverythingAsCodeDFS } from '@fathym/eac-dfs';
import { EverythingAsCode } from '@fathym/eac';

export default class DocumentViewerRuntimePlugin implements EaCRuntimePlugin {
  constructor(
    protected projectLookup: string | undefined = 'core',
    protected appName: string | undefined = 'docViewer',
    protected hosts: string[] | undefined = [],
  ) {}

  public Setup(config: EaCRuntimeConfig) {
    const pluginConfig: EaCRuntimePluginConfig<
      EverythingAsCode & EverythingAsCodeApplications & EverythingAsCodeDFS
    > = {
      Name: DocumentViewerRuntimePlugin.name,
      Plugins: [],
      EaC: {
        Projects: {
          ...(this.projectLookup
            ? {
              [this.projectLookup]: {
                Details: {
                  Priority: 100,
                },
                ResolverConfigs: {
                  localhost: {
                    Hostname: 'localhost',
                    Port: config.Server.port || 8000,
                  },
                  '127.0.0.1': {
                    Hostname: '127.0.0.1',
                    Port: config.Server.port || 8000,
                  },
                  'host.docker.internal': {
                    Hostname: 'host.docker.internal',
                    Port: config.Server.port || 8000,
                  },
                  ...(this.hosts?.length
                    ? this.hosts.reduce((acc, host) => {
                      acc[host] = {
                        Hostname: 'proconex-web-runtime.azurewebsites.net',
                      };

                      return acc;
                    }, {} as Record<string, EaCProjectResolverConfiguration>)
                    : {}),
                },
                ApplicationResolvers: {
                  ...(this.appName
                    ? {
                      [this.appName]: {
                        PathPattern: '*',
                        Priority: 0,
                      },
                    }
                    : {}),
                  pdfViewer: {
                    PathPattern: '/pdf-js/pdf-worker',
                    Priority: 500,
                  },
                },
              } as EaCProjectAsCode,
            }
            : {}),
        },
        Applications: {
          ...(this.appName
            ? {
              [this.appName]: {
                Details: {},
                Processor: {
                  Type: 'PreactApp',
                  AppDFSLookup: 'local:apps/doc-viewer',
                  ComponentDFSLookups: [['local:src', ['tsx']]],
                } as EaCPreactAppProcessor,
              },
            }
            : {}),
          pdfViewer: {
            Details: {},
            Processor: {
              Type: 'Redirect',
              Permanent: true,
              PreserveMethod: true,
              Redirect: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.mjs',
            } as EaCRedirectProcessor,
          },
        },
        DFSs: {
          'local:apps/doc-viewer': {
            Details: {
              Type: 'Local',
              FileRoot: './apps/doc-viewer/',
              DefaultFile: 'index.tsx',
              Extensions: ['tsx'],
              WorkerPath: import.meta.resolve(
                '@fathym/eac-runtime/workers/local',
              ),
            } as EaCLocalDistributedFileSystemDetails,
          },
          'local:src': {
            Details: {
              Type: 'Local',
              FileRoot: './src/',
              Extensions: ['tsx'],
              WorkerPath: import.meta.resolve(
                '@fathym/eac-runtime/workers/local',
              ),
            } as EaCLocalDistributedFileSystemDetails,
          },
        },
      },
    };

    return Promise.resolve(pluginConfig);
  }
}
