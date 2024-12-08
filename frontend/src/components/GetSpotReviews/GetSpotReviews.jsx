import './GetSpotReviews.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import * as reviewActions from '../../store/reviews';
import { useNavigate } from 'react-router-dom';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';


export default function GetSpotReviews({id, sessionUser}) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(reviewActions.loadSpotReviews(id));
    }, [dispatch, id]);

    const spotReviews = useSelector(state=>state.reviews.reviews);

    const monthNames = ['January', 'February', 'March', 'April', 'May',
         'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const toggleMenu = (e) => {
        e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if(!showMenu) return;

        const closeMenu = (e) => { 
            if(!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);
    
    return (
        <>
        {spotReviews && spotReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(review=>(<div key={review.id}>
            <h3>{review.User.firstName}</h3>
            <p className='date'>{monthNames[review.updatedAt.slice(5,7)-1]} {review.updatedAt.slice(0,4)}</p>
            <p className='review-text'>{review.review}</p>
            {sessionUser && sessionUser.id===review.User.id && 
            <button 
            onClick={toggleMenu}
            className='delete-review'
            >
                <OpenModalMenuItem
                itemText="Delete"
                onItemClick={closeMenu}
                modalComponent={<DeleteReviewModal navigate={navigate} reviewId={review.id} spotId={id} />}
                /></button>}
        </div>))}
        </>
    )
}
