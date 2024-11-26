import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from '../../store/session';
import './DemoUser.css'

export default function DemoUser() {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleClick = () => {
        return dispatch(
            sessionActions.login({
                credential: 'Demo-lition',
                password: 'password'
            }))
            .then(closeModal);
    };
    
    return(
       <button
       type="submit"
       onClick={handleClick}
       className="demo-user">Demo User</button>
    );
}