import { useState, useEffect, useRef } from "react";
import { nextQuestion, submitAnswer } from "../api";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // first question
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await nextQuestion();

      if (res.data.done) {
        navigate("/report");
        return;
      }

      setCurrentQuestion(res.data);
      setMessages([{ type: "bot", text: res.data.question }]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (selectedAnswer = input) => {
    if (!String(selectedAnswer).trim()) return;

    setLoading(true);

    try {
      const res = await submitAnswer(selectedAnswer);

      const next = await nextQuestion();
      setCurrentQuestion(next.data.done ? null : next.data);

      setMessages((prev) => [
        ...prev,
        { type: "user", text: selectedAnswer },
        { type: "bot", text: `Score: ${res.data.score}` },
        { type: "bot", text: res.data.feedback },
        ...(next.data.done
          ? []
          : [{ type: "bot", text: next.data.question }]),
      ]);

      if (next.data.done) {
        setTimeout(() => navigate("/report"), 1000);
      }

      setInput("");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-20">

      {/* CHAT */}
      <div className="w-full max-w-3xl h-[400px] overflow-y-auto 
                      bg-white/5 border border-white/10 
                      rounded-2xl p-6 space-y-4">

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-[70%] text-sm ${
                msg.type === "user"
                  ? "bg-purple-600"
                  : "bg-white/10"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {currentQuestion?.type === "mcq" && (
          <div className="grid gap-2">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSend(option)}
                disabled={loading}
                className="text-left px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:border-purple-500 hover:bg-purple-600/30 transition"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {loading && <div>Thinking...</div>}

        <div ref={chatEndRef}></div>
      </div>

      {/* INPUT */}
      <div className="w-full max-w-3xl mt-6 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={currentQuestion?.type === "mcq"}
          placeholder={currentQuestion?.type === "mcq" ? "Choose an option above" : "Type your answer..."}
          className="flex-1 bg-white/5 border border-white/10 
                     rounded-full px-4 py-2"
        />

        <button
          onClick={() => handleSend()}
          disabled={currentQuestion?.type === "mcq"}
          className="px-6 py-2 border border-purple-500 rounded-full"
        >
          Send
        </button>
      </div>

    </div>
  );
}
