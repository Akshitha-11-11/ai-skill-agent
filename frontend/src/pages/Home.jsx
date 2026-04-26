import { useState } from "react";
import { startFull, parseResume } from "../api";

export default function Home({ onStart }) {
  const [skills, setSkills] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await parseResume(file);
      setSkills(res.data.skills.join(", "));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleStart = async () => {
    const skillList = skills.split(",").map((s) => s.trim());
    await startFull({ skills: skillList });
    onStart();
  };

  return (
    <div className="bg-black text-white min-h-screen px-10 py-10">

      {/* HERO */}
      <div className="text-center mb-20">
        <h1 className="text-5xl font-bold mb-4">Skill Gauge</h1>
        <p className="text-gray-400">
          AI-Powered Skill Assessment & Personalized Learning Agent
        </p>

        <button className="mt-6 px-6 py-2 border border-purple-500 rounded-full hover:bg-purple-600">
          Read More
        </button>
      </div>

      {/* ABOUT */}
      <div className="grid md:grid-cols-2 gap-10 mb-20">
        <h2 className="text-4xl font-bold">About this app</h2>

        <p className="text-gray-300 leading-relaxed">
          AI Skill Assessment Agent is an intelligent system designed to evaluate
          real technical proficiency beyond resumes. It conducts conversational,
          AI-driven assessments tailored to your skills and generates personalized
          learning plans.
        </p>
      </div>

      {/* WHAT IT DOES */}
      <div className="grid md:grid-cols-2 gap-10 mb-20">
        <div>
          <h3 className="text-3xl mb-4">What it does</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Extracts skills from resume</li>
            <li>• Conducts chat-based assessment</li>
            <li>• Evaluates responses using AI</li>
            <li>• Identifies weak areas</li>
            <li>• Generates learning plan</li>
          </ul>
        </div>

        <div>
          <h3 className="text-3xl mb-4">Features</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Conversational AI</li>
            <li>• Resume parsing</li>
            <li>• Real-time scoring</li>
            <li>• Visual insights</li>
            <li>• Multi-skill coverage</li>
          </ul>
        </div>
      </div>

      {/* WHAT WE OFFER */}
      <div className="mb-20">
        <h2 className="text-4xl mb-10">
          What we <span className="text-purple-500">offer</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Intelligent Skill Assessment",
            "Resume Skill Extraction",
            "Real-Time Feedback",
            "Personalized Learning Plan",
            "Performance Insights",
            "Multi-Skill Coverage",
          ].map((item, i) => (
            <div
              key={i}
              className="border border-purple-600 p-6 rounded-xl hover:bg-purple-900/20"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* LETS BEGIN */}
      <div className="mb-20">
        <h2 className="text-4xl mb-10">Lets Begin</h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Resume Upload */}
          <div className="border border-purple-600 p-6 rounded-xl">
            <h3 className="mb-4">Upload Resume</h3>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="mb-4"
            />

            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-purple-600 rounded"
            >
              {loading ? "Extracting..." : "Extract Skills"}
            </button>
          </div>

          {/* Job Description */}
          <div className="border border-purple-600 p-6 rounded-xl">
            <h3 className="mb-4">Job Description</h3>

            <textarea
              placeholder="Enter job description..."
              className="w-full p-2 bg-black border border-gray-600"
            />
          </div>
        </div>
      </div>

      {/* START */}
      <div className="text-center">
        <h2 className="text-4xl text-purple-400 mb-6">
          Start Assessment
        </h2>

        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Skills (React, Python...)"
          className="w-full max-w-md p-3 text-black rounded mb-4"
        />

        <br />

        <button
          onClick={handleStart}
          className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          Start
        </button>
      </div>
    </div>
  );
}