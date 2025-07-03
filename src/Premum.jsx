import React, { useState } from "react";
import "./Premum.css";

const PREMIUM_OPTIONS = [
  { label: "3 oy", months: 3, priceUSD: 8 },
  { label: "6 oy", months: 6, priceUSD: 15 },
  { label: "12 oy", months: 12, priceUSD: 28 }
];

export default function Premum() {
  const [username, setUsername] = useState("");
  const [selected, setSelected] = useState(PREMIUM_OPTIONS[0]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Telegram Premium olish uchun soxta payment trigger (demo uchun)
  const handleBuy = async () => {
    setError("");
    if (!username || username.length < 3) {
      setError("Iltimos, to'g'ri Telegram username kiriting.");
      return;
    }
    setLoading(true);
    // Bu yerda real payment yoki so‘rov bo‘lishi mumkin
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1300);
  };

  return (
    <div className="premum-page">
      <header className="premum-header">
        <div className="brand-logo">Stars Paymee</div>
        <div className="premum-title">
          <span role="img" aria-label="star">⭐</span> Telegram Premium olish
        </div>
      </header>

      <main className="premum-content">
        <div className="premum-card">
          <label htmlFor="username" className="premum-label">Telegram username:</label>
          <input
            id="username"
            className="premum-input"
            type="text"
            placeholder="username"
            value={username}
            onChange={e => setUsername(e.target.value.replace(/^@/, ""))}
            disabled={success}
          />

          <div className="premum-subtitle">
            Premum muddatini tanlang:
          </div>
          <div className="premum-options">
            {PREMIUM_OPTIONS.map(option => (
              <button
                key={option.months}
                className={`premum-opt-btn${selected.months === option.months ? " selected" : ""}`}
                onClick={() => setSelected(option)}
                disabled={success}
              >
                {option.label} &mdash; <b>${option.priceUSD}</b>
              </button>
            ))}
          </div>

          {error && <div className="premum-error">{error}</div>}

          <button
            className="premum-buy-btn"
            onClick={handleBuy}
            disabled={loading || success}
          >
            {loading ? "Yuklanmoqda..." : success ? "Premium olindi!" : "Telegram Premium olish"}
          </button>

          {success && (
            <div className="premum-success">
              <div className="star-anim">&#11088;</div>
              <div className="success-text">
                @{username} uchun <b>{selected.label}</b> Telegram Premium muvaffaqiyatli tanlandi!
              </div>
            </div>
          )}
        </div>
      </main>

      <footer>
        <p>
          &copy; 2025 <b>StarsPaymee</b> All rights reserved
        </p>
      </footer>
    </div>
  );
}