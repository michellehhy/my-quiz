import './styles.css';
import React, { useState } from 'react';
import { category, fetchQuizQuestions } from './API';

//Components
import QuestionCard from './components/QuestionCard';

//Types
import { QuestionState, Type, Difficulty } from './API';

//Styles
import { GlobalStyle, Wrapper } from './App.styles'

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [qNumber, setQNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  // console.log(fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY));
  console.log(questions);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Type.SCIENCE_NATURE,
      Difficulty.EASY,

    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setQNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      //user answer
      const answer = e.currentTarget.value;
      //check answer
      const correct = questions[qNumber].correct_answer === answer;
      //add score if correct
      if (correct) setScore(prev => prev + 1);
      //save answer in array 
      const AnswerObject = {
        question: questions[qNumber].question,
        answer,
        correct,
        correctAnswer: questions[qNumber].correct_answer
      };
      setUserAnswers(prev => [...prev, AnswerObject]);
    }
  };

  const nextQuestion = () => {
    const nextQuestion = qNumber + 1;

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    }else{
      setQNumber(nextQuestion);
    }
  };

  return (
    <>
    <GlobalStyle />
    <Wrapper>
    {/* <div className="App"> */}
      <h1> Quiz </h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
        <button className='start' onClick={startTrivia}>
          Start
        </button>
      ) : null}
      {!gameOver ? <p className='score'> Score: {score} </p> : null}
      {loading ? <p> Loading Questions ... </p> : null}
      {!loading && !gameOver && (
        <QuestionCard
          questionNumber={qNumber + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[qNumber].question}
          answers={questions[qNumber].answers}
          userAnswer={userAnswers ? userAnswers[qNumber] : undefined}
          callback={checkAnswer}
        />
      )}
      {!gameOver && !loading && userAnswers.length === qNumber + 1 && qNumber !== TOTAL_QUESTIONS - 1 ? (
      <button className='next' onClick={nextQuestion}>
        Next Question
      </button>
      ) : null}
    </Wrapper>
    </>
  );
};

export default App;
