class SkillState:
    def __init__(self, skill):
        self.skill = skill
        self.mcq_score = 0
        self.subjective_scores = []
        self.current_level = "easy"   # easy → medium → hard
        self.asked_questions = 0

    def update_mcq(self, score):
        self.mcq_score = score

    def update_subjective(self, score):
        self.subjective_scores.append(score)
        self.asked_questions += 1
        self.adjust_level()

    def adjust_level(self):
        avg = sum(self.subjective_scores) / len(self.subjective_scores)

        if avg > 7:
            self.current_level = "hard"
        elif avg > 4:
            self.current_level = "medium"
        else:
            self.current_level = "easy"

    def final_score(self):
        subj_avg = (
            sum(self.subjective_scores) / len(self.subjective_scores)
            if self.subjective_scores else 0
        )

        return round(
            (self.mcq_score * 0.3) + (subj_avg * 0.7),
            2
        )