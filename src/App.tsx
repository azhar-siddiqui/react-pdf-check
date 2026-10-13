import { PDFViewer } from "@react-pdf/renderer";
import Report from "./components/common/document";

function App() {
  return (
    <div className="w-full h-screen">
      <PDFViewer width="100%" height="100%">
        <Report />
      </PDFViewer>
    </div>
  );
}

export default App;
