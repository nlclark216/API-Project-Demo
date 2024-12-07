import { useDispatch, useSelector } from 'react-redux';
import './ManageSpots.css';
import { useEffect } from 'react';
import * as spotActions from '../../store/spots';
import { FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function ManageSpots() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(spotActions.getCurrentUserSpots())
    }, [dispatch]);

    const spots = useSelector(state=>state.spots.userSpots);
    const spotArr = Object.values({...spots});
    console.log(spotArr)

    return (
        <>
        <h1>Manage Your Spots</h1>
        <button onClick={() => navigate('/spots/new')}>Create a New Spot</button>
        <div className='spot-tiles'>
            {spotArr && spotArr.map(spot=>(
                <div key={spot.id}>
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
                        <button className='delete'>Delete</button>
                    </div>
                </div>
            ))}
        </div>
        </>
    );
}