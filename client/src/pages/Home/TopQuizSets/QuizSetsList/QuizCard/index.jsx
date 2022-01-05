import './QuizCard.scss';
import React from 'react';

const cardImage = 'https://static.vecteezy.com/system/resources/previews/000/224/437/non_2x/vector-chemistry-illustration.jpg';

function QuizCard({ questionSet }) {
  return (
    <div className="quiz-card">
      <div className="card-image" style={{ backgroundImage: `url(${questionSet.cover || cardImage})` }} />
      <div className="card-desc">
        <h2 className="card-name">{questionSet.name}</h2>
        <div className="card-sub-info">
          <div className="questions">{questionSet.questionLength} Questions</div>
          <div className="card-plays">{questionSet.played} plays</div>
        </div>
      </div>
    </div>
  );
}

export default QuizCard;