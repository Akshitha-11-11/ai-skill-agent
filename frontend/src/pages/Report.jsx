import { useEffect, useState } from "react";
import { getReport } from "../api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";

export default function Report() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
  try {
    const res = await getReport();
    console.log("REPORT DATA:", res.data);
    setReport(res.data);
  } catch (err) {
    console.error("REPORT ERROR:", err);
  }
};

  if (!report) return <div className="text-white p-10">Loading...</div>;

  const percentage =
    report.readiness_score <= 10
      ? report.readiness_score * 10
      : report.readiness_score;

  const pieData = report.weak_skills.map((skill) => ({
    name: skill,
    value: 1
  }));

  const barData = report.priority.map((p) => ({
    name: p.skill,
    value: p.priority_score
  }));

  const resourceEntries = Object.entries(report.resources || {});

  const downloadReport = () => {
    const text = `
AI Skill Report

Readiness Score: ${percentage}%

Weak Skills:
${report.weak_skills.join(", ")}

Learning Plan:
${[
  ...(report.learning_plan?.["7_days"] || []),
  ...(report.learning_plan?.["14_days"] || []),
  ...(report.learning_plan?.["30_days"] || [])
].join("\n")}
    `;

    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "report.txt";
    link.click();
  };

  return (
    <div className="min-h-screen bg-black text-white px-20 pt-20">
      <h1 className="text-5xl font-light mb-16">Your Results</h1>

      <div className="mb-6 p-4 border border-purple-500 rounded-xl bg-white/5">
        <p className="text-purple-400 text-sm">
          {report.plan_type}
        </p>
        <p className="text-gray-400 text-xs">
          Based on {report.deadline_days} days available
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 mb-20">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <p className="text-gray-400 text-sm">Readiness Score</p>
          <h2 className="text-4xl mt-2 text-purple-400">
            {percentage}%
          </h2>

          <div className="mt-4 w-full h-2 bg-gray-800 rounded-full">
            <div
              className="h-full rounded-full"
              style={{
                width: `${percentage}%`,
                background:
                  "linear-gradient(90deg, #7c3aed, #c084fc)",
              }}
            />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <p className="text-gray-400 text-sm">Weak Areas</p>
          <h2 className="text-4xl mt-2">
            {report.weak_skills.length}
          </h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <p className="text-gray-400 text-sm">Learning Steps</p>
          <h2 className="text-4xl mt-2">
            {
              (report.learning_plan?.["7_days"]?.length || 0) +
              (report.learning_plan?.["14_days"]?.length || 0) +
              (report.learning_plan?.["30_days"]?.length || 0)
            }
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-20 mb-20">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h3 className="mb-6">Weak Skills</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill="#a855f7" />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h3 className="mb-6">Learning Plan</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-20">
        <div>
          <h3 className="mb-4">Weak Skills</h3>
          <ul className="text-gray-300 space-y-2">
            {report.weak_skills.map((s, i) => (
              <li key={i}>- {s}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4">Learning Plan</h3>
          <ul className="text-gray-300 space-y-2">
            <h4 className="text-purple-400">7 Day Plan</h4>
            {report.learning_plan?.["7_days"]?.map((p, i) => (
              <li key={i}>- {p}</li>
            ))}

            <h4 className="text-purple-400 mt-4">14 Day Plan</h4>
            {report.learning_plan?.["14_days"]?.map((p, i) => (
              <li key={i}>- {p}</li>
            ))}

            <h4 className="text-purple-400 mt-4">30 Day Plan</h4>
            {report.learning_plan?.["30_days"]?.map((p, i) => (
              <li key={i}>- {p}</li>
            ))}
          </ul>
        </div>
      </div>

      {resourceEntries.length > 0 && (
        <div className="mt-20">
          <h3 className="mb-6">Recommended Resources</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {resourceEntries.map(([skill, links]) => (
              <div
                key={skill}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <h4 className="text-purple-400 mb-4">{skill}</h4>
                <a
                  href={links.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm text-gray-200 hover:text-purple-300 mb-3"
                >
                  YouTube tutorials
                </a>
                {(links.articles || []).map((article) => (
                  <a
                    key={article.url}
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-sm text-gray-300 hover:text-purple-300 mb-2"
                  >
                    {article.title}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-20">
        <button
          onClick={downloadReport}
          className="px-10 py-3 border border-purple-500 rounded-full
                    hover:bg-purple-600
                    hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]
                    transition"
        >
          Download Report &gt;
        </button>
      </div>
    </div>
  );
}
