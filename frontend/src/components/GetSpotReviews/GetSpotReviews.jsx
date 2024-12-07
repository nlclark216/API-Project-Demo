import './GetSpotReviews.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import * as reviewActions from '../../store/reviews';


export default function GetSpotReviews({id, sessionUser}) {
    const dispatch = useDispatch();

    console.log(sessionUser)

    useEffect(() => {
        dispatch(reviewActions.loadSpotReviews(id));
    }, [dispatch, id]);

    const spotReviews = useSelector(state=>state.reviews.reviews);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    
    return (
        <>
        {spotReviews && spotReviews.map(review=>(<div key={review.id}>
            <h3>{review.User.firstName}</h3>
            <p className='date'>{monthNames[review.updatedAt.slice(5,7)-1]} {review.updatedAt.slice(0,4)}</p>
            <p className='review-text'>{review.review}</p>
        </div>))}
        </>
    )
}
