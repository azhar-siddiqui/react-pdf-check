import { PDFViewer } from "@react-pdf/renderer";
import Report from "./document";

export default function PdfContainer() {
  return (
    <PDFViewer width="100%" height="100%">
      <Report />
    </PDFViewer>
  );
}
