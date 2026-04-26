import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const [pos, setPos] = useState({ x: 0, y: 0 });

useEffect(() => {
  const handleMouseMove = (e) => {
    setPos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}, []);

 return (
  <div className="h-screen bg-black flex items-center justify-center relative overflow-hidden">

    {/* CURSOR GLOW */}
    <div
      className="pointer-events-none fixed w-[300px] h-[300px] 
                 bg-purple-500/30 blur-[120px] rounded-full z-0"
      style={{
        left: pos.x - 150,
        top: pos.y - 150,
      }}
    />

    {/* NOISE TEXTURE */}
    <div
      className="absolute inset-0 opacity-[0.04] pointer-events-none"
      style={{
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/noise.png')",
      }}
    />

    {/* ANIMATED GRADIENT BG */}
    <div
      className="absolute w-[900px] h-[900px] rounded-full opacity-40 blur-[250px]"
      style={{
        background:
          "linear-gradient(270deg, #7c3aed, #6366f1, #a855f7)",
        backgroundSize: "600% 600%",
        animation: "gradientMove 15s ease infinite",
      }}
    />

    {/* GLASS CARD */}
    <div
      className="relative backdrop-blur-2xl bg-white/5 border border-white/10 
                 rounded-3xl px-20 py-16 flex items-center gap-20 
                 shadow-[0_0_120px_rgba(168,85,247,0.25)] transition-transform duration-200"
      style={{
        transform: `
          rotateX(${(pos.y - window.innerHeight / 2) / 40}deg)
          rotateY(${-(pos.x - window.innerWidth / 2) / 40}deg)
        `,
      }}
    >

      {/* LEFT */}
      <div className="max-w-md text-white">
        <p className="text-xs tracking-widest text-gray-400 mb-6">
          AI-POWERED SKILL ASSESSMENT & PERSONALIZED LEARNING PLAN AGENT
        </p>

        <h1 className="text-[80px] leading-[85px] font-light 
                       bg-gradient-to-r from-purple-400 via-purple-200 to-white 
                       bg-clip-text text-transparent">
          Skill <br /> Gauge
        </h1>

        <button
          onClick={() => navigate("/offer")}
          className="mt-10 px-6 py-2 border border-purple-500 rounded-full 
                     text-sm tracking-wide
                     hover:bg-purple-600 
                     hover:shadow-[0_0_40px_rgba(168,85,247,0.9)] 
                     transition-all duration-300"
        >
          LET’S BEGIN →
        </button>
      </div>

      {/* RIGHT VISUAL */}
      <div
        className="relative flex items-center justify-center"
        style={{
          transform: `
            translateX(${(pos.x - window.innerWidth / 2) / 40}px)
            translateY(${(pos.y - window.innerHeight / 2) / 40}px)
          `,
        }}
      >

        <div className="w-[280px] h-[280px] rounded-full 
                        bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-700 
                        opacity-80 blur-[30px] animate-float"></div>

        <div className="absolute w-[160px] h-[160px] rounded-full 
                        bg-purple-400/40 blur-xl animate-float"></div>

        <svg
          className="absolute w-[120px] animate-float opacity-70"
          viewBox="0 0 200 200"
        >
          <path d="M50 0 L150 50 L120 180 L30 150 Z" fill="url(#grad)" />
          <defs>
            <linearGradient id="grad">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>

      </div>
    </div>

    {/* BOTTOM LINE */}
    <div className="absolute bottom-10 w-[70%] h-[1px] 
                    bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

  </div>
);
}