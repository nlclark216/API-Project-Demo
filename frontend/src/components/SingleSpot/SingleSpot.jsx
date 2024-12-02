import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './SingleSpot.css';

export default function SingleSpot() {
    const dispatch = useDispatch();

    const {id} = useParams();

    const spot = useSelector(state=>{
        const spots = state.spots.allSpots;
    });

    console.log(spot)
    return (
        <>
            <h2>SingleSpot</h2>
        </>
    );
}