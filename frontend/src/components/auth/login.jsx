import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import styles from "../../styles/Login.module.css";
import Header from "../Header";
import { FaEye, FaEyeSlash, FaInfoCircle, FaCheckCircle } from "react-icons/fa";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");
    setIsLoading(true);

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        try {
          const response = await axios.post('https://templierdriver-server.onrender.com/api/sync-user', { 
            email: email,
            firstName: email.split('@')[0]
          });
          if (response.data.message === "Client créé sur Shopify") {
            setInfoMessage("Compte créé ! Un email de confirmation Shopify vous a été envoyé pour lier vos achats.");
          } else {
            setInfoMessage("Connexion réussie ! Votre compte est déjà lié à Shopify.");
          }
        } catch (syncErr) {
          console.error("Erreur synchro:", syncErr);
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      const delay = isRegister ? 3000 : 0;
      setTimeout(() => {
        window.location.replace("https://shopify.com/authentication/97061110099/login?client_id=14bc859d-a7cd-428a-a607-15198ea0f343&locale=fr&redirect_uri=%2Fauthentication%2F97061110099%2Foauth%2Fauthorize%3F_cs%3D3.ampS_FROCC_t__2TeKZ8XcRcmg2033VFmssg%26client_id%3D14bc859d-a7cd-428a-a607-15198ea0f343%26locale%3Dfr%26nonce%3Deb3e4471-b55c-429f-9799-c0d0d500f830%26redirect_uri%3Dhttps%253A%252F%252Fshopify.com%252F97061110099%252Faccount%252Fcallback%26region_country%3DFR%26response_type%3Dcode%26scope%3Dopenid%2Bemail%2Bcustomer-account-api%253Afull%26state%3DhWN99SgqFhRrV3MCilYXgonT&region_country=FR");
      }, delay);

    } catch (err) {
      console.error("CODE ERREUR:", err.code);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Identifiants incorrects.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Cet email possède déjà un compte.");
      } else {
        setError("Erreur : " + err.code);
      }
    } finally {
      if (!isRegister) setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setInfoMessage("");
    setShowPassword(false);
  };

  return (
    <>
      <Header />
      <div className={styles.loginPage}>
        <div className={styles.loginContainer}>
          <div className={styles.formBox}>
            <span className={styles.subtitle}>L'accès à l'ordre</span>
            <h2 className={styles.title}>{isRegister ? "Rejoindre" : "Se Connecter"}</h2>
            
            <form onSubmit={handleAuth} className={styles.form}>
              <div className={styles.inputGroup}>
                <input type="email" placeholder="Email de commande" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className={styles.inputGroup}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Mot de passe" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className={styles.passwordInput}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {infoMessage && (
                <div className={styles.infoBox}>
                  <FaCheckCircle className={styles.infoIcon} />
                  <span>{infoMessage}</span>
                </div>
              )}

              {error && <div className={styles.error}>{error}</div>}
              
              <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                {isLoading ? "Traitement..." : (isRegister ? "Créer un compte" : "Entrer dans l'ordre")}
              </button>
            </form>
            <p className={styles.toggleText}>
              {isRegister ? "Déjà membre ?" : "Pas encore inscrit ?"}
              <span onClick={toggleMode}>{isRegister ? " Se connecter" : " Créer un compte"}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;