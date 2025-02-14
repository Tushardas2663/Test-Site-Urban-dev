import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const styles = {
    homeContainer: {
      margin: 0,
      padding: 0,
      fontFamily: "'Poppins', sans-serif",
      background: "linear-gradient(to right, #7002e5, rgb(172, 172, 243))",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      textAlign: "center",
      color: "white",
    },
    container: {
      background: "rgba(255, 255, 255, 0.1)",
      padding: "50px",
      borderRadius: "15px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      backdropFilter: "blur(10px)",
    },
    heading: {
      fontSize: "3em",
      marginBottom: "10px",
    },
    paragraph: {
      fontSize: "1.5em",
      fontWeight: "300",
    },
    ctaButton: {
      display: "inline-block",
      marginTop: "20px",
      padding: "12px 24px",
      backgroundColor: "#ff7eb3",
      color: "white",
      textDecoration: "none",
      borderRadius: "30px",
      fontSize: "1.2em",
      transition: "0.3s",
    },
    ctaButtonHover: {
      backgroundColor: "#ff5c8a",
      transform: "scale(1.1)",
    },
  };

  return (
    <div style={styles.homeContainer}>
      <div style={styles.container}>
        <h1 style={styles.heading}>eduVATE</h1>
        <p style={styles.paragraph}><em>Educate and Elevate</em></p>
        <p style={styles.paragraph}>Join a community where learners compete and grow together.</p>
        <Link 
          to="/login" 
          style={styles.ctaButton} 
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.ctaButtonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.ctaButton.backgroundColor)}
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;
