// deno-lint-ignore-file no-explicit-any
import { JSX, useEffect, useRef, useState } from '../src.deps.ts';
import { classSet, pdfjs } from '../src.deps.ts';

export const IsIsland = true;

export type PDFViewerProps = {
  pdfUrl: string;
} & JSX.HTMLAttributes<HTMLDivElement>;

export default function PDFViewer({
  pdfUrl,
  ...props
}: PDFViewerProps): JSX.Element {
  const _isBrowser = typeof document !== 'undefined';

  const [numPages, setNumPages] = useState(0);

  const [pageNumber, setPageNumber] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadDocument = async (url: string) => {
    try {
      const loadingTask = pdfjs.getDocument(url);
      const pdf = await loadingTask.promise;
      setNumPages(pdf.numPages);
      renderPage(pdf, 1);
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  };

  const renderPage = async (pdf: any, pageNum: number) => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;
    }
  };

  const goToPage = (offset: number) => {
    const newPageNumber = pageNumber + offset;
    if (newPageNumber > 0 && newPageNumber <= numPages) {
      setPageNumber(newPageNumber);
      loadDocumentPage(newPageNumber);
    }
  };

  const loadDocumentPage = async (pageNum: number) => {
    if (pdfUrl) {
      const loadingTask = pdfjs.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      renderPage(pdf, pageNum);
    }
  };

  useEffect(() => {
    console.log('PDFViewer');
    if (pdfUrl) {
      console.log(pdfUrl);
      loadDocument(pdfUrl);
    }
  }, [pdfUrl]);

  return (
    <div {...props} class={classSet(['-:p-1'], props)}>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid black', display: 'block', margin: 'auto' }}
      />

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button onClick={() => goToPage(-1)} disabled={pageNumber <= 1}>
          Previous
        </button>

        <span style={{ margin: '0 1rem' }}>
          Page {pageNumber} of {numPages}
        </span>

        <button onClick={() => goToPage(1)} disabled={pageNumber >= numPages}>
          Next
        </button>
      </div>
    </div>
  );
}
