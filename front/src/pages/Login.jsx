import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "../login.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import FontAwesome

const Login = () => {
  const { login, register } = useContext(AuthContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For Sign-Up
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSignUp) {
      await register(email, password);
      alert("Account created! Please sign in.");
      setIsSignUp(false); // Switch to Sign-In mode
    } else {
      await login(email, password);
      navigate("/main");
    }
  };

  return (
    <div className={styles.container + " " + (isSignUp ? styles["right-panel-active"] : "")} id="container">
      {/* Sign-Up Form */}
      <div className={styles["form-container"] + " " + styles["sign-up-container"]}>
        <form onSubmit={handleSubmit}>
          <h1>Create Account</h1>
          <div className={styles["social-container"]}>
            <a href="#" className={styles.social}><i className="fab fa-facebook-f"></i></a>
            <a href="#" className={styles.social}><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className={styles.social}><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Sign-In Form */}
      <div className={styles["form-container"] + " " + styles["sign-in-container"]}>
        <form onSubmit={handleSubmit}>
          <h1>Sign in</h1>
          <div className={styles["social-container"]}>
            <a href="#" className={styles.social}><i className="fab fa-facebook-f"></i></a>
            <a href="#" className={styles.social}><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className={styles.social}><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your account</span>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <a href="#">Forgot your password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>

      {/* Overlay */}
      <div className={styles["overlay-container"]}>
        <div className={styles.overlay}>
          <div className={styles["overlay-panel"] + " " + styles["overlay-left"]}>
            <h1>Welcome Back!</h1>
            <p>To Educate you! To Elevate you!</p>
            <button className={styles.ghost} onClick={() => setIsSignUp(false)}>Sign In</button>
          </div>
          <div className={styles["overlay-panel"] + " " + styles["overlay-right"]}>
            <h1>Hello, Learner!</h1>
            <p>Welcome to the new world of learning</p>
            <button className={styles.ghost} onClick={() => setIsSignUp(true)}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
