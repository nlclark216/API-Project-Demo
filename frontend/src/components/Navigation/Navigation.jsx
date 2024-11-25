// frontend/src/components/Navigation/Navigation.jsx
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import { SiAirbnb } from "react-icons/si";
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className='navigation-bar'>
        <ul>
            <li>
                <NavLink 
                to="/"
                className='home'
                ><SiAirbnb className='home-link'/>demobnb</NavLink>
            </li>
            {isLoaded && (
            <li className='profile'>
            <ProfileButton user={sessionUser} />
            </li>
            )}
        </ul> 
    </nav>
  );
}

export default Navigation;