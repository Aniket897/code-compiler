import { useEditor } from "@/contexts/EditorContext";
import { Editor } from "@monaco-editor/react";

function EditorComponent() {
  const { lang, code, setCode } = useEditor();
  return (
    <Editor
      height="100%"
      language={lang.label.toLowerCase()}
      theme="vs-dark"
      value={code}
      onChange={(value) => setCode(value || "")}
      options={{
        fontFamily: "Oxygen Mono",
        fontSize: 16,
        lineHeight: 30,
        padding: { top: 10 },
        folding: false,
        minimap: { enabled: false },
      }}
    />
  );
}

export default EditorComponent;
