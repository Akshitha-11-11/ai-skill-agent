class SessionManager:
    def __init__(self, skills):
        self.skills = skills
        self.current_index = 0
        self.states = {}

    def set_state(self, skill, state):
        self.states[skill] = state

    def get_current_skill(self):
        return self.skills[self.current_index]

    def next_skill(self):
        self.current_index += 1
        return self.current_index < len(self.skills)

    def get_all_scores(self):
        result = {}
        for skill, state in self.states.items():
            result[skill] = state.final_score()
        return result