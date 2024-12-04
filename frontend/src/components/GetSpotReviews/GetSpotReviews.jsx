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
    const reviewsAlt = JSON.parse(localStorage.getItem(`reviews`));
    let targetReviews;
    let reviewArr;
    // console.log(reviews)

    if(reviewsAlt) {targetReviews = reviewsAlt}
    else if (reviews) {targetReviews = reviews}

    if(targetReviews) reviewArr = Object.values(targetReviews);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    console.log(reviewsAlt)
    return (
        // <h2>Spot Reviews</h2>
        <div className='all-spot-reviews'>{
            targetReviews && reviewArr.map(review=>(
                <div key={review.id} className='spot-review'>
                    {review.User && <h4 className='reviewer-name'>{review.User.firstName}</h4>}
                    {review.updatedAt && <p className='review-date'>{monthNames[review.updatedAt.slice(5,7)-1]} {review.updatedAt.slice(0,4)}</p>}
                    {review.review && <p className='review-text'>{review.review}</p>}
                </div>
            ))
        }</div>
    )
}
