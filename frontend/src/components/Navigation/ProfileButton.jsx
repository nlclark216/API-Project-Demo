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
            <div className={ulClassName} ref={ulRef}>
              {user ? (
                <>
                  <div className="logged-user">
                    <p>{user.username}</p>
                    <p>{user.firstName} {user.lastName}</p>
                    <p>{user.email}</p>
                    <p>
                      <button onClick={logout}>Log Out</button>
                    </p>
                  </div>
                </>
              ) : (
                <>
                <div className="in-modal">
                  <p>
                    <OpenModalMenuItem
                    itemText="Log In"
                    onItemClick={closeMenu}
                    modalComponent={<LoginFormModal />}
                    />
                  </p>
                  <p>
                    <OpenModalMenuItem
                    itemText="Sign Up"
                    onItemClick={closeMenu}
                    modalComponent={<SignupFormModal />}
                    />
                  </p>
                </div>
                </>
              )}
            </div>
        </>
      );
} 