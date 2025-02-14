import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../mainPage.module.css"; // Scoped CSS
import eduLogo from "../assets/edu-logo.jpg";
import chatbotIcon from "../assets/chatbot-icon.png"; // Add chatbot icon in assets

const MainPage = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [botResponse, setBotResponse] = useState("");

  // Toggle chatbot
  const toggleChatbot = () => {
    setChatOpen(!chatOpen);
    setBotResponse(""); // Reset response when opening new chat
  };

  // Send query to backend
  const sendQuery = async () => {
    if (!userQuery.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery }),
      });

      const data = await response.json();
      setBotResponse(data.response);
      setUserQuery("");
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setBotResponse("Sorry, I couldn't process that. Try again.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <img className={styles.image} src={eduLogo} width="50px" height="50px" alt="eduVATE Logo" />
        <div className={styles.logo}>
          <Link to="/">eduVATE</Link>
        </div>
        <ul className={styles.navLinks}>
          <li><Link to="/mock-tests">Mock Tests</Link></li>
          <li><Link to="/leaderboard">Leaderboard</Link></li>
          <li><Link to="/community">Community</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>

      {/* Sidebar */}
      <div className={styles.left}>
        <Link to="/profile" className={styles.profileLink}>
          <h2 className={styles.strong}>Your Profile</h2>
        </Link>

        {/* Dashboard Button */}
        <div className={styles.dashboardBtnContainer}>
          <Link to="/dashboard" className={styles.dashboardBtn}>Go to Dashboard</Link>
        </div>

        <div className={styles.sub}>
          <Link to="/tests/physics" className={styles.subTest}><h3>Physics</h3></Link>
          <Link to="/tests/chemistry" className={styles.subTest}><h3>Chemistry</h3></Link>
          <Link to="/tests/mathematics" className={styles.subTest}><h3>Mathematics</h3></Link>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.right}>
        <div className={styles.top}>
          <h1>eduVATE</h1>
          <h2 id={styles.m_id1}>A community-driven mock test platform</h2>
          <h2 id={styles.m_id2}>Our motive is to educate you and elevate you</h2>
        </div>

        {/* Test Categories */}
        <div className={styles.mainBox}>
          <div className={styles.cont}>
            <div className={`${styles.b1} ${styles.iit}`}>IIT ADVANCED</div>
            <div className={`${styles.b1} ${styles.jee}`}>JEE MAINS</div>
          </div>
          <div className={styles.cont}>
            <div className={`${styles.b1} ${styles.aims}`}>NEET EXAM</div>
            <div className={`${styles.b1} ${styles.wbjee}`}>WB JEE</div>
          </div>
        </div>

        {/* AI Chatbot */}
        <div className={styles.chatbotContainer}>
          <div className={styles.chatbotIcon} onClick={toggleChatbot}>
            <img src={chatbotIcon} alt="Chatbot" />
          </div>

          {chatOpen && (
            <div className={styles.chatbotWindow}>
              <p className={styles.chatbotText}>I am your personalized doubt support. Ask me any doubt!</p>
              <input
                type="text"
                placeholder="Type your question..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className={styles.chatInput}
              />
              <button onClick={sendQuery} className={styles.chatSendBtn}>Send</button>
              {botResponse && <p className={styles.botResponse}>{botResponse}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
