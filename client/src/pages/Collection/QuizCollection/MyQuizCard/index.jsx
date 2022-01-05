import './MyQuizCard.scss';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdMore } from 'react-icons/io';

const cover = 'https://cdn.dribbble.com/users/146798/screenshots/4140115/media/a8ef8104bfdb71ac644cacd5acffebc2.gif';
const avatar = 'https://i.pinimg.com/564x/0b/97/f5/0b97f53a14d3b0698c1388b013ecabfa.jpg';

function MyQuizCard({ questionSet }) {
  const navigate = useNavigate();

  const date = new Date(questionSet.createdAt);

  const handlePlayQuiz = () => {
    navigate('/lobby/admin/1');
  }

  const handleViewQuiz = (e) => {
    if (!e.target.classList.contains('btn'))
      navigate('/viewer/1', { state: questionSet });
  }

  return (
    <div className="my-quiz-card" onClick={handleViewQuiz}>
      <div className="quiz-cover" style={{ backgroundImage: `url(${questionSet.cover ? questionSet.cover : cover})` }} />

      <div className="quiz-info">
        <h3 className="quiz-name">{questionSet.name}</h3>
        <div className="quiz-plays">{questionSet.played} plays</div>
        <div className="quiz-updated-date">Updated 2 months ago</div>

        <div className="footer">
          <div className="quiz-creator">
            <div className="creator-avatar" style={{ backgroundImage: `url(${avatar})` }} />
            <div className="creator-name">{questionSet.nameUser}</div>
          </div>

          <div className="btn-group">
            <div className="edit-btn btn">Edit</div>
            <div className="play-btn btn" onClick={handlePlayQuiz}>Play</div>
          </div>
        </div>
      </div>

      <IoMdMore className="manipulation-btn" />
    </div>
  );
}

export default MyQuizCard;

function timeSince(date) {
  // console.log('date comment: ', date);
  // console.log('date now: ', new Date());
  // console.log('tinh date: ', new Date() - date);
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " năm trước";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " tháng trước";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " ngày trước";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " giờ trước";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " phút trước";
  }
  // return Math.floor(seconds) + " giây trước";
  return "Vừa xong";
}