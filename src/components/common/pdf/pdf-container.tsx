import { lazy, Suspense } from "react";
import Loader from "../loader";

const PDFDocument = lazy(() => import("./pdf-document"));

export default function PdfContainer() {
  return (
    <div className="w-full h-screen">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Loader />
          </div>
        }
      >
        <PDFDocument />
      </Suspense>
    </div>
  );
}
