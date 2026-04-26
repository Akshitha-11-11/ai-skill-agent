from fastapi import APIRouter, UploadFile, File
import pdfplumber
import docx

router = APIRouter()

def clean_text(text):
    return " ".join(text.split())

def parse_pdf(file):
    text = ""
    with pdfplumber.open(file.file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return clean_text(text)

def parse_docx(file):
    doc = docx.Document(file.file)
    return clean_text("\n".join([p.text for p in doc.paragraphs]))

@router.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    if file.filename.endswith(".pdf"):
        text = parse_pdf(file)
    elif file.filename.endswith(".docx"):
        text = parse_docx(file)
    else:
        return {"error": "Unsupported file"}

    return {"text": text}