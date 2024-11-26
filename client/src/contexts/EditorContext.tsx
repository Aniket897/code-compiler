import axios from "axios";
import { createContext, useContext, useState } from "react";

type editorContextType = {
  output: string;
  code: string;
  handleCompile: () => Promise<void>;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  lang: { label: string; ext: string };
  setLang: React.Dispatch<
    React.SetStateAction<{
      label: string;
      ext: string;
    }>
  >;
  loading: boolean;
};
const editorContext = createContext<editorContextType>({} as editorContextType);

export const useEditor = () => {
  return useContext(editorContext);
};

const supportedLangs = [
  { label: "JavaScript", ext: "js" },
  { label: "Python", ext: "py" },
];

export default function EditorContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState(supportedLangs[0]);
  const [output, setOutput] = useState("");
  const [jobId, setJobId] = useState("");

  let pullInterval: string | number | NodeJS.Timeout | undefined;

  const handleCompile = async () => {
    if (!code) return;

    try {
      setLoading(true);
      setOutput("");
      setJobId("");
      const response = await axios.post("http://localhost:8080/compile", {
        code,
        lang: lang.ext,
        input,
      });
      console.log(response);
      setJobId(response.data.jobId);

      // Pulling
      pullInterval = setInterval(async () => {
        console.log("JOBID :", jobId);
        try {
          const resonse = await axios.get(
            `http://localhost:8080/status/${response.data.jobId}`
          );
          const { job } = resonse.data;

          // If job is pending sending pulling request again
          if (job.status == "pending") {
            return;
          }

          // If code executed successfully setting output and clearing Interval
          setOutput(job.output);
          clearInterval(pullInterval);
          setLoading(false);
        } catch (error) {
          clearInterval(pullInterval);
          setLoading(false);
          console.log(error);
        }
      }, 200);
    } catch (error) {
      console.error(error);
      setOutput("Error in compilation or execution.");
    }
  };

  return (
    <editorContext.Provider
      value={{
        output,
        handleCompile,
        loading,
        setCode,
        setLang,
        lang,
        code,
      }}
    >
      {children}
    </editorContext.Provider>
  );
}
