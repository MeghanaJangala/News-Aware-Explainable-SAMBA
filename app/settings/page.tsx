'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Bell,
  ChevronRight,
  FileText,
  LockKeyhole,
  Moon,
  Plus,
  Settings,
  WalletCards,
} from 'lucide-react'

function SettingRow({
  icon: Icon,
  title,
  text,
  buttonText = 'On',
}: {
  icon: typeof Bell
  title: string
  text: string
  buttonText?: string
}) {
  const [on, setOn] = useState(buttonText === 'On')

  return (
    <div className="setting-row">
      <div className="setting-icon">
        <Icon size={16} />
      </div>

      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>

      <button
        className={
          buttonText === 'On'
            ? `toggle ${on ? 'on' : ''}`
            : 'button button-xs'
        }
        onClick={() =>
          buttonText === 'On'
            ? setOn(!on)
            : undefined
        }
      >
        {buttonText === 'On' && <i />}
        {buttonText !== 'On' && buttonText}
      </button>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="side-head">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <span className="mark">
              <span />
            </span>

            <span className="brand-name">
              FinMamba <b>AI</b>
            </span>
          </Link>

          <ChevronRight size={17} />
        </div>

        <Link
          href="/assistant"
          className="new-analysis"
        >
          <Plus size={16} />
          <span>New analysis</span>
        </Link>

        <div className="side-nav">
          <p>Workspace</p>

          <Link href="/assistant">
            <span>Assistant</span>
          </Link>

          <Link href="/history">
            <span>History</span>
          </Link>

          <Link href="/watchlist">
            <span>Watchlist</span>
          </Link>

          <Link href="/settings">
            <Settings size={17} />
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

      <main className="workspace">
        <header className="workspace-head">
          <div>
            <span className="eyebrow">
              WORKSPACE
            </span>

            <h1>Settings</h1>
          </div>

          <div className="workspace-tools">
            <div className="avatar">JD</div>
          </div>
        </header>

        <div className="page-content settings-page">
          <div className="settings-section">
            <div>
              <span className="eyebrow">
                PROFILE
              </span>

              <h3>Personal details</h3>

              <p>
                Manage the information associated with
                your workspace.
              </p>
            </div>

            <div className="settings-card">
              <label>
                Full name

                <input
                  defaultValue="Jordan Davis"
                />
              </label>

              <label>
                Email address

                <input
                  defaultValue="jordan@finmamba.ai"
                  type="email"
                />
              </label>

              <button className="button button-sm">
                Save changes
              </button>
            </div>
          </div>

          <div className="settings-section">
            <div>
              <span className="eyebrow">
                PREFERENCES
              </span>

              <h3>Notifications</h3>

              <p>
                Choose which signals deserve your
                attention.
              </p>
            </div>

            <div className="settings-card">
              <SettingRow
                icon={Bell}
                title="Prediction alerts"
                text="Get notified when a watchlist prediction changes."
              />

              <SettingRow
                icon={FileText}
                title="News alerts"
                text="Receive a digest of relevant sentiment signals."
              />

              <SettingRow
                icon={Moon}
                title="Dark mode"
                text="Keep the interface focused and easy on the eyes."
              />
            </div>
          </div>

          <div className="settings-section">
            <div>
              <span className="eyebrow">
                SECURITY
              </span>

              <h3>Account security</h3>

              <p>
                Keep your FinMamba account protected.
              </p>
            </div>

            <div className="settings-card">
              <SettingRow
                icon={LockKeyhole}
                title="Change password"
                text="Update your password regularly."
                buttonText="Update"
              />

              <SettingRow
                icon={WalletCards}
                title="Log out of all devices"
                text="End all active sessions."
                buttonText="Log out"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}