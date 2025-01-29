import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from '../../store/spots';
import { FaStar } from "react-icons/fa";
import './Spots.css';
import { Tooltip } from 'react-tooltip';
import StateAbbObj from "../StateAbbr/StateAbbr";

import { Link } from "react-router-dom";

export default function AllSpots() {
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(spotActions.loadAllSpots());
    }, [dispatch]);

    const spots = useSelector(state=>state.spots.allSpots);
    let spotArr;

    if(spots){spotArr = Object.values({...spots});}
    
    return(
        <div className="container">
        <div className="spot-tiles">
        {spotArr && spotArr.map(spot=>(
            <div
             key={spot?.id}
             className="tile"
             data-tooltip-class-name="img-info"
             data-tooltip-id="tooltip"
             data-tooltip-float={true}
             data-tooltip-place="bottom"
             data-tooltip-content={spot?.name}
             >
                <Link to={`/spots/${spot?.id}`} >
                    <div className="preview-img">
                        <Tooltip id="tooltip" followCursor/>
                            <img src={spot?.previewImage} height='300px' width='300px' alt='Preview image of location' />
                    </div>
                    <div className="spot-info">
                        <span>{spot?.city}, <StateAbbObj state={spot?.state} /></span>
                        <span className="rating"><FaStar className="star" id="home" />{spot?.avgRating ? spot?.avgRating.toFixed(1) : "New"}</span>
                    </div>
                    <div>
                        <span className="price"><b>${spot?.price}</b>night</span>
                    </div>
                </Link>
            </div>
            ))} 
        </div>
        </div>   
    );  
}