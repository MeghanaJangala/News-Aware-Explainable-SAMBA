'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  FileText,
  LineChart,
  Menu,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react'

const questions = [
  'What is the expected movement of NVIDIA based on recent financial news?',
  'Will AAPL move up based on recent news?',
  'What factors are influencing Tesla?',
  "Why is Microsoft's sentiment positive?",
]

function Mark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3"
      aria-label="FinMamba AI home"
    >
      <span className="mark">
        <span />
      </span>

      <span className="brand-name">
        FinMamba <b>AI</b>
      </span>
    </Link>
  )
}

function Step({
  n,
  icon: Icon,
  title,
  text,
}: {
  n: string
  icon: typeof MessageSquare
  title: string
  text: string
}) {
  return (
    <div className="step">
      <span className="step-number">{n}</span>

      <div className="step-icon">
        <Icon size={19} />
      </div>

      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  )
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof MessageSquare
  title: string
  text: string
}) {
  return (
    <div className="feature-card">
      <div className="feature-icon">
        <Icon size={19} />
      </div>

      <h3>{title}</h3>
      <p>{text}</p>

      <ArrowUpRight className="feature-arrow" size={17} />
    </div>
  )
}

export default function Page() {
  const [menu, setMenu] = useState(false)

  // User question
  const [question, setQuestion] = useState('')

  // API response
  const [response, setResponse] = useState<any>(null)

  // Loading state
  const [loading, setLoading] = useState(false)

  // Error message
  const [error, setError] = useState('')

  // Call FastAPI
  const askFinMamba = async () => {
    if (!question.trim()) {
      return
    }

    setLoading(true)
    setResponse(null)
    setError('')

    try {
      const apiUrl = process.env.NEXT_PUBLIC_FINMAMBA_API

      if (!apiUrl) {
        throw new Error('FinMamba API URL is not configured.')
      }

      const res = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim(),
        }),
      })

      if (!res.ok) {
        throw new Error(`API request failed: ${res.status}`)
      }

      const data = await res.json()

      console.log('FinMamba API response:', data)

      setResponse(data)
    } catch (err) {
      console.error('FinMamba API error:', err)

      setError(
        'Unable to connect to FinMamba API. Please make sure the Colab backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  // When user clicks one of the suggested questions
  const selectQuestion = (q: string) => {
    setQuestion(q)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <main className="landing-shell">

      {/* ================= NAVBAR ================= */}

      <header className="nav-wrap">
        <nav className="nav container">
          <Mark />

          <div className="nav-links">
            <a href="#product">Product</a>
            <a href="#how">How it works</a>
            <a href="#explainability">Explainability</a>
          </div>

          <div className="nav-actions">
            <Link href="/login" className="quiet-link">
              Log in
            </Link>

            <button
              className="button button-sm"
              onClick={() => {
                document
                  .getElementById('finmamba-query')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Get started
              <ArrowRight size={15} />
            </button>
          </div>

          <button
            className="mobile-menu"
            onClick={() => setMenu(!menu)}
            aria-label="Open navigation"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </nav>

        {menu && (
          <div className="mobile-nav">
            <a
              href="#product"
              onClick={() => setMenu(false)}
            >
              Product
            </a>

            <a
              href="#how"
              onClick={() => setMenu(false)}
            >
              How it works
            </a>

            <a
              href="#explainability"
              onClick={() => setMenu(false)}
            >
              Explainability
            </a>

            <Link href="/login">
              Log in
            </Link>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}

      <section className="hero container">

        <div className="hero-copy">

          <div className="eyebrow reveal">
            <span className="status-dot" />
            Built for clearer decisions
          </div>

          <h1 className="reveal delay-1">
            Ask about the market.
            <br />
            <em>Understand the prediction.</em>
          </h1>

          <p className="hero-text reveal delay-2">
            FinMamba analyzes financial news sentiment and market signals to
            generate explainable stock movement predictions.
          </p>

          <div className="hero-actions reveal delay-3">
            <Link href="/login" className="button">
              Try FinMamba
              <ArrowRight size={16} />
            </Link>
          
            <a href="#how" className="text-button">
              How it works
              <ChevronRight size={16} />
            </a>

          </div>

          <p className="hero-note reveal delay-3">
            <ShieldCheck size={14} />
            Model-generated insights, not financial advice
          </p>

        </div>

        {/* ================= FINMAMBA QUERY ================= */}

        <div
          id="finmamba-query"
          className="hero-visual reveal delay-2"
        >

          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />

          <div className="demo-window">

            <div className="window-top">

              <span>
                <i />
                <i />
                <i />
              </span>

              <span className="window-label">
                <Sparkles size={13} />
                FINMAMBA AI
              </span>

              <span>•••</span>

            </div>

            <div className="demo-body">

              {/* QUESTION INPUT */}

              <div className="user-bubble">

                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) {
                      askFinMamba()
                    }
                  }}
                  placeholder="Ask about a stock..."
                  aria-label="Ask FinMamba"
                />

              </div>

              {/* ASK BUTTON */}

              {!loading && !response && (
                <button
                  className="demo-loading"
                  onClick={askFinMamba}
                  disabled={!question.trim()}
                >
                  Ask FinMamba
                  <ArrowRight size={14} />
                </button>
              )}

              {/* LOADING */}

              {loading && (
                <div className="demo-loading">

                  <span className="typing">
                    <i />
                    <i />
                    <i />
                  </span>

                  Analyzing signals...

                </div>
              )}

              {/* ERROR */}

              {error && (
                <div className="demo-error">
                  {error}
                </div>
              )}

              {/* ACTUAL API RESPONSE */}

              {response && !loading && (
                <div className="demo-result">

                  <div className="result-label">
                    MODEL ANALYSIS
                    <span>JUST NOW</span>
                  </div>

                  <div className="result-answer">

                    {typeof response === 'string' ? (
                      <p>{response}</p>
                    ) : (
                      <pre>
                        {JSON.stringify(response, null, 2)}
                      </pre>
                    )}

                  </div>

                  <button
                    className="text-button"
                    onClick={() => {
                      setQuestion('')
                      setResponse(null)
                      setError('')
                    }}
                  >
                    Ask another question
                    <ArrowRight size={16} />
                  </button>

                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUST ================= */}

      <section className="trust-row container">

        <span>
          Designed for the questions behind the numbers
        </span>

        <div>
          <span>NEWS SENTIMENT</span>
          <span>MARKET SIGNALS</span>
          <span>MODEL EXPLANATIONS</span>
        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section id="how" className="section container">

        <div className="section-heading">

          <p className="eyebrow">
            THE PROCESS
          </p>

          <h2>
            From your question to an
            <br />
            <em>explainable prediction.</em>
          </h2>

        </div>

        <div className="steps">

          <Step
            n="01"
            icon={MessageSquare}
            title="Ask a question"
            text="Ask about a supported stock using natural language."
          />

          <Step
            n="02"
            icon={LineChart}
            title="Analyze signals"
            text="FinMamba processes the available financial signals."
          />

          <Step
            n="03"
            icon={FileText}
            title="Read the news"
            text="Financial news sentiment is incorporated into the analysis."
          />

          <Step
            n="04"
            icon={ShieldCheck}
            title="See the why"
            text="Receive a prediction alongside its major contributing factors."
          />

        </div>
      </section>

      {/* ================= EXPLAINABILITY ================= */}

      <section
        id="explainability"
        className="explain-section"
      >

        <div className="container explain-grid">

          <div>

            <p className="eyebrow">
              BUILT FOR CLARITY
            </p>

            <h2>
              Don&apos;t just get a prediction.
              <br />
              <em>Understand it.</em>
            </h2>

            <p className="body-copy">
              Every output is paired with the signals that shaped it, so you
              can interrogate the model instead of taking a black-box answer
              on faith.
            </p>

            <button
              className="text-button"
              onClick={() => {
                document
                  .getElementById('finmamba-query')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Explore the assistant
              <ArrowRight size={16} />
            </button>

          </div>

          {/* DYNAMIC RESPONSE CARD */}

          <div className="explain-card">

            {!response ? (

              <div className="explain-question">

                <span>FINMAMBA AI</span>

                <p>
                  Ask a question to see your model response here.
                </p>

              </div>

            ) : (

              <>
                <div className="explain-question">

                  <span>YOU ASKED</span>

                  <p>
                    {question}
                  </p>

                </div>

                <div className="explain-answer">

                  <pre>
                    {JSON.stringify(response, null, 2)}
                  </pre>

                </div>
              </>
            )}

          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}

      <section
        id="product"
        className="section container feature-section"
      >

        <div className="section-heading center">

          <p className="eyebrow">
            THE FINMAMBA EDGE
          </p>

          <h2>
            Market context, made <em>intelligible.</em>
          </h2>

        </div>

        <div className="feature-grid">

          <Feature
            icon={MessageSquare}
            title="Natural language queries"
            text="Ask questions about supported stocks in plain language."
          />

          <Feature
            icon={TrendingUp}
            title="AI stock prediction"
            text="Get model-generated movement predictions with context."
          />

          <Feature
            icon={FileText}
            title="News sentiment"
            text="Understand the sentiment surrounding financial news."
          />

          <Feature
            icon={ShieldCheck}
            title="Explainable AI"
            text="See the factors contributing to every prediction."
          />

        </div>

      </section>

      {/* ================= QUESTIONS ================= */}

      <section className="questions-section container">

        <div>

          <p className="eyebrow">
            START WITH A QUESTION
          </p>

          <h2>
            What can you ask
            <br />
            <em>FinMamba?</em>
          </h2>

        </div>

        <div className="question-list">

          {questions.map((q, i) => (

            <button
              className="question-row"
              key={q}
              onClick={() => selectQuestion(q)}
            >

              <span>
                0{i + 1}
              </span>

              <strong>
                {q}
              </strong>

              <ArrowUpRight size={17} />

            </button>

          ))}

        </div>

      </section>

      {/* ================= CLOSING ================= */}

      <section className="closing container">

        <div>

          <p className="eyebrow">
            BETTER QUESTIONS. CLEARER SIGNALS.
          </p>

          <h2>
            Turn financial news into
            <br />
            <em>explainable AI insights.</em>
          </h2>

        </div>

        <button
          className="button"
          onClick={() => {
            document
              .getElementById('finmamba-query')
              ?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Try FinMamba
          <ArrowRight size={16} />
        </button>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer container">

        <div>

          <Mark />

          <p>
            AI-powered stock insights, explained.
          </p>

        </div>

        <div className="footer-links">

          <a href="#product">
            Product
          </a>

          <a href="#how">
            How it works
          </a>

          <a href="#explainability">
            Explainability
          </a>

          <Link href="/settings">
            Privacy
          </Link>

        </div>

        <p className="disclaimer">
          FinMamba AI provides model-generated market insights for
          informational and research purposes only. It does not provide
          financial advice or guarantee future market performance.
        </p>

      </footer>

    </main>
  )
}