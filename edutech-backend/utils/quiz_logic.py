from typing import List
from models.quiz import Question

def get_adaptive_questions(quiz_questions: List[Question], user_performance: str = 'medium') -> List[Question]:
    """
    Adaptive quiz logic: Select questions based on user's performance level.
    """
    if user_performance == 'easy':
        # Focus on easy and medium questions
        filtered = [q for q in quiz_questions if q.difficulty in ['easy', 'medium']]
    elif user_performance == 'hard':
        # Include harder questions
        filtered = [q for q in quiz_questions if q.difficulty in ['medium', 'hard']]
    else:
        # Default: all questions
        filtered = quiz_questions

    # Return up to 10 questions, prioritizing based on difficulty
    if len(filtered) > 10:
        easy = [q for q in filtered if q.difficulty == 'easy'][:4]
        medium = [q for q in filtered if q.difficulty == 'medium'][:4]
        hard = [q for q in filtered if q.difficulty == 'hard'][:2]
        filtered = easy + medium + hard

    return filtered[:10]

def calculate_score(questions: List[Question], answers: List[int]) -> int:
    """
    Calculate the score based on correct answers.
    """
    score = 0
    for i, question in enumerate(questions):
        if i < len(answers) and answers[i] == question.correct_answer:
            score += 1
    return score

def generate_feedback(score: int, total_questions: int) -> str:
    """
    Generate feedback based on score.
    """
    percentage = (score / total_questions) * 100
    if percentage >= 90:
        return "Excellent! You have a strong understanding of the material."
    elif percentage >= 75:
        return "Good job! You have a solid grasp, but there's room for improvement."
    elif percentage >= 60:
        return "Fair performance. Consider reviewing the material and trying again."
    else:
        return "You may need to review the material more thoroughly. Don't give up!"
