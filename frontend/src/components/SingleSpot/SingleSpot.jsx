import './SingleSpot.css';
import { useSelector } from 'react-redux';

export default function SingleSpot() {
    const spots = useSelector(state.spots.allSpots);

    return (
        <>
            <h2>SingleSpot</h2>
        </>
    );
}