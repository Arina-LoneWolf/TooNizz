import './QuizSetsList.scss';
import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import 'swiper/swiper.scss';
import 'swiper/swiper-bundle.css';
import QuizCard from './QuizCard';

const quizzes = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']; // 18 elems

function QuizSetsList() {
  return (
    <div className="quiz-sets-list">
      <h1 className="list-title">Most Popular</h1>
      <div className="list-cards">
        {quizzes.map((quiz, index) => (
          <QuizCard key={index} />
        ))}
      </div>
      <div className="load-more-btn">More</div>
    </div>
  );
}

export default QuizSetsList;