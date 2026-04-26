import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { parseResume, startFull } from "../api";

export default function Upload() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState("");
  const [jd, setJd] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const res = await parseResume(file);
      setSkills(res.data.skills.join(", "));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleStart = async () => {
    if (!skills || !jd) return;

    setLoading(true);
    try {
      console.log("SENDING:", skills.split(","), jd);

      await startFull({
        skills: skills.split(","),
        jd,
        deadline: Number(deadline)
      });

      navigate("/chat");
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white px-20 pt-20 relative overflow-hidden">
      <div className="absolute w-[800px] h-[800px] bg-purple-600/20 blur-[200px] rounded-full pointer-events-none"></div>

      <h1 className="text-[60px] font-light mb-16">
        Upload Details
      </h1>

      <div className="grid grid-cols-2 gap-x-40 gap-y-16 max-w-5xl">
        <div>
          <p className="text-gray-400 mb-3">Resume</p>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="block text-sm text-gray-300"
          />

          <button
            onClick={handleUpload}
            className="mt-4 px-6 py-2 border border-purple-500 rounded-full 
                       hover:bg-purple-600 transition"
          >
            {loading ? "Extracting..." : "Extract Skills"}
          </button>
        </div>

        <div>
          <p className="text-gray-400 mb-3">Job Description</p>

          <textarea
            value={jd}
            onChange={(e) => {
              console.log(e.target.value);
              setJd(e.target.value);
            }}
            placeholder="Paste job description..."
            className="w-full bg-transparent border-b border-gray-600 
             focus:outline-none py-2 text-sm"
            rows={5}
          />

          <input
            type="number"
            placeholder="Days until interview (e.g. 7)"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full mt-4 bg-transparent border-b border-gray-600 
             focus:outline-none py-2 text-sm"
          />
        </div>

        <div className="col-span-2">
          <p className="text-gray-400 mb-3">Skills</p>

          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Extracted skills will appear here"
            className="w-full bg-transparent border-b border-gray-600 
                       focus:outline-none py-2 text-sm"
          />
        </div>
      </div>

      <button
        onClick={handleStart}
        className="mt-24 px-10 py-3 border border-purple-500 rounded-full 
                   hover:bg-purple-600 
                   hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] 
                   transition-all duration-300"
      >
        {loading ? "Starting..." : "Start Assessment >"}
      </button>
    </div>
  );
}
