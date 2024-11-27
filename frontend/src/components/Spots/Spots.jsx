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
            <div key={spotArr.id} className="spot-tiles">
                {spotArr.map(s => (
                <Link to={`spots/${s.id}`} key={s.id} className="spot-tile">
                    <div className="preview-img">
                    <p key={s.previewImage}><img placeholder={s.previewImage}/></p> 
                    </div>
                    {/* <div className="tooltip">{s.name}</div> */}
                    <div className="spot-info">
                        <p key={s.city}>{`${s.city}, ${s.state}`}</p>    
                        <p key={s.avgRating}>{s.avgRating}</p>
                    </div>
                    <div className="price">
                        <p key={s.price}><b>${s.price}</b>/night</p>
                    </div>
                </Link>
                ))}
            </div>
            </>   
        )
    }
    

    return(
        <>
        <SpotTiles />
        </>
    )
}