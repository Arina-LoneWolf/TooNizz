import './QuizSetsList.scss';
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_HOME_QUESTION_SETS } from '../../../../apis/questionSetApi';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import 'swiper/swiper.scss';
import 'swiper/swiper-bundle.css';
import QuizCard from './QuizCard';

const quizzes = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']; // 18 elems

function QuizSetsList() {
  const { data, loading, error } = useQuery(GET_HOME_QUESTION_SETS, {
    onCompleted: () => console.log(data)
  });

  return (
    <div className="quiz-sets-list">
      <h1 className="list-title">Most Popular</h1>
      <div className="list-cards">
        {data?.getQuestionSetsHome?.questionSets.map((questionSet, index) => (
          <QuizCard key={index} questionSet={questionSet} />
        ))}
      </div>
      {/* <div className="load-more-btn">More</div> */}
    </div>
  );
}

export default QuizSetsList;