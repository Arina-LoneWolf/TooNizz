import './QuizCreationForm.scss';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import subjects from '../../data/subjects';

function QuizCreationForm() {
  const navigate = useNavigate();

  const onSubmit = (values) => {
    // handle data here
    // navigate('/creator');
  }

  return (
    <div id="quiz-creation-form">
      <div id="overlay" />
      <form className="form-container">
        <h3>Create a quiz</h3>

        <div className="form-control">
          <label>Quiz name</label>
          <input />
        </div>

        <div className="form-control">
          <label>Relevant subjects of this quiz</label>
          <div className="subjects-list">
            {subjects.map(subject => (
              <React.Fragment key={subject}>
                <input type="checkbox" name="subjects" id={subject} value={subject} />
                <label for={subject} className="subject">{subject}</label>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="btn-group">
          <button type="button" className="cancel-btn">Cancel</button>
          <button type="submit" className="next-btn">Next</button>
        </div>
      </form>
    </div>
  );
}

export default QuizCreationForm;