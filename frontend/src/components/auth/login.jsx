import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Login.module.css";
import Header from "../Header";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      
      // Firebase a changé certains codes : 'auth/user-not-found' devient souvent 'auth/invalid-credential'
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Identifiants incorrects (vérifiez l'email ou le mot de passe).");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Cet email possède déjà un compte.");
      } else if (err.code === 'auth/weak-password') {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
      } else if (err.code === 'auth/operation-not-allowed') {
        setError("L'inscription par email n'est pas encore activée dans la console Firebase.");
      } else {
        setError("Erreur : " + err.code); // Affiche le code brut pour débugger
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Switcher entre login et register nettoie l'erreur
  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
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
                  type="password" 
                  placeholder="Mot de passe" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  autoComplete={isRegister ? "new-password" : "current-password"}
                />
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