export * from 'jsr:@fathym/common@0';

export * from 'jsr:@fathym/atomic@0.0.156';

import * as pdfjs from 'npm:pdfjs-dist@4.5.136';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@4.5.136/build/pdf.worker.entry.js';
// import.meta.resolve(
//   `npm:pdfjs-dist/build/pdf.worker.entry.js`
// );
//'https://esm.sh/pdfjs-dist@4.5.136/build/pdf.worker.js';
//'/pdf-worker';
console.log(pdfjs.GlobalWorkerOptions.workerSrc);

export { pdfjs };