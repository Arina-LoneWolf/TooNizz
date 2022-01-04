import './GameReportDetail.scss';
import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GET_REPORT_DETAIL } from '../../../apis/reportApi';
import { playerDetailShowVar, questionDetailShowVar } from '../../../shared/apolloLocalState/popupFormState';
import { useReactiveVar, useQuery, useApolloClient } from '@apollo/client';
import PlayerDetail from './PlayerDetail';
import QuestionDetail from './QuestionDetail';

const PLAYERS = 'PLAYERS';
const QUESTIONS = 'QUESTIONS';

function GameReportDetail() {
  const { id } = useParams();

  const playerDetailShow = useReactiveVar(playerDetailShowVar);
  const questionDetailShow = useReactiveVar(questionDetailShowVar);

  const [selectedPlayer, setSelectedPlayer] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState({});

  console.log('aaaa', typeof id);

  const { data, loading, error } = useQuery(GET_REPORT_DETAIL, {
    variables: {
      reportId: id
    }
  });

  const showPlayerDetail = (player) => {
    setSelectedPlayer(player);
    playerDetailShowVar(true);
  }

  const showQuestionDetail = (question) => {
    setSelectedQuestion(question);
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
        {data && <div className="nav-heading">
          <div className="nav-item nav-players active" onClick={() => handleChangeReportTab(PLAYERS)} ref={playersTabRef}>Players ({data.GetDetailReport.players.length})</div>
          <div className="nav-item nav-questions" onClick={() => handleChangeReportTab(QUESTIONS)} ref={questionsTabRef}>Questions ({data.GetDetailReport.questions.length})</div>
        </div>}
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
          {data?.GetDetailReport?.players.map(player => (
            <div className="table-item" key={player._id} onClick={() => showPlayerDetail(player)}>
              <div className="nickname fl-25">{player.name}</div>
              <div className="rank fl-20">{player.rank}</div>
              <div className="correct-answers fl-20">{player.correctPercentAnswers}%</div>
              <div className="unanswered fl-20">{player.unAnswered > 0 ? player.unAnswered : '—'}</div>
              <div className="final-score fl-15">{player.finalScore}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="report-body questions-body" ref={questionsReportRef}>
        <div className="table-heading">
          <div className="question-heading fl-60">Question</div>
          <div className="question-type-heading fl-20">Type</div>
          <div className="correct-incorrect-heading fl-20">Correct</div>
        </div>

        <div className="table-body">
          {data?.GetDetailReport?.questions.map(question => (
            <div className="table-item" key={question._id} onClick={() => showQuestionDetail(question)}>
              <div className="question fl-60">{question.dataQuestion.content}</div>
              <div className="question-type fl-20">Single-choice</div>
              <div className="correct-incorrect fl-20">{question.percentRight}%</div>
            </div>
          ))}
        </div>
      </div>

      {playerDetailShow && <PlayerDetail player={selectedPlayer} playerNumbers={data?.GetDetailReport?.players.length} />}
      {questionDetailShow && <QuestionDetail question={selectedQuestion} playerNumbers={data?.GetDetailReport?.players.length} />}
    </div>
  );
}

export default GameReportDetail;