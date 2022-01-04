import './QuizCreationForm.scss';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { quizCreationShowVar } from '../../apolloLocalState/popupFormState';
import TextError from '../../../shared/alerts/TextError';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import subjects from '../../data/subjects';

const schema = yup.object({
  quizName: yup.string().required('*Required'),
  quizSubjects: yup.array().min(1, '*Please choose at least one relevant subject')
});

const defaultValues = {
  quizSubjects: []
}

function QuizCreationForm() {
  const navigate = useNavigate();

  const closeForm = () => {
    quizCreationShowVar(false);
  }

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const onSubmit = (values) => {
    console.log(values)
    navigate('/editor', { state: values }); // nên push hay replace?
  }

  return (
    <div id="quiz-creation-form">
      <div id="overlay" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-container"
      >
        <h3>Create a quiz</h3>

        <div className="form-control">
          <label>Quiz name</label>
          <input {...register("quizName")} />
          <TextError>{errors.quizName?.message}</TextError>
        </div>

        <div className="form-control">
          <label>Relevant subjects of this quiz</label>
          <div className="subjects-list">
            {subjects.map(subject => (
              <React.Fragment key={subject}>
                <input {...register("quizSubjects")} type="checkbox" id={subject} value={subject} />
                <label for={subject} className="subject">{subject}</label>
              </React.Fragment>
            ))}
          </div>
          <TextError>{errors.quizSubjects?.message}</TextError>
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