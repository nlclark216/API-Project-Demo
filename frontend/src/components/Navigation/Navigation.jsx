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
      <div className='nav-contents'>
        <NavLink 
        to="/"
        className='home'
        ><SiAirbnb className='home-link'/>demobnb</NavLink>
        {isLoaded && (
        <ProfileButton className='profile' user={sessionUser} />
        )}
      </div>
    </nav>
  );
}

export default Navigation;