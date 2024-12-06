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

    // console.log(spot)

    let targetSpot = {...spot};

    // console.log(targetSpot.avgStarRating)

    let imgArr = [];

    if (spot) if(spot.SpotImages) Object.values(targetSpot.SpotImages).map(img=>imgArr.push(img));

    for(let i = 0; i < 5; i++){
        if(!imgArr[i]) imgArr.push({
            id: `${i}`,
            preview: false,
            url: "https://www.clker.com/cliparts/7/8/b/6/11949945022068797520checkedbox.svg.med.png"
        })
    }

    const checkRating = targetSpot.avgStarRating > 0;
    console.log(checkRating)
    
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
                <p className='info'>Lorem ipsum odor amet, consectetuer adipiscing elit. Augue suscipit ornare litora congue eget. Phasellus duis netus per sapien suscipit class vitae. Potenti magnis vehicula nullam cubilia feugiat. Turpis efficitur pellentesque massa enim morbi accumsan velit dictumst tempor. </p><p className='info'>Velit gravida risus; in libero ultricies senectus. Finibus accumsan mus mauris convallis integer a ut. Facilisi cursus elit vivamus elementum porttitor; luctus per. Auctor aliquet curae eget auctor; sociosqu nibh consectetur magnis.</p>
            </div>
            <div className='price-review-box'>
                <div className='price-review'>
                    {spot && <p className='price'><h2>${targetSpot.price}</h2>night</p>}
                    {checkRating===false ? 
                        (<>
                        <div className='new-user-rating'>
                            <FaStar />
                             New
                        </div>
                        </>) : 
                        (<>
                        <div className='rating'>
                        <FaStar />
                        {spot && targetSpot.avgStarRating}
                        <LuDot />
                        {spot && targetSpot.numReviews} reviews
                        </div>
                        </>)
                    } 
                </div>
                <button className='reserve'>Reserve</button>
            </div>
        </div>
        <div className='spot-reviews'>
            <h2 className='review-header'>
            {checkRating===false ? 
                (<>
                <div className='new-user-rating'>
                    <FaStar />
                        New
                </div>
                </>) : 
                (<>
                <div className='rating'>
                <FaStar />
                {spot && targetSpot.avgStarRating}
                <LuDot />
                {spot && targetSpot.numReviews} reviews
                </div>
                </>)
            }
            </h2>
            <GetSpotReviews />
        </div>
    </div>
    ); 
    
}