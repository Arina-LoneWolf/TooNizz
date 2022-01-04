import './QuizCollection.scss';
import React, { useRef } from 'react';
import MyQuizCard from './MyQuizCard';

const MY_QUIZ = 'MY_QUIZ';
const LIKED_QUIZ = 'LIKED_QUIZ';

const quizzes = ['', '', '', '', '', '', '', '', '', ''];

function QuizCollection() {
  const myQuizRef = useRef(null);
  const likedQuizRef = useRef(null);

  const handleChangeCollectionTab = (e, selectedTab) => {
    if (selectedTab === MY_QUIZ) {
      likedQuizRef.current.classList.remove('active');
      myQuizRef.current.classList.add('active');
    } else {
      myQuizRef.current.classList.remove('active');
      likedQuizRef.current.classList.add('active');
    }
  }

  return (
    <div className="quiz-collection">
      {/* <h1>My collection</h1> */}
      <div className="nav-heading">
        <div className="nav-item nav-my-quiz active" onClick={(e) => handleChangeCollectionTab(e, MY_QUIZ)} ref={myQuizRef}>My Quiz</div>
        <div className="nav-item nav-liked-quiz" onClick={(e) => handleChangeCollectionTab(e, LIKED_QUIZ)} ref={likedQuizRef}>Liked Quiz</div>
      </div>
      <div className="quiz-list">
        {quizzes.map((quiz, index) => (
          <MyQuizCard key={index} />
        ))}
      </div>
    </div>
  );
}

export default QuizCollection;