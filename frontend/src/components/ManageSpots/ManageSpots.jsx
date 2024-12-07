import { useDispatch, useSelector } from 'react-redux';
import './ManageSpots.css';
import { useEffect, useState, useRef } from 'react';
import * as spotActions from '../../store/spots';
import { FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';

export default function ManageSpots() {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(spotActions.getCurrentUserSpots())
    }, [dispatch]);

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

    const spots = useSelector(state=>state.spots.userSpots);
    const spotArr = Object.values({...spots});
    
    return (
        <div className='manage-current-spots'>
        <h1>Manage Your Spots</h1>
        <button onClick={() => navigate('/spots/new')}>Create a New Spot</button>
        <div className='spot-tiles'>
            {spotArr && spotArr.map(spot=>(
                <div className='spot-container' key={spot.id}>
                    <div className='preview-img'>
                        <img src={spot.previewImage} height='300px' width='300px' />
                    </div>
                    <div className='spot-info'>
                        <span>{`${spot.city}, ${spot.state}`}</span>
                        <span className="rating"><FaStar />{spot.avgRating ? spot.avgRating : "New"}</span>
                    </div>
                    <div>
                        <span className="price"><b>${spot.price}</b>/night</span>
                    </div>
                    <div className='buttons'>
                        <button 
                        className='update'
                        onClick={()=>navigate(`/spots/${spot.id}/edit`)}
                        >Update</button>
                        <button 
                        className='delete'
                        onClick={toggleMenu}
                        ><OpenModalMenuItem 
                        itemText="Delete"
                        onItemClick={closeMenu}
                        modalComponent={<DeleteSpotModal navigate={navigate} spotId={spot.id} />} 
                        /></button>
                    </div>
                </div>
            ))}
        </div>
        </div>
    );
}