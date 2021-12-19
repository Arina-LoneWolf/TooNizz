import './QuizCollection.scss';
import React from 'react';
import MyQuizCard from './MyQuizCard';

const quizzes = ['', '', '', '', '', '', '', '', '', ''];

function QuizCollection() {
  return (
    <div className="quiz-collection">
      <h1>My collection</h1>
      <div className="quiz-list">
        {quizzes.map((quiz, index) => (
          <MyQuizCard key={index} />
        ))}
      </div>
    </div>
  );
}

export default QuizCollection;