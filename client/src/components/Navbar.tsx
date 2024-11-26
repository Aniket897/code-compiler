import { Button } from "@/components/ui/button";
import { useEditor } from "@/contexts/EditorContext";
import ButtonLoader from "@/components/ButtonLoader";
import { Play } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const supportedLangs = [
  { label: "JavaScript", ext: "js" },
  { label: "Python", ext: "py" },
];

function Navbar() {
  const { loading, lang, setLang, handleCompile } = useEditor();
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <h1 className="text-xl font-bold">Code Compiler</h1>
      <div className="flex items-center gap-x-4">
        {/* shadcn Select */}
        <Select
          value={lang.ext}
          onValueChange={(value) =>
            setLang(
              supportedLangs.find((item) => item.ext === value) ||
                supportedLangs[0]
            )
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {supportedLangs.map((lang) => (
              <SelectItem key={lang.ext} value={lang.ext}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* shadcn Button */}
        <Button onClick={handleCompile} disabled={loading}>
          {loading ? (
            <>
              <ButtonLoader />
              <p>Executing...</p>
            </>
          ) : (
            <>
              <Play />
              <p>Run</p>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default Navbar;
