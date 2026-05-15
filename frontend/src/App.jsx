import { useState } from "react";
import axios from "axios";

function App() {

  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [atsScore, setAtsScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {

    setLoading(true);

    if (!file) {
      alert("Please select a file");
      setLoading(false);
      return;
    }

    const formData = new FormData();

    formData.append("resume", file);

    try {

      const res = await axios.post(
        "https://render.com/docs/node-version",
        formData
      );

      setSkills(res.data.skills);
      setAtsScore(res.data.atsScore);
      setSuggestions(res.data.suggestions);

      setLoading(false);

    } catch (error) {

      console.log(error);

      alert("Upload failed");

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center p-6">

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-3xl">

        <h1 className="text-5xl font-bold text-center mb-8">
          AI Resume Analyzer
        </h1>

        <div className="flex flex-col items-center gap-5">

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="bg-gray-800 p-3 rounded-xl w-full"
          />

          <button
            onClick={handleUpload}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl text-lg font-semibold transition duration-300"
          >
            {loading ? "Analyzing..." : "Upload Resume"}
          </button>

        </div>

        <div className="mt-10">

          <h2 className="text-3xl font-bold mb-4">
            ATS Score: {atsScore}%
          </h2>

          <div className="w-full bg-gray-700 rounded-full h-5">

            <div
              className="bg-green-500 h-5 rounded-full transition-all duration-500"
              style={{ width: `${atsScore}%` }}
            ></div>

          </div>

        </div>

        <div className="mt-10">

          <h2 className="text-3xl font-bold mb-5">
            Detected Skills
          </h2>

          <div className="flex flex-wrap gap-3">

            {skills.map((skill, index) => (

              <span
                key={index}
                className="bg-blue-500/20 border border-blue-400 px-4 py-2 rounded-full text-lg"
              >
                {skill}
              </span>

            ))}

          </div>

        </div>

        <div className="mt-10">

          <h2 className="text-3xl font-bold mb-5">
            Suggestions
          </h2>

          <div className="space-y-3">

            {suggestions.map((suggestion, index) => (

              <div
                key={index}
                className="bg-yellow-500/10 border border-yellow-400 p-4 rounded-xl"
              >
                {suggestion}
              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;