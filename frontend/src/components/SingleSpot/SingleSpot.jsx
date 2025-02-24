import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import GetSpotReviews from '../GetSpotReviews/GetSpotReviews';
import PostReviewModal from '../PostReviewModal/PostReviewModal';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import MapContainer from '../Maps';
import { FaStar } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import StateAbbObj from '../StateAbbr/StateAbbr';
import './SingleSpot.css';


export default function SingleSpot() {
    let { id } = useParams();
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const navigate = useNavigate();

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
    
    id = +id;

    useEffect(() => {
        dispatch(spotActions.getSpotById(id));
    }, [dispatch, id]);

    const spot = useSelector(state=>state.spots.spotDetails[id]);
    let targetSpot;
    let checkRating;
    let imgArr = [];
    let center = {};
    let isOwner = false;


    if(spot) { 
        targetSpot = {...spot}; 
        checkRating = targetSpot?.avgStarRating > 0;
        center.lat= +spot?.lat;
        center.lng = +spot?.lng;
        if(spot?.SpotImages) {Object.values(targetSpot?.SpotImages).map(img=>imgArr.push(img));}
    }

    for(let i = 0; i < 5; i++){
        if(!imgArr[i]) imgArr.push({
            id: `${i}`,
            preview: false,
            url: "https://i0.wp.com/biosimilarsrr.com/wp-content/uploads/2018/09/placeholder-square.jpg"
        })
    }

    const country = input => {
        if (input.startsWith('United')) return 'USA'
    }

    const sessionUser = useSelector(state=>state.session.user);
    const reviews = useSelector(state=>state.reviews.reviews);
    
    let findExistingReview;

    if(sessionUser && reviews) {
        findExistingReview = reviews.find(review=>review?.userId===sessionUser.id);
    }

    if(sessionUser && spot) {
        if(sessionUser.id === spot?.Owner.id) isOwner = true;
    }


    const handleClick = () => { alert("Feature Coming Soon..."); };
    
    return (
    <div className='single-spot'>
        {spot && <h1>{targetSpot?.name}</h1>}
        {spot && <h4>{targetSpot?.city}, <StateAbbObj state={targetSpot?.state} />, {country(targetSpot?.country)}</h4>}
        <div className='img-grid'>
            <div className='preview'>
                {spot && <img src={imgArr[0]?.url} />}
            </div>
            <div className='not-preview-box'>
               <div className='row'>
                <img className='not-preview' alt='Image 1 of location' src={imgArr[1]?.url} />
                <img className='not-preview' alt='Image 2 of location' id='edge-top' src={imgArr[2]?.url} />
               </div>
               <div className='row'>
                <img className='not-preview' alt='Image 3 of location' src={imgArr[3]?.url} />
                <img className='not-preview' alt='Image 4 of location' id='edge-bottom' src={imgArr[4]?.url} />
               </div>
            </div>
        </div>
        <div className='host-info-and-price'>
            <div className='host-info'>
                {spot && targetSpot?.Owner && <h2>Hosted By: {targetSpot?.Owner.firstName} {targetSpot?.Owner.lastName}</h2>}
                <p className='info'>Lorem ipsum odor amet, consectetuer adipiscing elit. Augue suscipit ornare litora congue eget. Phasellus duis netus per sapien suscipit class vitae. Potenti magnis vehicula nullam cubilia feugiat. Turpis efficitur pellentesque massa enim morbi accumsan velit dictumst tempor. </p><p className='info'>Velit gravida risus; in libero ultricies senectus. Finibus accumsan mus mauris convallis integer a ut. Facilisi cursus elit vivamus elementum porttitor; luctus per. Auctor aliquet curae eget auctor; sociosqu nibh consectetur magnis.</p>
            </div>
            <div className='map-review-box'>
                <div className='price-review-box'>
                    <div className='price-review'>
                        {spot && <span className='price'><h2 >${targetSpot?.price}</h2>night</span>}
                        {!checkRating ? 
                            (<>
                            <div className='new-user-rating'>
                                <FaStar className='star' id='icon' />
                                New
                            </div>
                            </>) : 
                            (<>
                            <div className='rating' id='in-box'>
                            <FaStar className='star' id='icon' />
                            {spot && targetSpot?.avgStarRating.toFixed(1)}
                            <LuDot />
                            {spot && targetSpot?.numReviews} {targetSpot?.numReviews > 1 ? <>reviews</> : <>review</>}
                            </div>
                            </>)
                        } 
                    </div>
                    <button 
                    onClick={handleClick} 
                    aria-label='Reserve'
                    className='reserve'>Reserve</button>
                </div> 
                <MapContainer center={center} />
            </div>
           

            

        </div>
        <div className='spot-reviews'>
            <h2 className='review-header'>
            {!checkRating ? 
                (<>
                <div className='new-user-rating'>
                    <FaStar className='star' id='icon' />
                        New
                </div>
                </>) : 
                (<>
                <div className='rating'>
                <FaStar className='star' id='icon' />
                {spot && targetSpot?.avgStarRating.toFixed(1)}
                <LuDot />
                {spot && <span>{targetSpot?.numReviews}</span>} {targetSpot?.numReviews > 1 ? <>reviews</> : <>review</>}
                </div>
                </>)
            }
            </h2>
            {sessionUser && Object.values(sessionUser).length>0 
             && !findExistingReview && !isOwner
             && <button className='review-button' onClick={toggleMenu}>
                <OpenModalMenuItem
                itemText="Post Your Review"
                onItemClick={closeMenu}
                modalComponent={<PostReviewModal navigate={navigate} />}
                />
                </button>}
            {!checkRating && sessionUser && !isOwner && <p>Be the first to post a review!</p>}
             <GetSpotReviews id={id} sessionUser={sessionUser} />
        </div>
    </div>
    ); 
    
}