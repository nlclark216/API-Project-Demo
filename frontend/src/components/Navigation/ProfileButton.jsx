import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { IoMdMenu } from "react-icons/io";
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import './ProfileButton.css';


export default function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const toggleMenu = (e) => {
        e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if(!showMenu) return;

        const closeMenu = (e) => { 
            if(!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu();
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            <button className="nav-button" onClick={toggleMenu}>
              <IoMdMenu />
              <CgProfile />
            </button>
            <ul className={ulClassName} ref={ulRef}>
              {user ? (
                <>
                  <div className="logged-user">
                    <span>{user.username}</span>
                    <span>{user.firstName} {user.lastName}</span>
                    <span>{user.email}</span>
                    <span>
                      <button onClick={logout}>Log Out</button>
                    </span>
                  </div>
                </>
              ) : (
                <>
                <div className="in-modal">
                  <span>
                    <OpenModalMenuItem
                    itemText="Log In"
                    onItemClick={closeMenu}
                    modalComponent={<LoginFormModal />}
                    />
                  </span>
                  <span>
                    <OpenModalMenuItem
                    itemText="Sign Up"
                    onItemClick={closeMenu}
                    modalComponent={<SignupFormModal />}
                    />
                  </span>
                </div>
                </>
              )}
            </ul>
        </>
      );
} 