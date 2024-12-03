import { useDispatch, useSelector } from "react-redux";
import * as spotActions from '../../store/spots';
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import './Spots.css';


export default function AllSpots() {
    const dispatch = useDispatch();
   
    dispatch(spotActions.fetchSpots());
    

    let spots = JSON.parse(localStorage.getItem('spots'));
    let spotsAlt = useSelector(state=>state.spots.allSpots);

    if(spots) {
       let spotArr = spots.Spots || Object.values(spotsAlt); 

  
    return(

        <div className="container">
            <div className="spot-tiles">
            {spots && spotArr.map(spot=>(
                    <div key={spot.id} className="spot-tile">
                        <Link to={`spots/${spot.id}`} >
                            <div className="preview-img">
                                <img src={spot.previewImg} />
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
}