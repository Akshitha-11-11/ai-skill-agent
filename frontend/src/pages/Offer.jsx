import { useNavigate } from "react-router-dom";

export default function Offer() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white px-20 pt-20 relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[600px] h-[600px] bg-purple-600/20 blur-[180px] rounded-full top-10 left-20"></div>

      {/* TITLE */}
      <h1 className="text-[60px] font-light mb-24">
        What we offer
      </h1>

      {/* FEATURES GRID */}
      <div className="grid grid-cols-2 gap-x-40 gap-y-20 max-w-5xl">

        <Feature title="AI Skill Assessment" desc="Evaluate real skills through adaptive questioning." />
        <Feature title="Resume Parsing" desc="Extract skills automatically from your resume." />
        <Feature title="Conversational Testing" desc="Chat-based evaluation instead of static quizzes." />
        <Feature title="Real-Time Feedback" desc="Instant scoring and insights after every answer." />
        <Feature title="Performance Insights" desc="Understand strengths and weak areas clearly." />
        <Feature title="Personalized Learning Plan" desc="Get a roadmap tailored to your gaps." />

      </div>

      {/* CTA */}
      <button
        onClick={() => navigate("/upload")}
        className="mt-32 px-10 py-3 border border-purple-500 rounded-full 
                   hover:bg-purple-600 
                   hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] 
                   transition-all duration-300"
      >
        Upload Resume →
      </button>

    </div>
  );
}

/* 🔥 Feature Card */
function Feature({ title, desc }) {
  return (
    <div className="group">

      <h3 className="text-xl mb-2 group-hover:text-purple-400 transition">
        {title}
      </h3>

      <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
        {desc}
      </p>

      {/* subtle underline animation */}
      <div className="w-0 h-[1px] bg-purple-500 mt-2 group-hover:w-full transition-all duration-300"></div>

    </div>
  );
}