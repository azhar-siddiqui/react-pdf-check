import { lazy, Suspense } from "react";
import Loader from "./components/common/loader";

const PdfContainer = lazy(() => import("./components/common/pdf-container"));

function App() {
  return (
    <div className="w-full h-screen">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Loader />
          </div>
        }
      >
        <PdfContainer />
      </Suspense>
    </div>
  );
}

export default App;
