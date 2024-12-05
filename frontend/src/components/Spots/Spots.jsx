import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from '../../store/spots';
import { FaStar } from "react-icons/fa";
import './Spots.css';

import { Link } from "react-router-dom";

export default function AllSpots() {
    const dispatch = useDispatch();

    const spots = useSelector(state=>state.spots.allSpots);
    let spotArr = Object.values(spots);

    const [toolTip, setToolTip] = useState(null);
    

    useEffect(() => {
        dispatch(spotActions.loadAllSpots());
    }, [dispatch]);

    return(
        <div className="container">
        <div className="spot-tiles">
        {spotArr && spotArr.map(spot=>(
            <div
             key={spot.id}
             className="tooltip"
             value={toolTip}
             onMouseOut={() => setToolTip(null)}
             onMouseOver={() => setToolTip(spot.id)}
             >
                {toolTip === spot.id && <span id="tooltip">{spot.name}</span>}
                <Link to={`spots/${spot.id}`} >
                    <div className="preview-img">
                        <img src={`../../../images/preview${spot.id}.jpg`} height='300px' width='300px'  />
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