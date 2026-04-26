def compute_skill_gap(resume_skills, jd_skills):
    resume_by_key = {skill.lower().strip(): skill.strip() for skill in resume_skills if skill}
    jd_by_key = {skill.lower().strip(): skill.strip() for skill in jd_skills if skill}

    matched_keys = resume_by_key.keys() & jd_by_key.keys()
    missing_keys = jd_by_key.keys() - resume_by_key.keys()

    return {
        "matched": [jd_by_key[key] for key in matched_keys],
        "missing": [jd_by_key[key] for key in missing_keys],
    }
