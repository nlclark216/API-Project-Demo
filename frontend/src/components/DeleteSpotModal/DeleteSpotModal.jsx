import './DeleteSpotModal.css';
import { useState } from 'react';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import * as spotActions from '../../store/spots';

export default function DeleteSpotModal({ navigate, spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [errors, setErrors] = useState({});

    const handleClick = e => {
        e.preventDefault();
        setErrors({});
        return dispatch(spotActions.deleteTargetSpot(spotId))
        .then(closeModal)
        .catch(async res => {
            const data = await res.json();
            if(data?.message) setErrors(data);
        }).then(navigate('/spots/current'));
    }

    return (<div className='delete-modal'>
    <h1>Confirm Delete</h1>
    <h4>Are you sure you want to remove this spot
    from the listings?</h4>
    <button onClick={handleClick}>Yes (Delete Spot)</button>
    <button onClick={closeModal}>No (Keep Spot)</button>
    </div>);
}