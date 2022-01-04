import './QuizViewer.scss';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { GrEdit } from 'react-icons/gr';
import { MdPublic } from 'react-icons/md';
import { RiGitRepositoryPrivateFill } from 'react-icons/ri';
import { MdOutlineClose, MdOutlineCheck } from 'react-icons/md';

const testImg = 'https://images.unsplash.com/photo-1593642531955-b62e17bdaa9c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80';
const avatar = 'https://i.pinimg.com/564x/0b/97/f5/0b97f53a14d3b0698c1388b013ecabfa.jpg';

function QuizViewer() {
  const navigate = useNavigate();
  const { id } = useLocation();

  const [showAnswers, setShowAnswers] = useState(false);

  const handleShowAnswers = (e) => {
    const answers = e.currentTarget.querySelector('.question-answers');
    console.log(answers);
    if (answers.classList.contains('active')) {
      answers.classList.remove('active');
    } else {
      answers.classList.add('active');
    }
  }

  const handleShowAllAnswers = () => {
    const allAnswers = document.querySelectorAll('.viewer-card .question-answers');
    if (showAnswers) {
      setShowAnswers(false);
      allAnswers.forEach((answers) => {
        answers.classList.remove('active');
      });
    } else {
      setShowAnswers(true);
      allAnswers.forEach((answers) => {
        answers.classList.add('active');
      });
    }
  }

  const handleEditQuiz = () => {
    navigate(`/editor/${id}`);
  }

  const handlePlayQuiz = () => {
    navigate(`/lobby/admin/${id}`);
  }

  const handleAddToFavorite = () => {
    // call API
    // refetch, cái nào tim rồi thì hiện trái tim fill đỏ
  }

  return (
    <div className="quiz-viewer">
      <div className="quiz-info">
        <img src={testImg} alt="" className="quiz-cover" />

        <div className="quiz-detail-info-wrapper">
          <div className="quiz-title">
            <span className="quiz-name">Birthday party quiz</span>
            <span className="mani-group">
              <GrEdit className="edit-icon icon" onClick={handleEditQuiz} />
              <FaRegHeart className="heart-icon icon" onClick={handleAddToFavorite} />
            </span>
          </div>

          <div className="quiz-sub-info">
            <span className="quiz-plays">7 plays</span>
            <span className="quiz-players">27 players</span>
            <MdPublic className="accession-icon public" />
          </div>

          <div className="author-group">
            <div className="author-avatar" style={{ backgroundImage: `url(${avatar})` }}></div>
            <div className="creation-info">
              <div className="author-name">Arina</div>
              <div className="updated-date">Update 2 months ago</div>
            </div>
          </div>

          <div className="play-btn" onClick={handlePlayQuiz}>Play</div>
        </div>
      </div>

      <div className="quiz-content">
        <div className="viewer-header">
          <div className="num-questions">Question (10)</div>
          <div className="show-answers-btn" onClick={handleShowAllAnswers}>{showAnswers ? 'Hide answers' : 'Show answers'}</div>
        </div>

        <div className="viewer-body">
          <div className="viewer-card" onClick={handleShowAnswers}>
            <div className="main-info">
              <div className="question">
                <div className="question-num-type">1-Multiple-choice</div>
                <div className="content">When was I born?</div>
              </div>

              <div className="question-media-wrapper">
                <img src={testImg} alt="" className="media" />
              </div>

              <div className="question-time"></div>
            </div>

            <div className="question-answers">
              <div className="answer-opt">
                <span className="answer">October 22nd, 1967</span>
                <MdOutlineClose className="result-icon incorrect" />
              </div>
              <div className="answer-opt">
                <span className="answer">October 22nd, 1967</span>
                <MdOutlineCheck className="result-icon correct" />
              </div>
              <div className="answer-opt">
                <span className="answer">October 22nd, 1967</span>
                <MdOutlineClose className="result-icon incorrect" />
              </div>
              <div className="answer-opt">
                <span className="answer">October 22nd, 1967</span>
                <MdOutlineClose className="result-icon incorrect" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizViewer;