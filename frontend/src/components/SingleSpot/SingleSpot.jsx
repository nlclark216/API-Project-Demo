import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './SingleSpot.css';

export default function SingleSpot() {
    const dispatch = useDispatch();

    const {id} = useParams();

    const spot = useSelector(state=>{
        const spots = state.spots.allSpots;
        return spots.find(spot=>spot.id===id)
    });

    console.log(spot)
    return (
        <>
            <h2>SingleSpot</h2>
        </>
    );
}