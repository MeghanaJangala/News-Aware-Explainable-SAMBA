'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Eye,
} from 'lucide-react'

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

function LogoLockup() {
  return (
    <div className="flex flex-col gap-4">
      <Mark />
      <p className="eyebrow">
        EXPLAINABLE MARKET INTELLIGENCE
      </p>
    </div>
  )
}

export default function LoginPage() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed')
        setLoading(false)
        return
      }

      // Login successful
      window.location.href = '/assistant'
    } catch (error) {
      console.error('Login error:', error)

      setError(
        'Unable to sign in. Please try again.'
      )

      setLoading(false)
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <LogoLockup />

          <div className="auth-art">
            <div className="auth-line" />
            <div className="auth-node node-a" />
            <div className="auth-node node-b" />
            <div className="auth-node node-c" />

            <div className="auth-quote">
              “The best decisions
              <br />
              <em>begin with better questions.</em>”
            </div>
          </div>

          <p className="auth-foot">
            FinMamba AI <span>•</span> Explainable market intelligence
          </p>
        </div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-form">
          <Mark />

          <div className="auth-heading">
            <span className="eyebrow">
              WELCOME BACK
            </span>

            <h1>Welcome back.</h1>

            <p>
              Ask about stocks. Understand the signals.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              Email address

              <input
                required
                name="email"
                type="email"
                placeholder="you@example.com"
              />
            </label>

            <label>
              Password

              <div className="password-input">
                <input
                  required
                  name="password"
                  minLength={8}
                  type={show ? 'text' : 'password'}
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label={
                    show
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  <Eye size={16} />
                </button>
              </div>
            </label>

            {error && (
              <p
                className="auth-error"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="button auth-submit"
              disabled={loading}
            >
              {loading
                ? 'Signing in...'
                : 'Sign in'}

              <ArrowRight size={16} />
            </button>
          </form>

          <Link
            href="/login"
            className="forgot"
          >
            Forgot password?
          </Link>

          <p className="auth-switch">
            Don&apos;t have an account?{' '}
            <Link href="/signup">
              Create account
            </Link>
          </p>

          <p className="auth-disclaimer">
            By continuing, you acknowledge that FinMamba
            provides informational insights, not financial
            advice.
          </p>
        </div>
      </div>
    </main>
  )
}