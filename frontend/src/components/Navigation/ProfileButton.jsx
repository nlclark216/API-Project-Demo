import { useState } from "react";
import { useDispatch } from "react-redux";
import { CgProfile } from "react-icons/cg";
import * as sessionActions from '../../store/session';
import './ProfileButton.css';


export default function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        if(showMenu === false) setShowMenu(true)
            else setShowMenu(false)
    }

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
          <button onClick={() => toggleMenu()}>
            <CgProfile />
          </button>
          <ul className={ulClassName}>
            <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </ul>
        </>
      );
} 