'use client'

import { useState } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  FileText,
  Home,
  Menu,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
  Sparkles,
  Eye,
  X,
  TrendingUp,
  BarChart3,
  ShieldCheck,
} from 'lucide-react'

const questions = [
  'What is the expected movement of NVIDIA based on recent financial news?',
  'Will AAPL move up based on recent news?',
  'What factors are influencing Tesla?',
  "Why is Microsoft's sentiment positive?",
]

/* =========================================================
   MARKDOWN RENDERER
   ========================================================= */

function MarkdownContent({
  children,
}: {
  children: string
}) {
  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {children}
      </ReactMarkdown>
    </div>
  )
}

/* =========================================================
   SIDEBAR
   ========================================================= */

function Mark({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-3"
      aria-label="FinMamba AI home"
    >
      <span className="mark">
        <span />
      </span>

      <span className={compact ? 'sr-only' : 'brand-name'}>
        FinMamba <b>AI</b>
      </span>
    </Link>
  )
}

function SideLink({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: typeof Home
  label: string
}) {
  return (
    <Link href={href}>
      <Icon size={17} />
      <span>{label}</span>
    </Link>
  )
}

function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean
  setCollapsed: (value: boolean) => void
}) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="side-head">
        <Mark compact={collapsed} />

        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <PanelLeftOpen size={17} />
          ) : (
            <PanelLeftClose size={17} />
          )}
        </button>
      </div>

      <Link href="/assistant" className="new-analysis">
        <Plus size={16} />
        <span>New analysis</span>
      </Link>

      <div className="side-nav">
        <p>Workspace</p>

        <SideLink
          href="/assistant"
          icon={Home}
          label="Assistant"
        />

        <SideLink
          href="/history"
          icon={FileText}
          label="History"
        />

        <SideLink
          href="/watchlist"
          icon={Eye}
          label="Watchlist"
        />

        <SideLink
          href="/settings"
          icon={Settings}
          label="Settings"
        />
      </div>

      <div className="recent">
        <p>Recent questions</p>

        {[
          'NVIDIA prediction',
          'AAPL news analysis',
          'Tesla sentiment',
          'Microsoft outlook',
        ].map((question) => (
          <Link key={question} href="/assistant">
            <MessageSquare size={14} />
            <span>{question}</span>
          </Link>
        ))}
      </div>

      <div className="profile">
        <div className="avatar">JD</div>

        <div className="profile-text">
          <strong>Jordan Davis</strong>
          <span>Personal workspace</span>
        </div>

        <ChevronRight size={15} />
      </div>
    </aside>
  )
}

/* =========================================================
   QUESTION COMPOSER
   ========================================================= */

function QuestionComposer({
  value,
  setValue,
  onSubmit,
  submitted,
  loading,
}: {
  value: string
  setValue: (value: string) => void
  onSubmit: (value?: string) => void
  submitted: boolean
  loading: boolean
}) {
  return (
    <div className={`composer ${submitted ? 'compact' : ''}`}>
      <Sparkles size={18} />

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (
            e.key === 'Enter' &&
            !e.nativeEvent.isComposing &&
            !loading
          ) {
            onSubmit()
          }
        }}
        placeholder="Ask about a supported stock..."
        aria-label="Ask FinMamba a question"
        disabled={loading}
      />

      <button
        onClick={() => onSubmit()}
        aria-label="Send question"
        disabled={loading || !value.trim()}
      >
        <ArrowRight size={18} />
      </button>
    </div>
  )
}

/* =========================================================
   ANALYSIS LOADER
   ========================================================= */

function AnalysisLoader() {
  return (
    <div className="analysis-loader">
      <div className="loader-head">
        <div className="loader-spinner">
          <Sparkles size={16} />
        </div>

        <div>
          <strong>Analyzing your question</strong>
          <span>
            FinMamba is connecting the signals
          </span>
        </div>
      </div>

      <div className="analysis-steps">
        {[
          'Identifying stock',
          'Processing financial signals',
          'Analyzing financial news',
          'Running FinMamba model',
          'Generating explanation',
        ].map((step, index) => (
          <div
            key={step}
            className={
              index < 3
                ? 'done'
                : index === 3
                  ? 'active'
                  : ''
            }
          >
            <span>
              {index < 3
                ? '✓'
                : index === 3
                  ? '◉'
                  : '○'}
            </span>

            {step}
          </div>
        ))}
      </div>
    </div>
  )
}

/* =========================================================
   RESPONSE HELPERS
   ========================================================= */

function getValue(
  data: Record<string, any>,
  keys: string[]
) {
  for (const key of keys) {
    if (
      data[key] !== undefined &&
      data[key] !== null
    ) {
      return data[key]
    }
  }

  return null
}

