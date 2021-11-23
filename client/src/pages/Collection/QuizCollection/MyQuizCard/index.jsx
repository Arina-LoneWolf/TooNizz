import './MyQuizCard.scss';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdMore } from 'react-icons/io';

const cover = 'https://cdn.dribbble.com/users/146798/screenshots/4140115/media/a8ef8104bfdb71ac644cacd5acffebc2.gif';
const avatar = 'https://i.pinimg.com/564x/0b/97/f5/0b97f53a14d3b0698c1388b013ecabfa.jpg';

function MyQuizCard() {
  const navigate = useNavigate();

  const handlePlayQuiz = () => {
    navigate('/lobby/admin');
  }

  return (
    <div className="my-quiz-card">
      <div className="quiz-cover" style={{ backgroundImage: `url(${cover})` }} />

      <div className="quiz-info">
        <h3 className="quiz-name">Chemistry Test</h3>
        <div className="quiz-plays">3K plays</div>
        <div className="quiz-updated-date">Updated 2 months ago</div>

        <div className="footer">
          <div className="quiz-creator">
            <div className="creator-avatar" style={{ backgroundImage: `url(${avatar})` }} />
            <div className="creator-name">Trinh Trinh</div>
          </div>

          <div className="btn-group">
            <div className="edit-btn">Edit</div>
            <div className="play-btn" onClick={handlePlayQuiz}>Play</div>
          </div>
        </div>
      </div>

      <IoMdMore className="manipulation-btn" />
    </div>
  );
}

export default MyQuizCard;