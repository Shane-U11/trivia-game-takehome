"use client"
import { Grid, Button, Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import "../globals.css";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const Quiz = () => {
    const [questions, setQuestions] = useState<{
        allAnswers: any; question: string, correct_answer: string, answers: string[] 
}[]>([])
    const [selectedAnswer, setSelectedAnswer] = useState<string[]>([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

    const shuffleArray = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const fetchQuestions = await fetch("https://opentdb.com/api.php?amount=10&category=21&type=multiple")
                const response = await fetchQuestions.json()
                const responseResults = response.results.map((data: any) => {
                    const correctAnswer = data.correct_answer
                    const incorrectAnswers = data.incorrect_answers
                    const answersArr = shuffleArray([correctAnswer, ...incorrectAnswers])
                    return {
                        question: data.question,
                        correct_answer: correctAnswer,
                        allAnswers: answersArr
                    }
                })
                setQuestions(responseResults)
            } catch (error) {
                console.error('Error fetching data', error)
            }
        }
        fetchProblems()
    }, [])

    const handleAnswerClick = (answer: string) => {
        setSelectedAnswer(prev => {
            const newAnswers = [...prev]
            newAnswers[currentQuestionIndex] = answer
            return newAnswers
        })
    }

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prev => prev + 1)
    }

    const replayQuiz = () => {
        return (
            setCurrentQuestionIndex(0),
            setSelectedAnswer([])
        )
    }

    if (questions.length === 0) {
        return <div id='background-image'>
            Loading...
            </div>
    }

    const currentQuestion = questions[currentQuestionIndex]
    const currentAnswer = selectedAnswer[currentQuestionIndex]

    return (
        <div>
            <h1>Quiz</h1>
            <Grid container rowSpacing={5} columnSpacing={{ md: 8 }}>
                <Grid item xs={20}>
                    <Item sx={{ fontSize: '20px' }}>{currentQuestion.question}</Item>
                    <Item>{`${currentQuestionIndex + 1}/10`}</Item>
                </Grid>
                {currentQuestion.allAnswers.map((answer, index) => (
                    <Grid item xs={6} key={index}>
                        <Item>
                            <Button
                                onClick={() => handleAnswerClick(answer)}
                                variant={currentAnswer === answer ? "contained" : "outlined"}
                            >
                                {answer}
                            </Button>
                        </Item>
                    </Grid>
                ))}
            </Grid>
            {currentQuestionIndex < questions.length - 1 && selectedAnswer.length > currentQuestionIndex && (
                <><Box display="flex" justifyContent="center" mt={4}
                /><Button variant='contained' onClick={handleNextQuestion}>Next Question</Button></>
            )}
            {currentQuestionIndex === questions.length - 1 && selectedAnswer.length === questions.length && (
                <div>
                    <h2>Quiz Complete!</h2>
                    <p>Score: {selectedAnswer.filter((answer, index) => answer === questions[index].correct_answer).length}/{questions.length}</p>
                    <><Box display="flex" justifyContent="center" mt={4}
                /><Button variant='contained' onClick={replayQuiz}>Replay Quiz</Button></>
                </div>
            )}
        </div>
    )
}

export default Quiz