function formatConfidence(value: any) {
  if (value === null || value === undefined) {
    return null
  }

  const number = Number(value)

  if (Number.isNaN(number)) {
    return String(value)
  }

  if (number <= 1) {
    return `${Math.round(number * 100)}%`
  }

  return `${Math.round(number)}%`
}

function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => formatValue(item))
      .join(', ')
  }

  return JSON.stringify(value, null, 2)
}

/* =========================================================
   FACTOR CARD
   ========================================================= */

function FactorCard({
  factor,
  index,
}: {
  factor: any
  index: number
}) {
  const factorName =
    typeof factor === 'string'
      ? factor
      : factor?.name ||
        factor?.factor ||
        factor?.title ||
        `Factor ${index + 1}`

  const factorDetail =
    typeof factor === 'string'
      ? ''
      : factor?.detail ||
        factor?.description ||
        factor?.reason ||
        ''

  const factorScore =
    typeof factor === 'object'
      ? factor?.score ??
        factor?.impact_score ??
        null
      : null

  return (
    <div className="factor-card">
      <div className="factor-card-top">
        <span className="factor-icon">
          {index === 0 ? (
            <MessageSquare size={16} />
          ) : index === 1 ? (
            <TrendingUp size={16} />
          ) : index === 2 ? (
            <BarChart3 size={16} />
          ) : (
            <ShieldCheck size={16} />
          )}
        </span>

        <span className="impact">
          Contributing factor
        </span>
      </div>

      <strong>
        {formatValue(factorName)}
      </strong>

      {factorDetail && (
        <MarkdownContent>
          {formatValue(factorDetail)}
        </MarkdownContent>
      )}

      {factorScore !== null && (
        <div className="line-track">
          <i
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  0,
                  Number(factorScore)
                )
              )}%`,
            }}
          />
        </div>
      )}
    </div>
  )
}

/* =========================================================
   FORMATTED RESULT PANEL
   ========================================================= */

function ResultPanel({
  response,
}: {
  response: unknown
}) {
  /*
   * =======================================================
   * CASE 1:
   * API directly returns a Markdown string
   * =======================================================
   */

  if (typeof response === 'string') {
    return (
      <div className="result-panel">
        <div className="result-header">
          <div>
            <span className="eyebrow">
              FINMAMBA AI · ANALYSIS COMPLETE
            </span>

            <h2>Model Analysis</h2>
          </div>

          <span className="badge positive">
            <ArrowUpRight size={14} />
            Complete
          </span>
        </div>

        <div className="result-overview">
          <div style={{ width: '100%' }}>
            <span className="eyebrow">
              MODEL RESPONSE
            </span>

            <MarkdownContent>
              {response}
            </MarkdownContent>
          </div>
        </div>

        <p className="disclaimer">
          FinMamba AI provides model-generated insights
          for informational and research purposes only
          and does not constitute financial advice.
        </p>
      </div>
    )
  }

  /*
   * =======================================================
   * CASE 2:
   * API returns an object
   * =======================================================
   */

  if (
    typeof response !== 'object' ||
    response === null
  ) {
    return null
  }

  const data = response as Record<string, any>

  const prediction = getValue(data, [
    'prediction',
    'predicted_movement',
    'movement',
    'direction',
    'label',
  ])

  const confidence = getValue(data, [
    'confidence',
    'model_confidence',
    'probability',
    'score',
  ])

  const sentiment = getValue(data, [
    'sentiment',
    'news_sentiment',
    'overall_sentiment',
  ])

  const explanation = getValue(data, [
    'explanation',
    'reason',
    'summary',
    'analysis',
    'response',
    'answer',
  ])

  const stock = getValue(data, [
    'stock',
    'ticker',
    'symbol',
    'company',
  ])

  const factors = getValue(data, [
    'factors',
    'contributing_factors',
    'key_factors',
    'reasons',
  ])

  /*
   * If the backend response is something like:
   *
   * {
   *   "response": "# 📊 FinMamba Stock Analysis..."
   * }
   *
   * then `explanation` contains the entire Markdown answer.
   *
   * In that situation, render it as Markdown rather than
   * trying to split it into prediction/factor cards.
   */

  const hasStructuredPrediction =
    prediction !== null ||
    confidence !== null ||
    sentiment !== null ||
    factors !== null

  if (
    !hasStructuredPrediction &&
    explanation
  ) {
    return (
      <div className="result-panel">
        <div className="result-header">
          <div>
            <span className="eyebrow">
              FINMAMBA AI · ANALYSIS COMPLETE
            </span>

            <h2>Model Analysis</h2>
          </div>

          <span className="badge positive">
            <ArrowUpRight size={14} />
            Complete
          </span>
        </div>

        <div className="result-overview">
          <div style={{ width: '100%' }}>
            <span className="eyebrow">
              MODEL RESPONSE
            </span>

            <MarkdownContent>
              {formatValue(explanation)}
            </MarkdownContent>
          </div>
        </div>

        <p className="disclaimer">
          FinMamba AI provides model-generated insights
          for informational and research purposes only
          and does not constitute financial advice.
        </p>
      </div>
    )
  }

  const isBullish =
    typeof prediction === 'string' &&
    prediction
      .toLowerCase()
      .includes('bull')

  const isBearish =
    typeof prediction === 'string' &&
    prediction
      .toLowerCase()
      .includes('bear')

  return (
    <div className="result-panel">

      {/* =================================================
          HEADER
         ================================================= */}

      <div className="result-header">
        <div>
          <span className="eyebrow">
            FINMAMBA AI · ANALYSIS COMPLETE
          </span>

          <h2>
            {stock
              ? formatValue(stock)
              : 'Model Analysis'}
          </h2>
        </div>

        {prediction && (
          <span
            className={`badge ${
              isBearish
                ? 'negative'
                : 'positive'
            }`}
          >
            {isBullish && (
              <ArrowUpRight size={14} />
            )}

            {isBearish && (
              <ArrowDownRight size={14} />
            )}

            {!isBullish &&
              !isBearish && (
                <TrendingUp size={14} />
              )}

            {formatValue(prediction)}
          </span>
        )}
      </div>

      {/* =================================================
          PREDICTION
         ================================================= */}

      <div className="result-overview">

        <div>
          <span className="eyebrow">
            PREDICTED MOVEMENT
          </span>

          <strong className="prediction">
            {prediction
              ? formatValue(prediction)
              : 'Prediction available'}
          </strong>

          {explanation && (
            <MarkdownContent>
              {formatValue(explanation)}
            </MarkdownContent>
          )}
        </div>

        {confidence !== null && (
          <div className="confidence-ring">
            <strong>
              {formatConfidence(
                confidence
              )}
            </strong>

            <span>
              model confidence
            </span>
          </div>
        )}

      </div>

      {/* =================================================
          STATS
         ================================================= */}

      {(sentiment !== null ||
        confidence !== null ||
        prediction !== null) && (
        <div className="stats-row">

          {prediction !== null && (
            <div>
              <span>Prediction</span>

              <strong>
                {formatValue(
                  prediction
                )}
              </strong>
            </div>
          )}

          {confidence !== null && (
            <div>
              <span>Confidence</span>

              <strong>
                {formatConfidence(
                  confidence
                )}
              </strong>
            </div>
          )}

          {sentiment !== null && (
            <div>
              <span>
                News sentiment
              </span>

              <strong className="up">
                {formatValue(
                  sentiment
                )}
              </strong>
            </div>
          )}

        </div>
      )}

      {/* =================================================
          EXPLAINABILITY
         ================================================= */}

      {factors && (
        <div className="why-section">

          <div className="section-title">
            <div>
              <span className="eyebrow">
                EXPLAINABILITY
              </span>

              <h3>
                Why this prediction?
              </h3>
            </div>
          </div>

          <div className="factor-grid">

            {Array.isArray(factors) ? (
              factors.map(
                (
                  factor: any,
                  index: number
                ) => (
                  <FactorCard
                    key={index}
                    factor={factor}
                    index={index}
                  />
                )
              )
            ) : (
              <div className="factor-card">
                <strong>
                  Key factors
                </strong>

                <MarkdownContent>
                  {formatValue(
                    factors
                  )}
                </MarkdownContent>
              </div>
            )}

          </div>

        </div>
      )}

      {/* =================================================
          FALLBACK
         ================================================= */}

      {!prediction &&
        !confidence &&
        !sentiment &&
        !explanation &&
        !factors && (
          <div
            style={{
              marginTop: '24px',
            }}
          >
            <span className="eyebrow">
              MODEL RESPONSE
            </span>

            <pre
              style={{
                marginTop: '12px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'inherit',
                lineHeight: 1.6,
              }}
            >
              {JSON.stringify(
                response,
                null,
                2
              )}
            </pre>
          </div>
        )}

      <p className="disclaimer">
        FinMamba AI provides model-generated insights
        for informational and research purposes only
        and does not constitute financial advice.
      </p>
    </div>
  )
}

/* =========================================================
   ASSISTANT CONTENT
   ========================================================= */

function AssistantContent() {
  const [query, setQuery] =
    useState('')

  const [submitted, setSubmitted] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [response, setResponse] =
    useState<unknown>(null)

  const [error, setError] =
    useState('')

  const submit = async (
    value = query
  ) => {
    const trimmedQuestion =
      value.trim()

    if (
      !trimmedQuestion ||
      loading
    ) {
      return
    }

    setQuery(trimmedQuestion)
    setSubmitted(true)
    setLoading(true)
    setResponse(null)
    setError('')

    try {
      const apiUrl =
        process.env
          .NEXT_PUBLIC_FINMAMBA_API

      if (!apiUrl) {
        throw new Error(
          'FinMamba API URL is not configured.'
        )
      }

      const res = await fetch(
        `${apiUrl}/predict`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            question:
              trimmedQuestion,
          }),
        }
      )

      if (!res.ok) {
        let errorMessage =
          `API request failed: ${res.status}`

        try {
          const errorData =
            await res.json()

          if (
            errorData?.detail
          ) {
            errorMessage =
              errorData.detail
          } else if (
            errorData?.message
          ) {
            errorMessage =
              errorData.message
          }
        } catch {
          // Keep default error
        }

        throw new Error(
          errorMessage
        )
      }

      const data =
        await res.json()

      console.log(
        'FinMamba API response:',
        data
      )

      setResponse(data)

    } catch (err) {
      console.error(
        'FinMamba API error:',
        err
      )

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to connect to FinMamba API.'
      )

    } finally {
      setLoading(false)
    }
  }

  const startNewAnalysis =
    () => {
      setQuery('')
      setSubmitted(false)
      setLoading(false)
      setResponse(null)
      setError('')
    }

  return (
    <div className="assistant-content">
      <div className="assistant-width">

        {!submitted && (
          <div className="assistant-intro">

            <div className="ai-symbol">
              <Sparkles size={20} />
            </div>

            <h2>
              Ask a better question
              <br />
              <em>
                about the market.
              </em>
            </h2>

            <p>
              Ask about a supported
              stock and FinMamba will
              generate an explainable
              prediction.
            </p>

          </div>
        )}

        {submitted && (
          <div className="conversation">

            <div className="user-message">

              <div className="avatar">
                JD
              </div>

              <p>
                {query}
              </p>

            </div>

            {loading && (
              <AnalysisLoader />
            )}

            {!loading &&
              error && (
                <div className="analysis-loader">

                  <div className="loader-head">

                    <div className="loader-spinner">
                      <X size={16} />
                    </div>

                    <div>
                      <strong>
                        Unable to analyze
                        the question
                      </strong>

                      <span>
                        {error}
                      </span>
                    </div>

                  </div>

                  <button
                    className="text-button"
                    onClick={() =>
                      submit(query)
                    }
                  >
                    Try again
                    <ArrowRight
                      size={16}
                    />
                  </button>

                </div>
              )}

            {!loading &&
              !error &&
              response !== null && (
                <ResultPanel
                  response={
                    response
                  }
                />
              )}

          </div>
        )}

        <QuestionComposer
          value={query}
          setValue={setQuery}
          onSubmit={submit}
          submitted={submitted}
          loading={loading}
        />

        {!submitted && (
          <div className="suggestions">

            <span>
              TRY ASKING
            </span>

            {questions.map(
              (question) => (
                <button
                  key={question}
                  onClick={() =>
                    submit(
                      question
                    )
                  }
                >
                  {question}

                  <ArrowUpRight
                    size={14}
                  />
                </button>
              )
            )}

          </div>
        )}

        {submitted &&
          !loading && (
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'center',
                marginTop: '24px',
              }}
            >
              <button
                className="text-button"
                onClick={
                  startNewAnalysis
                }
              >
                Start a new analysis

                <ArrowRight
                  size={16}
                />
              </button>
            </div>
          )}

      </div>
    </div>
  )
}

/* =========================================================
   PAGE
   ========================================================= */

export default function AssistantPage() {
  const [
    collapsed,
    setCollapsed,
  ] = useState(false)

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false)

  return (
    <div className="app-shell">

      <div
        className={`mobile-overlay ${
          mobileOpen
            ? 'show'
            : ''
        }`}
        onClick={() =>
          setMobileOpen(false)
        }
      />

      <div
        className={`mobile-sidebar ${
          mobileOpen
            ? 'show'
            : ''
        }`}
      >
        <Sidebar
          collapsed={false}
          setCollapsed={() =>
            setMobileOpen(false)
          }
        />
      </div>

      <Sidebar
        collapsed={
          collapsed
        }
        setCollapsed={
          setCollapsed
        }
      />

      <main className="workspace">

        <header className="workspace-head">

          <button
            className="mobile-trigger"
            onClick={() =>
              setMobileOpen(true)
            }
          >
            <Menu size={19} />
          </button>

          <div>
            <span className="eyebrow">
              FINMAMBA ASSISTANT
            </span>

            <h1>
              What would you like
              to know?
            </h1>
          </div>

          <div className="workspace-tools">

            <button className="icon-button">
              <Search size={17} />
            </button>

            <div className="avatar">
              JD
            </div>

          </div>

        </header>

        <AssistantContent />

      </main>

    </div>
  )
}