import { JSX } from '../src.deps.ts';
import PDFViewer from '../molecules/PDFViewer.tsx';

export type DocumentViewerTypes = 'pdf';

export type DocumentViewerProps = {
  fileType: DocumentViewerTypes;

  fileUrl: string;

  onPageChange?: (page: number) => void;

  page?: number;
} & JSX.HTMLAttributes<HTMLDivElement>;

export default function DocumentViewer({
  fileType,
  fileUrl,
  onPageChange,
  page,
  ...props
}: DocumentViewerProps): JSX.Element {
  let display = <div>Unsupported file format</div>;

  switch (fileType) {
    case 'pdf': {
      display = (
        <PDFViewer
          onPageChange={onPageChange}
          page={page}
          pdfUrl={fileUrl}
          {...props}
        />
      );
      break;
    }
  }

  return <>{display}</>;
}
