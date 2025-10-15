'use client';

import { useState, useEffect } from 'react';
import { quizApi } from '@/lib/api/services';
import { Quiz, Question, QuizAttempt } from '@/types';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle, Clock, Award } from 'lucide-react';

interface QuizComponentProps {
  quizId: string;
  onComplete?: (attempt: QuizAttempt) => void;
}

export default function QuizComponent({ quizId, onComplete }: QuizComponentProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (quiz?.timeLimit && timeLeft === null) {
      setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
    }
  }, [quiz]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResults]);

  const fetchQuiz = async () => {
    try {
      const data = await quizApi.getQuizById(quizId);
      setQuiz(data);
    } catch (error) {
      console.error('Failed to fetch quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    try {
      const result = await quizApi.submitQuiz(quizId, answers);
      setAttempt(result);
      setShowResults(true);
      if (onComplete) {
        onComplete(result);
      }
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    }
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions!.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="text-center py-8">Loading quiz...</div>;
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <div className="text-center py-8">Quiz not available</div>;
  }

  if (showResults && attempt) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          {attempt.passed ? (
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          ) : (
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          )}
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {attempt.passed ? 'Congratulations!' : 'Keep Trying!'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {attempt.passed
              ? 'You have successfully passed this quiz.'
              : "You didn't pass this time, but don't give up!"}
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {attempt.score}%
            </div>
            <div className="text-gray-600">
              Passing score: {quiz.passingScore}%
            </div>
          </div>

          {attempt.passed && (
            <div className="flex items-center justify-center gap-2 text-yellow-600 mb-6">
              <Award className="h-5 w-5" />
              <span className="font-semibold">Quiz Completed!</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-left mb-6">
            <div className="bg-white border rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Correct Answers</div>
              <div className="text-2xl font-bold text-green-600">
                {attempt.answers.filter((a:any) => a.isCorrect).length}/{quiz.questions.length}
              </div>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Your Score</div>
              <div className="text-2xl font-bold text-primary-600">
                {attempt.score}%
              </div>
            </div>
          </div>

          {!attempt.passed && (
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Quiz Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{quiz.title}</h2>
          {timeLeft !== null && (
            <div className="flex items-center gap-2 text-red-600">
              <Clock className="h-5 w-5" />
              <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {quiz.description && (
          <p className="text-gray-600 mb-4">{quiz.description}</p>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="card p-6 mb-6">
        <div className="mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-primary-100 text-primary-700 font-semibold px-3 py-1 rounded">
              Q{currentQuestionIndex + 1}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 flex-1">
              {currentQuestion.questionText}
            </h3>
          </div>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {currentQuestion.options?.map((option) => (
            <label
              key={option.id}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                answers[currentQuestion.id] === option.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option.id}
                checked={answers[currentQuestion.id] === option.id}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                className="mr-3"
              />
              <span className="text-gray-900">{option.optionText}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="text-sm text-gray-600">
          {Object.keys(answers).length} of {quiz.questions.length} answered
        </div>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== quiz.questions.length}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}