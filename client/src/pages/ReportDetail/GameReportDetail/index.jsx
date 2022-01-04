import './GameReportDetail.scss';
import React, { useRef } from 'react';
import { playerDetailShowVar, questionDetailShowVar } from '../../../shared/apolloLocalState/popupFormState';
import { useReactiveVar, useQuery, useApolloClient } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import PlayerDetail from './PlayerDetail';
import QuestionDetail from './QuestionDetail';

const PLAYERS = 'PLAYERS';
const QUESTIONS = 'QUESTIONS';

function GameReportDetail() {
  const playerDetailShow = useReactiveVar(playerDetailShowVar);
  const questionDetailShow = useReactiveVar(questionDetailShowVar);

  const showPlayerDetail = () => {
    playerDetailShowVar(true);
  }

  const showQuestionDetail = () => {
    questionDetailShowVar(true);
  }

  const playersReportRef = useRef(null);
  const questionsReportRef = useRef(null);
  const playersTabRef = useRef(null);
  const questionsTabRef = useRef(null);

  const handleChangeReportTab = (selectedTab) => {
    if (selectedTab === PLAYERS) {
      questionsReportRef.current.classList.remove('active');
      questionsTabRef.current.classList.remove('active');
      playersReportRef.current.classList.add('active');
      playersTabRef.current.classList.add('active');
    } else {
      playersReportRef.current.classList.remove('active');
      playersTabRef.current.classList.remove('active');
      questionsReportRef.current.classList.add('active');
      questionsTabRef.current.classList.add('active');
    }
  }

  return (
    <div className="game-report-detail">
      <div className="report-heading">
        <div className="report-lb">Report</div>
        <div className="quiz-name">Birthday party quiz</div>
        <div className="nav-heading">
          <div className="nav-item nav-players active" onClick={() => handleChangeReportTab(PLAYERS)} ref={playersTabRef}>Players (11)</div>
          <div className="nav-item nav-questions" onClick={() => handleChangeReportTab(QUESTIONS)} ref={questionsTabRef}>Questions (10)</div>
        </div>
      </div>

      <div className="report-body players-body active" ref={playersReportRef}>
        <div className="table-heading">
          <div className="nickname-heading fl-25">Nickname</div>
          <div className="rank-heading fl-20">Rank</div>
          <div className="correct-answers-heading fl-20">Correct answers</div>
          <div className="unanswered-heading fl-20">Unanswered</div>
          <div className="final-score-heading fl-15">Final score</div>
        </div>

        <div className="table-body">
          <div className="table-item" onClick={showPlayerDetail}>
            <div className="nickname fl-25">Arina</div>
            <div className="rank fl-20">1</div>
            <div className="correct-answers fl-20">90%</div>
            <div className="unanswered fl-20">—</div>
            <div className="final-score fl-15">5500</div>
          </div>
        </div>
      </div>

      <div className="report-body questions-body" ref={questionsReportRef}>
        <div className="table-heading">
          <div className="question-heading fl-60">Question</div>
          <div className="question-type-heading fl-20">Type</div>
          <div className="correct-incorrect-heading fl-20">Correct</div>
        </div>

        <div className="table-body">
          <div className="table-item" onClick={showQuestionDetail}>
            <div className="question fl-60">What was my first word ever?</div>
            <div className="question-type fl-20">Multiple-choice</div>
            <div className="correct-incorrect fl-20">80%</div>
          </div>
        </div>
      </div>

      {playerDetailShow && <PlayerDetail />}
      {questionDetailShow && <QuestionDetail />}
    </div>
  );
}

export default GameReportDetail;