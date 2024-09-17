import { JSX, useEffect, useRef, useState } from '../src.deps.ts';
import { classSet, pdfjs } from '../src.deps.ts';

export const IsIsland = true;

export type PDFViewerProps = {
  onPageChange?: (page: number, content: string) => void;

  page?: number;

  pdfUrl: string;
} & JSX.HTMLAttributes<HTMLDivElement>;

export default function PDFViewer({
  page,
  pdfUrl,
  ...props
}: PDFViewerProps): JSX.Element {
  const _isBrowser = typeof document !== 'undefined';

  const [numPages, setNumPages] = useState(0);

  const [pageNumber, setPageNumber] = useState<number>(0);

  const [pdf, setPDF] = useState<pdfjs.PDFDocumentProxy>();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadDocument = async (url: string) => {
    try {
      const loadingTask = pdfjs.getDocument(url);

      const pdf = await loadingTask.promise;

      setNumPages(pdf.numPages);

      setPDF(pdf);
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  };

  const changePage = (offset: number) => {
    const newPageNumber = pageNumber + offset;

    setPageNumber(newPageNumber);
  };

  const goToPage = (newPageNumber: number) => {
    if (newPageNumber > 0 && newPageNumber <= numPages) {
      renderPage(newPageNumber);
    }
  };

  const renderPage = async (pageNum: number) => {
    if (pdf) {
      const page = await pdf.getPage(pageNum);

      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = canvasRef.current;

      if (canvas) {
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;

        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context!,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        const pageContentText = await page.getTextContent();

        const pageContent = pageContentText.items.reduce((acc, text) => {
          console.log(text);
          // deno-lint-ignore no-explicit-any
          return `${acc}${(text as any).str}`;
        }, '');
        console.log(pageContent);

        props.onPageChange?.(
          pageNum,
          pageContent,
        );
      }
    }
  };

  useEffect(() => {
    if (pdfUrl) {
      loadDocument(pdfUrl);
    }
  }, [pdfUrl]);

  useEffect(() => {
    if (pdf) {
      setPageNumber(page ?? 1);
    }
  }, [pdf]);

  useEffect(() => {
    if (pdf) {
      setPageNumber(page ?? 1);
    }
  }, [page]);

  useEffect(() => {
    if (pageNumber) {
      goToPage(pageNumber ?? 1);
    }
  }, [pageNumber]);

  return (
    <div {...props} class={classSet(['-:p-1 -:relative'], props)}>
      <canvas ref={canvasRef} class='block m-auto' />

      <div class='py-2 bg-slate-50 dark:bg-slate-900 text-center m-1 sticky bottom-0'>
        <button onClick={() => changePage(-1)} disabled={pageNumber <= 1}>
          Previous
        </button>

        <span class='mx-6'>
          Page {pageNumber} of {numPages}
        </span>

        <button onClick={() => changePage(1)} disabled={pageNumber >= numPages}>
          Next
        </button>
      </div>
    </div>
  );
}
