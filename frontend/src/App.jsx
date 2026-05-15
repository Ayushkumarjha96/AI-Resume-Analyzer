import { useState } from "react";
import axios from "axios";

function App() {
const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [atsScore, setAtsScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);

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
        "http://localhost:5000/upload",
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

    <div className="min-h-screen bg-black text-white flex flex-col items-center p-10">

      <h1 className="text-5xl font-bold mb-10">
        AI Resume Analyzer
      </h1>

      <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg w-full max-w-xl">

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-5"
        />

        <br />

        <button
          onClick={handleUpload}
  className="bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700 text-white font-semibold"
>

  {loading ? "Analyzing..." : "Upload Resume"}
        </button>
 
        <div className="mt-8">

          <h2 className="text-3xl font-bold">
            ATS Score: {atsScore}%
          </h2>
          <div className="w-full bg-gray-700 rounded-full h-4 mt-4">

  <div
    className="bg-green-500 h-4 rounded-full"
    style={{ width: `${atsScore}%` }}
  ></div>

</div>

        </div>

        <div className="mt-8">

          <h2 className="text-2xl font-semibold mb-3">
            Detected Skills
          </h2>

          <div className="flex flex-wrap gap-3">

            {skills.map((skill, index) => (

              <span
                key={index}
                className="bg-green-600 px-4 py-2 rounded-full"
              >
                {skill}
              </span>

            ))}

          </div>

        </div>

        <div className="mt-8">

          <h2 className="text-2xl font-semibold mb-3">
            Suggestions
          </h2>

          <ul className="space-y-2 list-none">

            {suggestions.map((item, index) => (

              <li
                key={index}
                className="bg-zinc-800 p-3 rounded-lg"
              >
                {item}
              </li>

            ))}

          </ul>

        </div>

      </div>

    </div>
  );
}

export default App;