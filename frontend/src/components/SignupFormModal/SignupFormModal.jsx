import { useState } from 'react';
import { useDispatch} from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

export default function SignupFormModal() {
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = e => {
        e.preventDefault();
        if(password === confirmPassword) {
            setErrors({});
            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password
                }))
                .then(closeModal)
                .catch(async res => {
                const data = await res.json();
                if(data?.errors) setErrors(data.errors);
            });
        }
        return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
        });
    };
    return (
        <>
            <div className='signup-modal'>
            <h4>Sign Up</h4>
            <form onSubmit={handleSubmit}>
                <div className='signup-modal-inputs'>
                <input id='top'
                        type='text'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                 {errors.email && <h5 className='errors'>{errors.email}</h5>}

                 <input 
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                {errors.username && <h5 className='errors'>{errors.username}</h5>}
                <input 
                        type='text'
                        placeholder='First Name'
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        required
                    />
                {errors.firstName && <h5 className='errors'>{errors.firstName}</h5>}
                <input 
                        type='text'
                        placeholder='Last Name'
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        required
                    />
                {errors.lastName && <h5 className='errors'>{errors.lastName}</h5>}
                <input 
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                {errors.password && <h5 className='errors'>{errors.password}</h5>}
                <input id='bottom'
                        type='password'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                {errors.confirmPassword && <h5 className='errors'>{errors.confirmPassword}</h5>}
                </div>

                <button 
                type='submit'
                aria-label='Sign Up'
                disabled={email.length<1 || username.length<1 || firstName.length<1 || lastName.length<1 ||
                    password.length<1 || confirmPassword.length<1 || username.length<4 || password.length<6}
                >Sign Up</button>
            </form> 
            </div>
        </>
    );
}