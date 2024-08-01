"use client"
import React, { useEffect, useState } from 'react'

const Quiz = () => {
    const [questionsAndAnswers, setQuestionsAndAnswers] = useState<{ question: string, correct_answer: string, answers: string[] }[]>([])

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
                    // console.log('C', correctAnswer)
                    // console.log('I', incorrectAnswers)
                    const answersArr = shuffleArray([correctAnswer, ...incorrectAnswers])
                    // console.log('HERE', answersArr, correctAnswer)
                    return {
                        question: data.question,
                        correct_answer: correctAnswer,
                        allAnswers: answersArr
                    }
                })
                setQuestionsAndAnswers(responseResults)
            } catch (error) {
                console.error('Error fetching data', error)
            }
        }
        fetchProblems()
    }, [])
}

export default Quiz