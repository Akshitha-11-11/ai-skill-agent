# AI Skill Assessment & Personalized Learning Agent

An AI-powered system that evaluates a candidate’s actual skill level by analyzing their resume, comparing it with a job description, conducting an adaptive interview, and generating a personalized learning roadmap.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [App Flow](#app-flow)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Screenshots](#screenshots)
- [Demo Video](#demo-video)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [AI Logic](#ai-logic)
- [Output Example](#output-example)
- [Future Improvements](#future-improvements)
- [Why This Project](#why-this-project)
- [License](#license)
- [Author](#author)

## Overview

Resumes show what candidates claim to know, but not how well they know it.

This project bridges that gap by combining rule-based parsing and LLM-powered reasoning to assess skills more accurately. It extracts skills from resumes, matches them against job requirements, conducts an adaptive interview, scores answers, and generates a personalized learning plan.

## Features

### Resume Skill Extraction
- Parses uploaded PDF resumes using PyMuPDF.
- Uses regex-based detection for fast keyword extraction.
- Uses LLM-based normalization to improve skill identification.
- Works even when extraction returns empty, so the assessment can still begin.

### Job Description Analysis
- Extracts required skills from job descriptions.
- Compares candidate skills against job requirements.

### Skill Gap Analysis
- Identifies matched skills.
- Identifies missing skills.
- Preserves proper skill names in output.

### Adaptive AI Interview
- Generates alternating MCQ and text questions.
- Adjusts question difficulty based on performance.
- Supports fallback question generation if the LLM is unavailable.

### AI-Based Evaluation
- Scores answers from 0 to 100.
- Includes MCQ backend scoring.
- Provides feedback and skill-level classification.

### Personalized Learning Plan
- Suggests targeted improvement areas.
- Recommends learning resources and roadmap steps.

### Visual Report Dashboard
- Shows readiness score.
- Visualizes weak skills.
- Highlights priority areas for improvement.
- Includes resource recommendations with YouTube/article links.
- Provides a “Start New Assessment” action from the report page.

## App Flow

### Frontend Routes
- `/` — Landing page with animated 3D-style effects.
- `/offer` — Features / offer page.
- `/upload` — Resume and JD upload page.
- `/chat` — Assessment chat interface.
- `/report` — Final report page.
- `/about` — About Us page.

### User Journey
1. Visit the landing page.
2. Explore the offer page.
3. Upload resume and job description.
4. Start the assessment.
5. Answer alternating MCQ and text questions.
6. View the final report.
7. Review resources or start a new assessment.

## Architecture
<img width="820" height="367" alt="WhatsApp Image 2026-04-26 at 11 55 23 PM" src="https://github.com/user-attachments/assets/f9da3b68-4254-4c04-89e1-e5fc9544acec" />


Frontend (React + Tailwind)  
→ FastAPI Backend  
→ Core AI Services  
→ OpenRouter LLM

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios

### Backend
- FastAPI
- Python
- Uvicorn

### AI / NLP
- OpenRouter API
- Regex-based parsing
- Adaptive questioning logic
- MCQ and text-based scoring

### PDF Processing
- PyMuPDF

## Project Structure

```bash
ai-skill-agent/
├── backend/
│   ├── main.py
│   ├── routes/
│   ├── services/
│   │   ├── llm.py
│   │   ├── skill_extractor.py
│   │   ├── question_engine.py
│   │   ├── scorer.py
│   │   ├── skill_gap.py
│   │   └── session_manager.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Header.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Offer.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Report.jsx
│   │   │   └── About.jsx
│   │   └── api.js
├── README.md
└── requirements.txt
```

## How It Works

1. Upload a resume and job description.
2. Extract and normalize candidate skills.
3. Analyze gaps between the resume and job requirements.
4. Start the adaptive assessment.
5. Answer MCQ and text questions.
6. Score each response and update difficulty dynamically.
7. Generate the final report with feedback and learning resources.

## Screenshots

### Landing Page
<img width="1917" height="980" alt="Screenshot 2026-04-27 002508" src="https://github.com/user-attachments/assets/383afc0c-3744-47c6-aeba-8cc7f0b41707" />


### Offer Page
<img width="1919" height="998" alt="Screenshot 2026-04-27 002540" src="https://github.com/user-attachments/assets/eeb01265-9225-4c13-9e2a-06ceb53638ea" />


### Upload Page
<img width="1251" height="659" alt="Screenshot 2026-04-27 002744" src="https://github.com/user-attachments/assets/fea02317-0af6-4d53-9911-99a3c2d323b0" />


### Chat Assessment
<img width="1243" height="664" alt="Screenshot 2026-04-27 002830" src="https://github.com/user-attachments/assets/871a890d-9741-4ebe-93e8-61b91896ff0b" />


### Final Report
<img width="1280" height="655" alt="Screenshot 2026-04-27 002929" src="https://github.com/user-attachments/assets/d7adb3de-3d82-4a2b-a01d-c1edb645a133" />
<img width="1235" height="653" alt="Screenshot 2026-04-27 003004" src="https://github.com/user-attachments/assets/e10f05cd-2e96-407e-9cd1-c45f7c10e8a9" />

## Demo Video

Watch the full project demo here:
https://drive.google.com/file/d/1xWuBJ5iEINuK2_tFgA9hy8qXYZvsPM0l/view?usp=sharing

## Installation

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at:
```bash
http://127.0.0.1:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:
```bash
http://127.0.0.1:5173
```

## Environment Variables

Create a `.env` file inside `backend/`:

```env
OPENROUTER_API_KEY=your_api_key_here
```

## AI Logic

### Skill Extraction
- Regex handles fast keyword matching.
- LLM helps normalize and expand skill names.

### Question Generation
- LLM generates practical, real-world questions.
- Questions alternate between MCQ and text formats.
- Fallback generation is used when OpenRouter is unavailable.

### Evaluation Strategy
- LLM-based scoring with structured output.
- MCQ answers are scored directly.
- Scores influence next-question difficulty and final assessment.

## Output Example

- Readiness Score: 75%
- Weak Skills: React, System Design
- Learning Plan:
  - Build projects
  - Practice interview questions
  - Follow a structured roadmap

## Future Improvements

- Docker and cloud deployment.
- Voice-based interview mode.
- Multi-language support.
- Real-time coding evaluation.
- Recruiter dashboard.

## Why This Project

This project turns static resumes into measurable skill assessments and helps candidates understand where they stand and how to improve.


## Author

Name: Akshitha mail:akshithrenikunta08@gmail.com Developed as part of an AI-based skill evaluation system project.
