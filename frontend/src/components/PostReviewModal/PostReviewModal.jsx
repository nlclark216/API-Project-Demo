import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useModal } from "../../context/Modal";
import './PostReviewModal.css';
import * as reviewActions from '../../store/reviews';


export default function PostReviewModal({ navigate }) {
    const dispatch = useDispatch();
    const [review, setReview] = useState("");
    const [stars, setStars] = useState(0);
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const spot = useSelector(state=>state.spots.spotDetails);
    const targetSpot = {...spot}
    const id = Object.values(targetSpot)[0].id;

    const CreateRating = () => {
        const [hoverVal, setHoverVal] = useState(0);

        const handleStarClick = val => {
            setStars(val);
        }

        const handleHover = val => {
            setHoverVal(val);
        }

        const handleLeave = () => {
            setHoverVal(0);
        }

        return(
            <div className="star-rating">
                {[1,2,3,4,5].map(val=>(
                    <span
                    id="review"
                    key={val}
                    className={`star ${val <= (hoverVal || stars ) ? 'filled' : '}'}`}
                    onClick={() => handleStarClick(val)}
                    onMouseEnter={() => handleHover(val)}
                    onMouseLeave={handleLeave}
                    >★</span>
                ))}
            </div>
        );
    }

    const handleSubmit = e => {
        e.preventDefault();
        setErrors({});

        return dispatch(reviewActions.addSpotReview({
            review: review,
            stars: stars
        }, id, navigate)).then(closeModal).catch(async res => {
            const data = res.json();
            if(data?.errors) setErrors(data)
        }).then(navigate(`/spots/${id}`));
    }


    return (
        <div className="post-review-modal">
        <form className="review-form" onSubmit={handleSubmit}>
            <h2 className="modal-title">How was your stay?</h2>
            {errors.message && <h5>{errors.message}</h5>}
            <textarea 
            className="post-review-contents" 
            placeholder="Leave your review here..."
            onChange={e=>setReview(e.target.value)}
            />
            <div className="select-stars">
                <CreateRating />
                <span>Stars</span>
            </div>
            {errors && <h5>{errors.message}</h5>}
            <button
            aria-label="Submit Your Review"
            disabled={review?.length < 10 || stars < 1}
            >Submit Your Review</button>
        </form>
        </div>
    );

}