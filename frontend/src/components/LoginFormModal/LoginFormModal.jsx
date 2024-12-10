// frontend/src/components/LoginFormPage/LoginFormPage.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import DemoUser from '../DemoUserLink/DemoUser';
import * as sessionActions from '../../store/session';
import './LoginForm.css';

export default function LoginFormModal({ navigate }) {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ 
          credential, 
          password 
      })).then(closeModal).catch(async (res) => {
        const data = await res.json();
        if(data?.message) setErrors(data);
      }).then(navigate('/'));
  };

  return (
    <>
      <div className='login-modal'>
        <h4>Log In</h4>
        <form onSubmit={handleSubmit}>
          <div className='signup-modal-inputs'>
          {errors.message && <h5>{'The provided credentials were invalid'}</h5>}
          <input id='top'
              type="text"
              placeholder='Username or Email'
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
            <input id='bottom'
              type="password"
              autoComplete='current-password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        
          <button 
          type="submit"
          className='login-button'
          aria-label='Login'
          disabled={credential.length < 4 || password.length < 6}
          >Log In</button>
        </form>
        {<DemoUser navigate={navigate}/>}
      </div> 
    </>
  );
}