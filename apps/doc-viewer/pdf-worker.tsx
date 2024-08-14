import { EaCRuntimeHandlerResult } from '@fathym/eac-runtime';
import { pdfjs } from '../../src/src.deps.ts';

export const handler: EaCRuntimeHandlerResult = {
  GET: (_req, _ctx) => {
    return fetch(
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`,
    );
  },
};

export default function Doc() {
  return <></>;
}
