import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from '../../store/session';
import './DemoUser.css'


export default function DemoUser({ navigate }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleClick = (e) => {
        e.preventDefault();
       dispatch(
            sessionActions.login({
                credential: 'Demo-lition',
                password: 'password'
            })
        )
        closeModal();
        navigate('/');
    };
    
    return(
       <button
       type="submit"
       onClick={handleClick}
       className="demo-user"
       aria-label="Log in as Demo User"
       >Log in as Demo User</button>
    );
}