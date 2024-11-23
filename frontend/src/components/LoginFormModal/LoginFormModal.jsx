// frontend/src/components/LoginFormPage/LoginFormPage.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './LoginForm.css';

export default function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(
        sessionActions.login({ 
            credential, 
            password 
        }))
        .then(closeModal)
        .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors)
        }
      }
    );
  };


  return (
    <>
      <div className='login-modal'>
        <h1>Log in</h1>
        <form onSubmit={handleSubmit}>
          <div className='form-content'>
              <input
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                placeholder='Username or Email'
                required
              />
          </div>
          {errors.credential && <p>{errors.credential}</p>}
          <div className='password'>
              <input
                type="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                required
              />
          </div>
          {errors.password && <p>{errors.password}</p>}
          <button 
          type="submit" 
          className='login-button'
          disabled={errors.length}
          >Log In</button>
        </form>
      </div>
    </>
  );
}