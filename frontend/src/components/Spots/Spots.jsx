import { useDispatch, useSelector } from "react-redux";
import * as spotActions from '../../store/spots';
import { useEffect } from "react";
import './Spots.css';

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
                <h1>SpotTile</h1>
                <ul className="spot-tiles">
                    {spotArr.map(s => (
                        <>
                            <div className="spot-tile">
                                <div className="preview-img">
                                <li><img placeholder={s.previewImage}/></li> 
                                </div>
                                <div className="spot-info">
                                    <li>{`${s.city}, ${s.state}`}</li>    
                                    <li>{s.avgRating}</li>
                                </div>
                                <div className="price">
                                    <li><b>${s.price}</b>/night</li>
                                </div>
                            </div>
                            
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