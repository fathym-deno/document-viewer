import { JSX } from '../src.deps.ts';
import PDFViewer from '../molecules/PDFViewer.tsx';

export type DocumentViewerTypes = 'pdf';

export type DocumentViewerProps = {
  fileType: DocumentViewerTypes;

  fileUrl: string;
} & JSX.HTMLAttributes<HTMLDivElement>;

export default function DocumentViewer({
  fileType,
  fileUrl,
  ...props
}: DocumentViewerProps): JSX.Element {
  let display = <div>Unsupported file format</div>;

  switch (fileType) {
    case 'pdf': {
      display = <PDFViewer pdfUrl={fileUrl} {...props} />;
      break;
    }
  }

  return <>{display}</>;
}
