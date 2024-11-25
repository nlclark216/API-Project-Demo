// frontend/src/components/LoginFormPage/LoginFormPage.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import DemoUser from '../DemoUserLink/DemoUser';
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
        if(data?.message) setErrors(data)
      }
    );
  };

  return (
    <>
      <div className='login-modal'>
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
          {errors.message && <p>The provided credentials were invalid.</p>}
          <label>
            <input
              type="text"
              placeholder='Username or Email'
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
          <label>
            <input
              type="password"
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button 
          type="submit"
          className='login-button'
          disabled={credential.length < 4 || password.length < 6}
          >Log In</button>
        </form>
        {<DemoUser />}
      </div> 
    </>
  );
}