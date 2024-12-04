import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import { useEffect } from 'react';
import { FaStar } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import GetSpotReviews from '../GetSpotReviews/GetSpotReviews';
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

    if(spot) {targetSpot = spot;}
    else if (spotAlt) {targetSpot = spotAlt;}
    

    const imgArr = [];


    if(targetSpot.SpotImages) Object.values(targetSpot.SpotImages).map(img=>imgArr.push(img));

    for(let i = 0; i < 5; i++){
        if(!imgArr[i]) imgArr.push({
            id: `${i}`,
            preview: false,
            url: `url${i}`
        })
    }
    
    return (
    <div className='single-spot'>
        <h1>{targetSpot.name}</h1>
        <h4>{`${targetSpot.city}, ${targetSpot.state}, ${targetSpot.country}`}</h4>
        <div className='img-grid'>
            <div className='preview'>
                <img src={/*imgArr.find(img=>{
                    img.preview===true;
                    return img.url
                }) ||*/ `../../../images/preview${spot.id}.jpg`} />
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
                <p className='info'>Placeholder Text</p>
            </div>
            <div className='price-review-box'>
                <div className='price-review'>
                    <p className='price'><h2>${targetSpot.price}</h2>night</p>
                    <div className='rating'>
                        <FaStar />
                        {targetSpot.avgStarRating}
                        <LuDot />
                        {targetSpot.numReviews} reviews
                    </div>
                </div>
                <button className='reserve'>Reserve</button>
            </div>
        </div>
        <div className='spot-reviews'>
            <h2 className='review-header'>
                <FaStar />
                {targetSpot.avgStarRating}
                <LuDot />
                {targetSpot.numReviews} reviews
            </h2>
            <GetSpotReviews />
        </div>
    </div>
    ); 
    
}