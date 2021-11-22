import './QuizCreationForm.scss';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { quizCreationShowVar } from '../../apolloLocalState/popupFormState'
import subjects from '../../data/subjects';

function QuizCreationForm() {
  const navigate = useNavigate();

  const closeForm = () => {
    quizCreationShowVar(false);
  }

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
          <button type="button" className="cancel-btn" onClick={closeForm}>Cancel</button>
          <button type="submit" className="next-btn">Next</button>
        </div>
      </form>
    </div>
  );
}

export default QuizCreationForm;