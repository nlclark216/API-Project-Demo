import { useDispatch, useSelector } from "react-redux";
import * as spotActions from '../../store/spots';
import { useEffect } from "react";
import './Spots.css';
import { Link } from "react-router-dom";

export default function AllSpots() {
    const { fetchSpots } = spotActions;
    const dispatch = useDispatch();

    const spots = useSelector(state=>state.spots.allSpots);
    const spotArr = Object.values(spots);

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch, fetchSpots]);

    const SpotTiles = () => {
        return (
            <>
                <ul className="spot-tiles">
                    {spotArr.map(s => (
                        <>
                            <Link to={`spots/${s.id}`} className="spot-tile">
                                <div className="preview-img">
                                <li><img placeholder={s.previewImage}/></li> 
                                </div>
                                {/* <div className="tooltip">{s.name}</div> */}
                                <div className="spot-info">
                                    <li>{`${s.city}, ${s.state}`}</li>    
                                    <li>{s.avgRating}</li>
                                </div>
                                <div className="price">
                                    <li><b>${s.price}</b>/night</li>
                                </div>
                            </Link>
                            
                        </>
                    ))}
                </ul>
            </>   
        )
    }
    

    return(
        <>
        <SpotTiles />
        </>
    )
}