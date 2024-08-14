import { JSX } from 'preact';
import PDFViewer from '../molecules/PDFViewer.tsx';

export type DocumentViewerProps = {
  fileUrl: string;
} & JSX.HTMLAttributes<HTMLDivElement>;

const getFileExtension = (url: string): string => {
  return url.split('.').pop()?.toLowerCase() || '';
};

export default function DocumentViewer({
  fileUrl,
  ...props
}: DocumentViewerProps): JSX.Element {
  const extension = getFileExtension(fileUrl);

  let display = <div>Unsupported file format</div>;

  switch (extension) {
    case 'pdf': {
      display = <PDFViewer pdfUrl={fileUrl} {...props} />;
      break;
    }
  }

  return <>{display}</>;
}
