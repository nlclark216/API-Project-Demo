// frontend/src/components/Navigation/Navigation.jsx
import { Link, NavLink } from 'react-router-dom';
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
                >
                  <SiAirbnb className='home-link'/>
                  demobnb</NavLink>
            </li>
            <div className='disappearing-link'>
              {sessionUser && <Link to='spots/new'>Create a New Spot</Link>}
              {isLoaded && (
              <li className='profile'>
              <ProfileButton user={sessionUser} />
              </li>
              )}
            </div>
            
        </ul> 
    </nav>
  );
}

export default Navigation;