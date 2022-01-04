import './QuizSearch.scss';
import React from 'react';
import subjects from '../../../shared/data/subjects';

function QuizSearch() {
  return (
    <div className="quiz-search">
      <div className="sort-filter-group">
        <div className="sort">
          <span className="text">Sort by:</span>
          <select name="sort" id="sort">
            <option value="">All</option>
            <option value="">Most Played</option>
            <option value="">Most Recent</option>
          </select>
        </div>

        <div className="filter">
          <span className="text">Filter by:</span>
          <select name="filter" id="filter">
            <option value="">All Subjects</option>
            <React.Fragment>
              {subjects.map(subject => (
                <option value={subject}>{subject}</option>
              ))}
            </React.Fragment>
          </select>
        </div>
      </div>

      <div className="search-result">

      </div>
    </div>
  );
}

export default QuizSearch;