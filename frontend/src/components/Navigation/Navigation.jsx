// frontend/src/components/Navigation/Navigation.jsx
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import { SiAirbnb } from "react-icons/si";
import { useModal } from '../../context/Modal';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const { closeModal } = useModal();

  return (
    <nav className='navigation-bar'>
        <ul>
            <li className='home'>
                <NavLink 
                to="/"
                className='home'
                onClick={closeModal}
                >
                  <SiAirbnb className='home-link'/>
                  demobnb</NavLink>
            </li>
            <ul className='disappearing-link'>
              {sessionUser && <Link className='create-spot-link' to='spots/new'>Create a New Spot</Link>}
              {isLoaded && (
              <li className='profile'>
              <ProfileButton user={sessionUser} />
              </li>
              )}
            </ul>
            
        </ul> 
    </nav>
  );
}

export default Navigation;