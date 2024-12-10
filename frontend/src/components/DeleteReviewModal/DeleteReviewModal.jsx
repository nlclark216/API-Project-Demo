import './DeleteReviewModal.css';
import { useState } from 'react';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import * as reviewActions from '../../store/reviews';

export default function DeleteReviewModal({navigate, reviewId, spotId}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [errors, setErrors] = useState({});

    const handleClick = e => {
        e.preventDefault();
        setErrors({});

        return dispatch(reviewActions.deleteTargetReview(reviewId))
        .then(closeModal).catch(async res => {
            const data = await res.json();
            if(data?.message) setErrors(data);
        }).then(navigate(`/spots/${spotId}`))
    }

    return (<div className='delete-modal'>
        <h1>Confirm Delete</h1>
        <h4>Are you sure you want to delete this review?</h4>
        {errors && <p>{errors.message}</p>}
        <button 
        onClick={handleClick} 
        id='yes'
        aria-label='Yes (Delete Review)' 
        >Yes (Delete Review)</button>
        <button 
        onClick={closeModal} 
        id='no'
        aria-label='No (Keep Review)'  
        >No (Keep Review)</button>
        </div>);
}