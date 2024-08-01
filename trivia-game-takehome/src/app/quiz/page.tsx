"use client"
import React, { useEffect, useState } from 'react'

const Quiz = () => {
     useEffect(() => {
        const fetchProblems = async () => {
            try {
                const fetchQuestions = await fetch("https://opentdb.com/api.php?amount=10&category=21&type=multiple")
                const response = await fetchQuestions.json()
                const responseResults = response.results.map((data: any) => {
                    const correctAnswer = data.correct_answer
                    const incorrectAnswers = data.incorrect_answers
                    console.log('C', correctAnswer)
                    console.log('I', incorrectAnswers)
                })
                console.log(responseResults)
            } catch (error) {
                console.error('Error fetching data', error)
            }
        }
        fetchProblems()
    }, [])
}

export default Quiz