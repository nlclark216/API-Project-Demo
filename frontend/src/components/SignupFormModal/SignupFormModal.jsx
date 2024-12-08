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
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <input 
                        type='text'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                {errors.email && <h5 className='errors'>{errors.email}</h5>}
                <label>
                    <input 
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </label>
                {errors.username && <h5 className='errors'>{errors.username}</h5>}
                <label>
                    <input 
                        type='text'
                        placeholder='First Name'
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        required
                    />
                </label>
                {errors.firstName && <h5 className='errors'>{errors.firstName}</h5>}
                <label>
                    <input 
                        type='text'
                        placeholder='Last Name'
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        required
                    />
                </label>
                {errors.lastName && <h5 className='errors'>{errors.lastName}</h5>}
                <label>
                    <input 
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.password && <h5 className='errors'>{errors.password}</h5>}
                <label>
                    <input 
                        type='password'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.confirmPassword && <h5 className='errors'>{errors.confirmPassword}</h5>}
                <button 
                type='submit'
                disabled={email.length<1 || username.length<1 || firstName.length<1 || lastName.length<1 ||
                    password.length<1 || confirmPassword.length<1 || username.length<4 || password.length<6}
                >Sign Up</button>
            </form> 
            </div>
        </>
    );
}