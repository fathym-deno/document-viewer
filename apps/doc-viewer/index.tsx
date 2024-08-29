import { EaCRuntimeHandlerResult, PageProps } from '@fathym/eac-runtime';
import { STATUS_CODE } from '@std/http';
import DocumentViewer from '../../src/organisms/DocumentViewer.tsx';

export type IndexData = {
  FileURL: string;
};

export const handler: EaCRuntimeHandlerResult<unknown, IndexData> = {
  GET: (_req, ctx) => {
    const fileUrl = new URLSearchParams(ctx.Runtime.URLMatch.Search).get(
      'fileUrl',
    );

    if (!fileUrl) {
      return new Response('The File URL was not found.', {
        status: STATUS_CODE.NotFound,
      });
    }

    const _isExternal = fileUrl.startsWith('http://') || fileUrl.startsWith('https://');

    const data: IndexData = {
      FileURL: fileUrl,
    };

    return ctx.Render(data);
  },
};

export default function Index({ Data }: PageProps<IndexData>) {
  return <DocumentViewer fileType='pdf' fileUrl={Data.FileURL} />;
}
