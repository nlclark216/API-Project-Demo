import { useParams } from 'react-router-dom';
import './GetSpotReviews.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import * as reviewActions from '../../store/reviews'

export default function GetSpotReviews() {
    const dispatch = useDispatch();

    const { id } = useParams();

    useEffect(() => {
        dispatch(reviewActions.loadSpotReviews(id));
    }, [dispatch, id]);

    const spotReviews = useSelector(state=>state.reviews.reviews);
    let targetReviews = spotReviews;

    // console.log(Object.values(spotReviews))

    let reviewArr;

    if(targetReviews) reviewArr = Object.values(targetReviews);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    console.log(reviewArr.length)
    
    return (
        // <h2>Spot Reviews</h2>
        <>
        {reviewArr.length ? (<div className='all-spot-reviews'>{
            targetReviews && reviewArr.map(review=>(
                <div key={review.id} className='spot-review'>
                    {review.User && <h4 className='reviewer-name'>{review.User.firstName}</h4>}
                    {review.updatedAt && <p className='review-date'>{monthNames[review.updatedAt.slice(5,7)-1]} {review.updatedAt.slice(0,4)}</p>}
                    {review.review && <p className='review-text'>{review.review}</p>}
                </div>
            ))
        }</div>) : (<p>Be the first to post a review!</p>)}
        </>
    )
}
