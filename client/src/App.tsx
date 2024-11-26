import EditorComponent from "@/components/EditorComponent";
import Output from "@/components/Output";
import Navbar from "@/components/Navbar";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

function App() {
  return (
    <div className="flex flex-col h-screen w-screen">
      <Navbar />
      {/* Resizable Layout */}
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 overflow-hidden"
      >
        {/* Editor panel */}
        <ResizablePanel defaultSize={60} className="space-x-3">
          <EditorComponent />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} className="p-4">
          <ResizablePanel defaultSize={50} className="flex flex-col gap-4 p-4">
            <Output />
          </ResizablePanel>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default App;
