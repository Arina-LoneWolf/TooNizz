import './QuizCard.scss';
import React from 'react';

const cardImage = 'https://static.vecteezy.com/system/resources/previews/000/224/437/non_2x/vector-chemistry-illustration.jpg';

function QuizCard() {
  return (
    <div className="quiz-card">
      <div className="card-image" style={{ backgroundImage: `url(${cardImage})` }} />
      <div className="card-desc">
        <h2 className="card-name">Similar Figures</h2>
        <div className="card-sub-info">
          <div className="questions">20 Questions</div>
          <div className="card-plays">7 plays</div>
        </div>
      </div>
    </div>
  );
}

export default QuizCard;