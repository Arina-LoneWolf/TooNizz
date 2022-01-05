import './QuizCollection.scss';
import React, { useRef } from 'react';
import MyQuizCard from './MyQuizCard';
import { useQuery, useLazyQuery, useReactiveVar, useMutation } from "@apollo/client";
import { GET_QUESTION_SETS_USER_CREATED, GET_QUESTION_SETS_USER_LIKED } from '../../../apis/questionSetApi';

const MY_QUIZ = 'MY_QUIZ';
const LIKED_QUIZ = 'LIKED_QUIZ';

const quizzes = ['', '', '', '', '', '', '', '', '', ''];

function QuizCollection() {
  const myQuizRef = useRef(null);
  const likedQuizRef = useRef(null);

  const { data, loading, error } = useQuery(GET_QUESTION_SETS_USER_CREATED, {
    onCompleted: () => console.log(data),
    variables: {
      limit: 100,
      page: 1
    }
  });

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
        {data?.getQuestionSetsByUserId?.questionSets?.map((questionSet) => (
          <MyQuizCard key={questionSet.id} questionSet={questionSet} />
        ))}
      </div>
    </div>
  );
}

export default QuizCollection;