import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../store/spots";
import { useEffect } from "react";
import './Spots.css';
import { Link } from "react-router-dom";

export default function AllSpots() {
    const dispatch = useDispatch();

    const spots = useSelector(state=>state.spots.allSpots);
    const spotArr = Object.values(spots);

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);

    const SpotTiles = () => {
        return (
            <>
            <ul key={spotArr.id} className="spot-tiles">
                {spotArr.map(s => (
                    <div key={s.id}>
                        <Link to={`spots/${s.id}`} className="spot-tile">
                            <div className="preview-img">
                            <li key={s.previewImage}><img placeholder={s.previewImage}/></li> 
                            </div>
                            {/* <div className="tooltip">{s.name}</div> */}
                            <div className="spot-info">
                                <li>{`${s.city}, ${s.state}`}</li>    
                                <li>{s.avgRating}</li>
                            </div>
                            <div className="price">
                                <li key={s.price}><b>${s.price}</b>/night</li>
                            </div>
                        </Link>
                        
                    </div>
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