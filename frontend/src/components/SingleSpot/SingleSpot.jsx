import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import GetSpotReviews from '../GetSpotReviews/GetSpotReviews';
import { FaStar } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import './SingleSpot.css';


export default function SingleSpot() {
    let { id } = useParams();
    const dispatch = useDispatch();
    
    id = +id;

    useEffect(() => {
        dispatch(spotActions.getSpotById(id));
    }, [dispatch, id]);

    const spot = useSelector(state=>state.spots.spotDetails[id]);

    let targetSpot = spot;

    // console.log(targetSpot.SpotImages)

    let imgArr = [];

    if (spot) Object.values(targetSpot.SpotImages).map(img=>imgArr.push(img));

    for(let i = 0; i < 5; i++){
        if(!imgArr[i]) imgArr.push({
            id: `${i}`,
            preview: false,
            url: "https://www.clker.com/cliparts/7/8/b/6/11949945022068797520checkedbox.svg.med.png"
        })
    }

    // return (<h1>Brokey</h1>)
    
    return (
    <div className='single-spot'>
        {spot && <h1>{targetSpot.name}</h1>}
        {spot && <h4>{`${targetSpot.city}, ${targetSpot.state}, ${targetSpot.country}`}</h4>}
        <div className='img-grid'>
            <div className='preview'>
                {spot && <img src={imgArr[0].url} />}
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
                {spot && targetSpot.Owner && <h2>Hosted By {targetSpot.Owner.firstName} {targetSpot.Owner.lastName}</h2>}
                <p className='info'>Placeholder Text</p>
            </div>
            <div className='price-review-box'>
                <div className='price-review'>
                    {spot && <p className='price'><h2>${targetSpot.price}</h2>night</p>}
                    <div className='rating'>
                        <FaStar />
                        {spot && targetSpot.avgStarRating}
                        <LuDot />
                        {spot && targetSpot.numReviews} reviews
                    </div>
                </div>
                <button className='reserve'>Reserve</button>
            </div>
        </div>
        <div className='spot-reviews'>
            <h2 className='review-header'>
                <FaStar />
                {spot && targetSpot.avgStarRating}
                <LuDot />
                {spot && targetSpot.numReviews} reviews
            </h2>
            <GetSpotReviews />
        </div>
    </div>
    ); 
    
}