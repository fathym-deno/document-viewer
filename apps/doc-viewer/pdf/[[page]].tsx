import { pdfjs } from '../../../src/src.deps.ts';
import { STATUS_CODE } from '@std/http';
import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';

export type PDFData = {
  View: string;
};

export const handler: EaCRuntimeHandlerSet<unknown, PDFData> = {
  async GET(_req, ctx) {
    const pageNum = JSON.parse(ctx.Params.page || '1') as number;

    const pdfUrl = new URLSearchParams(ctx.Runtime.URLMatch.Search).get(
      'pdfUrl',
    );

    if (!pdfUrl) {
      return new Response('The PDF URL was not found.', {
        status: STATUS_CODE.NotFound,
      });
    }

    const loadingTask = pdfjs.getDocument(pdfUrl);

    const pdf = await loadingTask.promise;

    const page = await pdf.getPage(pageNum);

    const viewport = page.getViewport({ scale: 1.5 });

    // Render the PDF page to an image
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    // Convert canvas to data URL
    const pdfView = canvas.toDataURL('image/png');

    const data: PDFData = {
      View: pdfView,
    };

    return ctx.Render(data);
  },
};

export default function PDF({ View }: PDFData) {
  return <img src={View} alt='PDF Page' />;
}
