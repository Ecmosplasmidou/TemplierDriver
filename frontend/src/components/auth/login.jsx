import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Login.module.css";
import Header from "../Header";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import des icônes

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/grades");
    } catch (err) {
      console.error("CODE ERREUR:", err.code);
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Identifiants incorrects (vérifiez l'email ou le mot de passe).");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Cet email possède déjà un compte.");
      } else if (err.code === 'auth/weak-password') {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
      } else {
        setError("Erreur : " + err.code);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setShowPassword(false);
  };

  return (
    <>
      <Header />
      <div className={styles.loginPage}>
        <div className={styles.loginContainer}>
          <div className={styles.formBox}>
            <span className={styles.subtitle}>L'accès à l'ordre</span>
            <h2 className={styles.title}>
              {isRegister ? "Rejoindre" : "Se Connecter"}
            </h2>
            
            <form onSubmit={handleAuth} className={styles.form}>
              <div className={styles.inputGroup}>
                <input 
                  type="email" 
                  placeholder="Email de commande" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  autoComplete="email"
                />
              </div>

              <div className={styles.inputGroup}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Mot de passe" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  className={styles.passwordInput}
                />
                <button 
                  type="button" 
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {error && (
                <div className={styles.error}>
                  {error}
                </div>
              )}
              
              <button 
                type="submit" 
                className={styles.submitBtn} 
                disabled={isLoading}
              >
                {isLoading 
                  ? "Connexion..." 
                  : (isRegister ? "Créer un compte" : "Entrer dans l'ordre")
                }
              </button>
            </form>
            <p className={styles.toggleText}>
              {isRegister ? "Déjà membre ?" : "Pas encore inscrit ?"}
              <span onClick={toggleMode}>
                {isRegister ? " Se connecter" : " Créer un compte"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;