import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import TonIcon from './assets/ton_logo_light_background.svg';

function Home() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(50);
  const [tonPrice, setTonPrice] = useState(null);

  const starOptions = [
    50, 75, 100, 150, 250, 300, 500, 750,
    1000, 1500, 2500, 5000, 10000, 25000, 50000, 100000
  ];

  useEffect(() => {
    // Telegram Mini App aniqlash (agar kerak bo‘lsa)
    if (window.Telegram && window.Telegram.WebApp) {
      // window.Telegram.WebApp.expand();
      // window.Telegram.WebApp.ready();
    }
    async function fetchTonPrice() {
      try {
        const res = await fetch("https://tradingpro.uz/ton_price");
        const data = await res.json();
        if (data.price) setTonPrice(data.price);
      } catch (err) {
        console.error("TON narxini olishda xatolik:", err);
      }
    }
    fetchTonPrice();
  }, []);

  // 1 star narxi USD'da
  const STAR_PRICE_USD = 0.015;
  const SERVICE_FEE_TON = 1.06;

  const calculateTonPrice = (stars) => {
    if (!tonPrice) return "...";
    const usdTotal = stars * STAR_PRICE_USD;
    const tonAmount = (usdTotal / tonPrice) * SERVICE_FEE_TON;
    return tonAmount.toFixed(2);
  };

  const handleUsernameChange = async (e) => {
    const value = e.target.value;
    setUsername(value);

    if (value.length >= 3) {
      try {
        const response = await fetch("https://tradingpro.uz/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: value, quantity: "50" })
        });
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        if (data.found) {
          const photoHTML = data.found.photo || "";
          const name = data.found.name || "Ism topilmadi";
          const match = photoHTML.match(/src="([^"]+)"/);
          if (match) {
            setImageUrl(match[1]);
            setFullName(name);
            setError(null);
          } else {
            setImageUrl(null);
            setFullName(null);
            setError("Rasm topilmadi");
          }
        } else {
          setImageUrl(null);
          setFullName(null);
          setError("Foydalanuvchi topilmadi");
        }
      } catch (err) {
        setError("API xatolik: " + err.message);
        setImageUrl(null);
        setFullName(null);
      }
    } else {
      setImageUrl(null);
      setFullName(null);
      setError(null);
    }
  };

  const Paymentgo = () => {
    if (!username || count < 50) {
      alert("Iltimos, username va stars sonini to‘g‘ri kiriting! minumum 50ta");
      return;
    }
    navigate("/payment", {
      state: { username, quantity: count, tonPrice, SERVICE_FEE_TON, STAR_PRICE_USD }
    });
  };

  const goToPremum = () => {
    navigate("/premum");
  };

  return (
    <div className="page-container">
      <header>
        <div className="brand-logo">
          Stars Paymee
          <button className="premum-nav" onClick={goToPremum}>Premum olish</button>
          <button
            onClick={() => window.open("https://t.me/StarsPaymee_bot", "_blank")}
            className="button"
            style={{ "--clr": "#00ad54" }}
          >
            <span className="button-decor"></span>
            <div className="button-content">
              <div className="button__icon">
                <img src={TonIcon} alt="TON" style={{ width: 24, height: 24 }} />
              </div>
              <span className="button__text">Botni ko'rish</span>
            </div>
          </button>
        </div>
      </header>

      <main className="content-area">
        {imageUrl && (
          <div className="profile-preview">
            <img src={imageUrl} alt="Profil rasmi" className="profile-img" />
            <div className="name">{fullName}</div>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        <label htmlFor="username">Telegram username:</label>
        <input
          type="text"
          id="username"
          placeholder="Enter username"
          value={username}
          onChange={handleUsernameChange}
        />

        <label htmlFor="stars">Nechta stars?</label>
        <input
          type="number"
          id="stars"
          placeholder="Nechta stars?"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />

        <div className="star-buttons">
          {starOptions.map((val) => (
            <button
              key={val}
              className={`narx-button ${count === val ? "selected" : ""}`}
              onClick={() => setCount(val)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%"
              }}
            >
              <span>⭐ {val.toLocaleString("en-US")} Stars</span>
              <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                {tonPrice ? (
                  <>
                    {`${calculateTonPrice(val)} `}
                    <img src={TonIcon} alt="TON" style={{ width: 24, height: 24 }} />
                  </>
                ) : (
                  "yuklanmoqda..."
                )}
              </span>
            </button>
          ))}
        </div>
      </main>

      <div className="end-button">
        <button onClick={Paymentgo} className="main-narx-button">
          ⭐ {count.toLocaleString("en-US")} Stars olish
        </button>
      </div>
      <footer>
        <p>
          &copy; 2025 <b>StarsPaymee</b> All rights reserved
        </p>
      </footer>
    </div>
  );
}

export default Home;