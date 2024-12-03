import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import { useEffect } from 'react';
import { FaStar } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import './SingleSpot.css';


export default function SingleSpot() {
    const dispatch = useDispatch();

    const {id} = useParams();

    useEffect(() => {
        dispatch(spotActions.findSpot(id));
    }, [dispatch, id]);

    const spot = useSelector(state=>state.spots.singleSpot)
    const spotAlt = JSON.parse(localStorage.getItem('spot')); 
    let targetSpot;

    if(spot) targetSpot = spot;
    else targetSpot = spotAlt;

    const imgArr = [];

    console.log(imgArr)
    if(spotAlt) {
        Object.values(spotAlt.SpotImages).map(img=>imgArr.push(img));
        for(let i = 0; i < 5; i++){
            if(!imgArr[i]) imgArr.push({
                id: `${i}`,
                preview: false,
                url: `url${i}`
            })
        } 
    }

    
    return (
    <div className='single-spot'>
        <h1>{targetSpot.name}</h1>
        <h4>{`${targetSpot.city}, ${targetSpot.state}, ${targetSpot.country}`}</h4>
        <div className='img-grid'>
            <div className='preview'>
                <img src={imgArr.find(img=>{
                    img.preview===true;
                    return img.url
                })} />
            </div>
            <div className='not-preview-box'>
               <div className='row'>
                <img className='not-preview' src={imgArr[1].url} />
                <img className='not-preview' src={imgArr[2].url} />
               </div>
               <div className='row'>
                <img className='not-preview' src={imgArr[3].url} />
                <img className='not-preview' src={imgArr[4].url} />
               </div>
            </div>
        </div>
        <div className='host-info-and-price'>
            <div className='host-info'>
                {targetSpot.Owner && <h2>Hosted By {targetSpot.Owner.firstName} {targetSpot.Owner.lastName}</h2>}
                <span className='info'>Placeholder Text</span>
            </div>
            <div className='price-review-box'>
                <div className='price-review'>
                    <span className='price'><h2>${targetSpot.price}</h2>night</span>
                    <div className='rating'>
                        <FaStar />
                        {targetSpot.avgStarRating}
                        <LuDot />
                        {targetSpot.numReviews} reviews
                    </div>
                </div>
                <button>Reserve</button>
            </div>
            <div className='spot-reviews'>
                <h2 className='review-header'>
                    <FaStar />
                    {targetSpot.avgStarRating}
                    <LuDot />
                    {targetSpot.numReviews} reviews
                </h2>
                <span>Reviews Placeholder</span>
            </div>
        </div>
    </div>
    ); 
    
}