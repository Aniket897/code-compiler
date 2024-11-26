import { useEditor } from "@/contexts/EditorContext";
import { Textarea } from "./ui/textarea";

function Output() {
  const { output } = useEditor();
  return (
    <div className="h-[80vh]">
      <h2 className="text-lg font-semibold mb-2">Output</h2>
      <Textarea
        className="w-full h-full p-2 border rounded resize-none"
        readOnly
        value={output}
      />
    </div>
  );
}

export default Output;
