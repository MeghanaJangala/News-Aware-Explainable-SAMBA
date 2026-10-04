'use client'

import Link from 'next/link'
import {
  ArrowUpRight,
  ChevronRight,
  Plus,
  FileText,
} from 'lucide-react'

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

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="side-head">
        <Mark />

        <Link href="/assistant">
          <ChevronRight size={17} />
        </Link>
      </div>

      <Link href="/assistant" className="new-analysis">
        <Plus size={16} />
        <span>New analysis</span>
      </Link>

      <div className="side-nav">
        <p>Workspace</p>

        <Link href="/assistant">
          <span>Assistant</span>
        </Link>

        <Link href="/history">
          <FileText size={17} />
          <span>History</span>
        </Link>

        <Link href="/watchlist">
          <span>Watchlist</span>
        </Link>

        <Link href="/settings">
          <span>Settings</span>
        </Link>
      </div>

      <div className="profile">
        <div className="avatar">JD</div>

        <div className="profile-text">
          <strong>Jordan Davis</strong>
          <span>Personal workspace</span>
        </div>
      </div>
    </aside>
  )
}

function HistoryItem({
  ticker,
  title,
  confidence,
  time,
}: {
  ticker: string
  title: string
  confidence: string
  time: string
}) {
  return (
    <Link
      href="/assistant"
      className="history-item"
    >
      <div className="ticker-box">{ticker}</div>

      <div className="history-copy">
        <strong>{title}</strong>
        <span>{time}</span>
      </div>

      <div className="history-result">
        <span className="badge positive">
          <ArrowUpRight size={13} />
          Bullish
        </span>

        <small>{confidence} confidence</small>
      </div>

      <ChevronRight size={17} />
    </Link>
  )
}

export default function HistoryPage() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="workspace">
        <header className="workspace-head">
          <div>
            <span className="eyebrow">
              WORKSPACE
            </span>

            <h1>Analysis history</h1>
          </div>

          <div className="workspace-tools">
            <div className="avatar">JD</div>
          </div>
        </header>

        <div className="page-content">
          <div className="page-toolbar">
            <p>
              Review and reopen your previous model
              analyses.
            </p>

            <Link
              href="/assistant"
              className="button button-sm"
            >
              <Plus size={15} />
              New analysis
            </Link>
          </div>

          <div className="history-list">
            <HistoryItem
              ticker="NVDA"
              title="What is the expected movement of NVIDIA?"
              confidence="82%"
              time="Today · 10:42 AM"
            />

            <HistoryItem
              ticker="AAPL"
              title="Will AAPL move up based on recent news?"
              confidence="76%"
              time="Yesterday · 4:18 PM"
            />

            <HistoryItem
              ticker="TSLA"
              title="What factors are influencing Tesla?"
              confidence="64%"
              time="Mar 24 · 9:12 AM"
            />
          </div>
        </div>
      </main>
    </div>
  )
}