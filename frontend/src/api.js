import axios from "axios";

const API = "http://127.0.0.1:8000";

export const parseResume = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${API}/parse-resume`, formData);
};

export const startFull = (data) =>
  axios.post(`${API}/start-full`, data);

export const nextQuestion = () =>
  axios.get(`${API}/next-question`);

export const submitAnswer = (answer) =>
  axios.post(`${API}/submit-answer`, { answer });

export const getReport = () =>
  axios.get(`${API}/report`);