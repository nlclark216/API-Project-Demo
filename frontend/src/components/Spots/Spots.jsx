import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from '../../store/spots';
import { FaStar } from "react-icons/fa";
import './Spots.css';
import { Tooltip } from 'react-tooltip'

import { Link } from "react-router-dom";

export default function AllSpots() {
    const dispatch = useDispatch();

    const spots = useSelector(state=>state.spots.allSpots);
    let spotArr = Object.values(spots);

    console.log(spotArr)
    

    useEffect(() => {
        dispatch(spotActions.loadAllSpots());
    }, [dispatch]);

    return(
        <div className="container">
        <div className="spot-tiles">
        {spotArr && spotArr.map(spot=>(
            <div
             key={spot.id}
             data-tooltip-class-name="img-info"
             data-tooltip-id="tooltip"
             data-tooltip-float={true}
             data-tooltip-place="bottom"
             data-tooltip-content={spot.name}
             >
                <Link to={`spots/${spot.id}`} >
                    <div className="preview-img">
                        <Tooltip id="tooltip" followCursor></Tooltip>
                            <img src={spot.previewImage} height='300px' width='300px' />
                    </div>
                    <div className="spot-info">
                        <span>{`${spot.city}, ${spot.state}`}</span>
                        <span className="rating"><FaStar />{spot.avgRating}</span>
                    </div>
                    <div>
                        <span className="price"><b>${spot.price}</b>/night</span>
                    </div>
                </Link>
            </div>
            ))} 
        </div>
        </div>   
    );  
}