import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { auth } from '../firebaseConfig'
import '../styles/Login.css'

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); // Hook para la navegación
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user);
      navigate('/admin');
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Usuario o contraseña incorrectos.');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Enlace de reestablecimiento enviado al correo electrónico');
      setShowResetForm(false); // Ocultar el formulario
    } catch (error) {
      setError(error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
        {showResetForm ? (
          <form onSubmit={handlePasswordReset} className='login-form'>
            <h2>Reestablecer contraseña</h2>
            <div className='form-group'>
              <label htmlFor='reset-email'>Correo electrónico</label>
              <input
                type='email'
                placeholder='correo@ejemplo.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="button-container">  
              <button type="submit">Enviar enlace</button>
              <button type="button" onClick={() => setShowResetForm(false)}>Cancelar</button>
              {error && <p className="error-message">{error}</p>}
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <h2>Iniciar sesión</h2>
            <div className="form-group">
              <label htmlFor="email">Usuario</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            <div className="form-group password-container">
              <label htmlFor="password">Contraseña</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*********"
                required
              />
              <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
            <div className="form-group">
              <a href="#" onClick={() => setShowResetForm(true)} className="forgot-password">Olvidé mi contraseña</a>
            </div>
            <div className="button-container">
                <button type="submit">Ingresar</button>
                {error && <p className="error-message">{error}</p>}
            </div>
          </form>
        )}
      </div>
  );
};

export default Login;