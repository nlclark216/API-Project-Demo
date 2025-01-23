import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { IoMdMenu } from "react-icons/io";
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import './ProfileButton.css';
import { Link, useNavigate } from "react-router-dom";


export default function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const navigate = useNavigate();

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
        navigate('/');
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            <button className="nav-button" onClick={toggleMenu} aria-label="Profile Dropdown Menu">
              <IoMdMenu />
              <CgProfile />
            </button>
            <ul className={ulClassName} ref={ulRef}>
              {user ? (
                <>
                  <div className="logged-user">
                    <span>Hello, {user?.firstName}</span>
                    <span>{user?.email}</span>
                    <span className="manage-spots">
                      <Link to='spots/current' onClick={closeMenu} className="manage-link" >Manage Spots</Link>
                    </span>
                    <div className="button-div">
                      <button
                      aria-label="Log Out" 
                      onClick={logout} 
                      className="logout-button"
                      >Log Out</button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                <div className="in-modal">
                  <span className='menu-item'>
                    <OpenModalMenuItem
                    itemText="Log In"
                    onItemClick={closeMenu}
                    modalComponent={<LoginFormModal navigate={navigate} />}
                    />
                  </span>
                  <span className='menu-item'>
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