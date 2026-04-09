import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Trophy,
  Layout,
  Info
} from 'lucide-react'
import confetti from 'canvas-confetti'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './QuizModal.css'

export default function QuizModal({ 
  isOpen,          
  onClose,         
  experimentId,    
  experimentTitle, 
  questions = [],  
  onComplete       
}) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Guard: if not open, show nothing
  if (!isOpen) return null

  // Guard: if no questions, show message
  if (!questions || questions.length === 0) {
    return (
      <div style={{
        position:'fixed', inset:0, zIndex:1000,
        background:'rgba(6,8,15,0.95)',
        display:'flex', alignItems:'center', 
        justifyContent:'center'
      }}>
        <div style={{
          background:'#0d1117', border:'1px solid #1e2a3a',
          borderRadius:'16px', padding:'40px',
          textAlign:'center', maxWidth:'400px'
        }}>
          <div style={{fontSize:'3rem', marginBottom:'16px'}}>📝</div>
          <h3 style={{color:'#e0eaff', fontFamily:'Syne,sans-serif',
            fontWeight:800, marginBottom:'8px'}}>
            No Quiz Available
          </h3>
          <p style={{color:'#4a5a7a', fontFamily:'Space Mono,monospace',
            fontSize:'12px', marginBottom:'24px'}}>
            Quiz questions for this experiment are coming soon.
          </p>
          <button onClick={onClose} style={{
            padding:'10px 24px', background:'#00e5ff',
            color:'#000', border:'none', borderRadius:'8px',
            fontFamily:'Syne,sans-serif', fontWeight:700,
            cursor:'pointer'
          }}>
            Close
          </button>
        </div>
      </div>
    )
  }

  const handleOptionClick = (index) => {
    if (isAnswered) return
    setSelectedOption(index)
  }

  const handleSubmitAnswer = () => {
    const isCorrect = selectedOption === questions[currentQuestion].correctAnswer
    if (isCorrect) {
      setScore(score + 1)
      toast.success('Correct!')
    } else {
      toast.error('Incorrect!')
    }
    setIsAnswered(true)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
      setIsAnswered(false)
    } else {
      finishQuiz()
    }
  }

  const finishQuiz = async () => {
    setShowResult(true)
    const finalScore = score + (selectedOption === questions[currentQuestion].correctAnswer ? 1 : 0)
    
    if (finalScore === questions.length) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00e5ff', '#ffcc00', '#ff00ff']
      })
    }

    setSubmitting(true)
    try {
      if (user) {
        await api.post('/quiz/submit', {
          experimentId,
          score: finalScore,
          totalQuestions: questions.length
        })
      }
      if (onComplete) onComplete(finalScore)
    } catch (err) {
      console.error('Failed to submit quiz:', err)
      toast.error('Failed to save progress, but quiz completed!')
    } finally {
      setSubmitting(false)
    }
  }

  const question = questions[currentQuestion]

  return (
    <div className="quiz-overlay glass">
      <motion.div 
        className="quiz-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {!showResult ? (
          <>
            <div className="quiz-header">
              <div className="quiz-progress" style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="mono" style={{ color: '#00e5ff' }}>Question {currentQuestion + 1} / {questions.length}</span>
                  <span className="mono" style={{ color: '#4a5a7a' }}>{experimentTitle}</span>
                </div>
                <div className="progress-dots" style={{ display: 'flex', gap: '4px' }}>
                  {questions.map((_, i) => (
                      <div 
                        key={i} 
                        style={{ 
                          height: '4px', flex: 1, borderRadius: '2px',
                          background: i <= currentQuestion ? '#00e5ff' : '#1e2a3a'
                        }} 
                      />
                  ))}
                </div>
              </div>
              <button className="close-btn" onClick={onClose} style={{ marginLeft: '16px', background: 'none', border: 'none', color: '#4a5a7a', cursor: 'pointer' }}>
                <XCircle />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={currentQuestion}
                className="question-container"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                style={{ padding: '24px 0' }}
              >
                <h2 className="syne-bold" style={{ color: '#e0eaff', fontSize: '1.5rem', marginBottom: '24px' }}>
                  {question.question}
                </h2>
                
                <div className="options-grid" style={{ display: 'grid', gap: '12px' }}>
                  {question.options.map((option, index) => {
                    let status = ''
                    if (isAnswered) {
                      if (index === question.correctAnswer) status = 'correct'
                      else if (index === selectedOption) status = 'wrong'
                    } else if (index === selectedOption) {
                      status = 'selected'
                    }

                    return (
                      <button 
                        key={index}
                        className={`option-btn ${status}`}
                        onClick={() => handleOptionClick(index)}
                        disabled={isAnswered}
                        style={{
                          display: 'flex', alignItems: 'center', padding: '16px',
                          background: status === 'correct' ? 'rgba(0, 255, 136, 0.1)' : 
                                      status === 'wrong' ? 'rgba(255, 77, 109, 0.1)' :
                                      status === 'selected' ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${status === 'correct' ? '#00ff88' : 
                                               status === 'wrong' ? '#ff4d6d' : 
                                               status === 'selected' ? '#00e5ff' : '#1e2a3a'}`,
                          borderRadius: '12px', color: '#e0eaff', cursor: isAnswered ? 'default' : 'pointer'
                        }}
                      >
                        <div className="option-letter" style={{ 
                          width: '24px', height: '24px', borderRadius: '6px', 
                          background: 'rgba(255,255,255,0.05)', display: 'flex', 
                          alignItems: 'center', justifyContent: 'center', marginRight: '12px',
                          fontSize: '12px', fontWeight: 800
                        }}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <div className="option-text" style={{ flex: 1, textAlign: 'left' }}>{option}</div>
                        {status === 'correct' && <CheckCircle size={18} color="#00ff88" />}
                        {status === 'wrong' && <XCircle size={18} color="#ff4d6d" />}
                      </button>
                    )
                  })}
                </div>

                {isAnswered && (
                  <motion.div 
                    className="explanation-box"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    style={{ 
                      marginTop: '20px', padding: '16px', background: 'rgba(0, 229, 255, 0.05)',
                      borderRadius: '12px', border: '1px solid rgba(0, 229, 255, 0.1)',
                      display: 'flex', gap: '12px'
                    }}
                  >
                    <Info size={16} color="#00e5ff" style={{ flexShrink: 0 }} />
                    <p style={{ color: '#4a5a7a', fontSize: '13px', margin: 0 }}>{question.explanation}</p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="quiz-footer" style={{ borderTop: '1px solid #1e2a3a', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              {!isAnswered ? (
                <button 
                  className="submit-btn" 
                  disabled={selectedOption === null}
                  onClick={handleSubmitAnswer}
                  style={{
                    padding: '12px 32px', background: '#00e5ff', color: '#000',
                    borderRadius: '8px', border: 'none', fontWeight: 800, cursor: 'pointer',
                    opacity: selectedOption === null ? 0.5 : 1
                  }}
                >
                  Submit Answer
                </button>
              ) : (
                <button 
                  className="next-btn" 
                  onClick={handleNext}
                  style={{
                    padding: '12px 32px', background: '#e0eaff', color: '#000',
                    borderRadius: '8px', border: 'none', fontWeight: 800, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}
                >
                  {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="result-container" style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
              <Trophy size={80} color="#ffcc00" />
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                style={{ 
                  position: 'absolute', top: -10, right: -10, background: '#00e5ff', 
                  color: '#000', width: '32px', height: '32px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '14px'
                }}
              >
                ✓
              </motion.div>
            </div>
            
            <h1 className="syne-bold" style={{ color: '#e0eaff', fontSize: '2rem', marginBottom: '8px' }}>
              Quiz Completed!
            </h1>
            
            <div className="score-display" style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: '#00e5ff' }}>
                {score} / {questions.length}
              </div>
              <p style={{ color: '#4a5a7a' }}>
                {score === questions.length ? "Perfect Score! You're a pro!" : 
                 score >= questions.length / 2 ? "Great job! Almost there." : "Keep studying and try again!"}
              </p>
            </div>

            <div className="result-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                className="secondary-btn" 
                onClick={() => {
                  setCurrentQuestion(0)
                  setSelectedOption(null)
                  setIsAnswered(false)
                  setScore(0)
                  setShowResult(false)
                }}
                style={{
                  padding: '12px 24px', background: 'rgba(255,255,255,0.05)', color: '#e0eaff',
                  borderRadius: '8px', border: '1px solid #1e2a3a', fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <RotateCcw size={18} /> Try Again
              </button>
              <button 
                className="primary-btn" 
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '12px 24px', background: '#00e5ff', color: '#000',
                  borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <Layout size={18} /> Dashboard
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
