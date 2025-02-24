import { useDispatch, useSelector } from 'react-redux';
import './ManageSpots.css';
import { useEffect, useState, useRef } from 'react';
import * as spotActions from '../../store/spots';
import { FaStar } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';
import { Tooltip } from 'react-tooltip';
import StateAbbObj from '../StateAbbr/StateAbbr';

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
    <h1>Manage Spots</h1>
    <button
    aria-label='Create a New Spot' 
    onClick={() => navigate('/spots/new')} 
    id='create'
    >Create a New Spot</button>
    <div className='spot-tiles'>
        {spotArr && spotArr.map(spot=>(

        <div 
        className='manage-spot-container' 
        key={spot?.id}
        >
        <Link to={`/spots/${spot?.id}`} className='spot-container'>
            <div 
            className='preview-img'
            data-tooltip-class-name="img-info"
            data-tooltip-id="tooltip"
            data-tooltip-float={true}
            data-tooltip-place="bottom"
            data-tooltip-content={spot?.name}
            >
            <Tooltip id="tooltip" followCursor/>
                <img src={spot?.previewImage} height='300px' width='300px' alt='Preview image of location'/>
            </div>
            <div className='spot-info'>
                <span>{spot?.city}, <StateAbbObj state={spot?.state} /></span>
                <span className="rating"><FaStar className='star' id='home' />{spot?.avgRating ? spot?.avgRating.toFixed(1) : "New"}</span>
            </div>
            <div>
                <span className="price"><b>${spot?.price}</b>night</span>
            </div>
        </Link>
        <div className='buttons'>
                <button
                aria-label='Update' 
                className='update'
                onClick={() => {navigate(`/spots/${+spot?.id}/edit`)}}
                >Update</button>
                <button 
                className='delete'
                aria-label='Delete'
                onClick={toggleMenu}
                ><OpenModalMenuItem 
                itemText="Delete"
                onItemClick={closeMenu}
                modalComponent={<DeleteSpotModal navigate={navigate} spotId={+spot?.id} />} 
                /></button>
        </div>
        
        </div>
        ))}
    </div>
    </div>
    );
}