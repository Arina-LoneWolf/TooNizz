import './QuizViewer.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_QUESTIONS_BY_QUESTION_SET_ID } from '../../../apis/questionSetApi';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { GrEdit } from 'react-icons/gr';
import { MdPublic } from 'react-icons/md';
import { RiGitRepositoryPrivateFill } from 'react-icons/ri';
import { MdOutlineClose, MdOutlineCheck } from 'react-icons/md';

const testImg = 'https://images.unsplash.com/photo-1593642531955-b62e17bdaa9c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80';
const avatar = 'https://i.pinimg.com/564x/0b/97/f5/0b97f53a14d3b0698c1388b013ecabfa.jpg';

function QuizViewer() {
  const navigate = useNavigate();
  const { state: questionSet } = useLocation();

  const { data, loading, error } = useQuery(GET_QUESTIONS_BY_QUESTION_SET_ID, {
    variables: {
      questionSetId: questionSet.id
    }
  });

  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    console.log('id ', questionSet.id)
    if (data) console.log(data)
  }, [data])

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
    // navigate(`/editor/${id}`);
  }

  const handlePlayQuiz = () => {
    // navigate(`/lobby/admin/${id}`);
    navigate(`/lobby/admin/1`);
  }

  const handleAddToFavorite = () => {
    // call API
    // refetch, c??i n??o tim r???i th?? hi???n tr??i tim fill ?????
  }

  return (
    <div className="quiz-viewer">
      <div className="quiz-info">
        <img src={questionSet.cover || testImg} alt="" className="quiz-cover" />

        <div className="quiz-detail-info-wrapper">
          <div className="quiz-title">
            <span className="quiz-name">{questionSet.name}</span>
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
              <div className="author-name">{questionSet.nameUser}</div>
              <div className="updated-date">Update 2 months ago</div>
            </div>
          </div>

          <div className="play-btn" onClick={handlePlayQuiz}>Play</div>
        </div>
      </div>

      <div className="quiz-content">
        <div className="viewer-header">
          <div className="num-questions">Question ({data?.getQuestionByQuestionSetId.questions.length})</div>
          <div className="show-answers-btn" onClick={handleShowAllAnswers}>{showAnswers ? 'Hide answers' : 'Show answers'}</div>
        </div>

        <div className="viewer-body">
          {data?.getQuestionByQuestionSetId.questions.map((question, index) => (
            <div className="viewer-card" onClick={handleShowAnswers}>
              <div className="main-info">
                <div className="question">
                  <div className="question-num-type">{index + 1}-Single-choice</div>
                  <div className="content">{question.content}</div>
                </div>

                <div className="question-media-wrapper">
                  <img src={testImg} alt="" className="media" />
                </div>

                <div className="question-time"></div>
              </div>

              <div className="question-answers">
                {question.answers.map(answer => (
                  <div className="answer-opt">
                    <span className="answer">{answer.content}</span>
                    {answer.isCorrect ? <MdOutlineCheck className="result-icon correct" /> : <MdOutlineClose className="result-icon incorrect" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizViewer;