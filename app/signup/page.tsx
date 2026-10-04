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
      <p className="eyebrow">EXPLAINABLE MARKET INTELLIGENCE</p>
    </div>
  )
}

export default function SignupPage() {
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

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Something went wrong')
        setLoading(false)
        return
      }

      // Account created successfully
      window.location.href = '/login'
    } catch (error) {
      console.error('Signup error:', error)

      setError(
        'Unable to create account. Please try again.'
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
            <span className="eyebrow">GET STARTED</span>

            <h1>Create your FinMamba account.</h1>

            <p>
              Start exploring explainable AI-powered stock insights.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              Full name

              <input
                required
                name="name"
                placeholder="Jordan Davis"
              />
            </label>

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

            <div className="strength">
              <span>Password strength</span>
              <i />
              <i />
              <i />
              <small>Use 8+ characters</small>
            </div>

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
                ? 'Creating account...'
                : 'Create account'}

              <ArrowRight size={16} />
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link href="/login">
              Sign in
            </Link>
          </p>

          <p className="auth-disclaimer">
            By continuing, you acknowledge that FinMamba provides
            informational insights, not financial advice.
          </p>
        </div>
      </div>
    </main>
  )
}