import { useDispatch, useSelector } from "react-redux";
import * as spotActions from '../../store/spots';
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import './Spots.css';
import { useEffect } from "react";


export default function AllSpots() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(spotActions.fetchSpots());
    }, [dispatch]);
   
    

    const spots = useSelector(state=>state.spots.allSpots);    
    const spotsAlt = JSON.parse(localStorage.getItem('spots'));
    let spotArr;



    if(Object.keys(spots).length) {
        spotArr = Object.values(spots); 
    } else if (spotsAlt) {
        spotArr = spotsAlt.Spots;
    } else { 
        return (<h3>Loading...please refresh browser...</h3>) 
    }

  
    return(
        <div className="container">
            <div className="spot-tiles">
            {spotArr && spotArr.map(spot=>(
                    <div key={spot.id} className="spot-tile">
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