import { useParams } from 'react-router-dom';
import './GetSpotReviews.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import * as spotActions from '../../store/spots';

export default function GetSpotReviews() {
    const dispatch = useDispatch();

    const { id } = useParams();

    useEffect(() => {
        dispatch(spotActions.fetchReviews(id));
    }, [dispatch, id]);

    const reviews = useSelector(state=>state.spots.spotReviews);
    const reviewsAlt = JSON.parse(localStorage.getItem('reviews'));
    let reviewArr;
    // console.log(reviewsAlt.Reviews)

    if(Object.keys(reviews).length) {
        reviewArr = Object.keys(reviews);
    } else if (reviewsAlt) {
        reviewArr = reviewsAlt.Reviews
    } else { 
        return (<h3>Loading...please refresh browser...</h3>) 
    }

    return (
        <h2>Spot Reviews</h2>
        // {reviews && reviewArr.map(review=>)}
    )
}
