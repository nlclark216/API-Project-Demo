import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import './UpdateSpot.css';


export default function UpdateSpot() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let { id } = useParams();
    id = +id

    const [formInfo, setFormInfo] = useState({
        country: '',
        address: '',
        city: '',
        state: '',
        lat: '',
        lng: '',
        description: '',
        name: '',
        price: '',
    });
    
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);


    useEffect(() => {
        dispatch(spotActions.getSpotById(`${id}`))
    }, [dispatch, id])

    const spot = useSelector(state=>state.spots.spotDetails[`${id}`]);

    useEffect(() => {
        if(spot) {
            setFormInfo({
                country: spot.country,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                lat: spot.lat,
                lng: spot.lng,
                description: spot.description,
                name: spot.name,
                price: spot.price
            })
        }
    }, [spot, setFormInfo])
  
    const handleChange = (e) => {
        setFormInfo({ ...formInfo, [e.target.id]: e.target.value });
    };

    
    const handleSubmit = async e => {
        e.preventDefault();
        setSubmitted(true);

        if(!errors.message) {

        const updateSpot = {
            address: formInfo.address,
            city: formInfo.city,
            state: formInfo.state,
            country: formInfo.country,
            name: formInfo.name,                                                                                           
            description: formInfo.description,
            price: parseFloat(formInfo.price),
            lat: parseFloat(formInfo.lat),
            lng: parseFloat(formInfo.lng)
        };

        return dispatch(spotActions.updateTargetSpot(id, updateSpot, navigate))
            .catch(async (res) => {
                const data = await res.json();
                if(data?.errors) {setErrors(data);}
            }).then(navigate(`/spots/${id}`))}

    }

    return (
        <div className='update-spot-form'>
        <form 
        className='new-spot-form'
        method='PUT'
        onSubmit={handleSubmit}
        >
            <div className='create-spot-intro'>
                <h2>Update Your Spot</h2>
                <h3>Where&apos;s your place located?</h3>
                <p>Guests will only get your exact address once they book a
                reservation.</p>
            </div>
            
            <div className='new-spot-inputs'>
                <label>
                    <div className='err-div'>Country {submitted && errors.country && (<h5 className="error">{errors.country}</h5>)}</div>
                    <input 
                    id="country"
                    placeholder="Country"
                    type="text"
                    value={formInfo.country}
                    onChange={handleChange}
                    />
                </label>
                
                <label>
                    <div className='err-div'>Street Address {submitted && errors.address && (<h5 className="error">{errors.address}</h5>)}</div>
                    <input 
                    id="address"
                    placeholder="Street Address"
                    type="text"
                    value={formInfo.address}
                    onChange={handleChange}
                    />
                </label>
                {errors.address && <h5>{errors.address}</h5>}
                <div className='city-state'>
                    <label className='city'>
                        <div className='err-div'>City {submitted && errors.city && (<h5 className="error">{errors.city}</h5>)}</div>
                        <span className='add-comma'>
                           <input
                            id="city"
                            className=''
                            placeholder="City"
                            type="text"
                            value={formInfo.city}
                            onChange={handleChange}
                            />,
                        </span>
                    </label>
                    
                    <label className='state'>
                        <div className='err-div'>State {submitted && errors.state && (<h5 className="error">{errors.state}</h5>)}</div>
                        <input
                        id="state"
                        placeholder="STATE"
                        type="text"
                        value={formInfo.state}
                        onChange={handleChange}
                        />
                    </label>
                    
                </div>
                <div className='lat-lon'>
                    <label className='lat'>
                        <div className='err-div'>Latitude {submitted && errors.lat && (<h5 className='error'>{errors.lat}</h5>)}</div>
                        <div className='add-comma'>
                           <input 
                            type='decimal'
                            id='lat'
                            placeholder='Latitude'
                            value={formInfo.lat}
                            onChange={handleChange}
                            />,
                        </div>  
                    </label>
                    
                    <label>
                        <div className='err-div'>Longitude {submitted && errors.lng && <h5 className='error'>{errors.lng}</h5>}</div>
                        <input 
                        type='decimal'
                        id='lng'
                        placeholder='Longitude'
                        value={formInfo.lng}
                        onChange={handleChange}
                        />
                    </label>
                    
                </div>
            </div>
    
            <div className='spot-description'>
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amentities like
                fast wi-fi or parking, and what you love about the neighborhood.</p>
                <label>
                    <textarea
                    className='form-textarea'
                    placeholder="Please describe your spot using at least 30 characters"
                    id="description"
                    value={formInfo.description}
                    onChange={handleChange}
                    />  
                </label>
                {submitted && errors.description && <h5 className="error">{errors.description}</h5>}
            </div>
            
    
            <div className='spot-title'>
                <h3>Create a title for your spot</h3>
                <p>Catch guests&apos; attention with a spot title that highlights what makes
                your place special.</p>
                <label>
                    <input
                    className="input-title"
                    placeholder="Name of your spot"
                    type="text"
                    id="name"
                    value={formInfo.name}
                    onChange={handleChange}
                    /> 
                </label>
                {submitted && errors.name && <h5 className="error">{errors.name}</h5>}
            </div>
    
            <div className='spot-price'>
                <h3>Set a base price for your spot</h3>
                <p>Competitive pricing can help your listing stand out and rank higher
                in search results.</p>
                <div className='price-symbol'>
                    <p className='dollar-sign'><b>$</b></p>
                    <label className='price-box'>
                        <input 
                        placeholder="Price per night (USD)"
                        type="number"
                        id="price"
                        value={formInfo.price}
                        onChange={handleChange}
                        />  
                    </label>
                    
                </div>
                {submitted && errors.price && <h5 className="error">{errors.price}</h5>}
            </div>
            <div className='update-spot-button'>
                {errors && <h5 className='error'>{errors.message}</h5>}
                <button
                type='submit'
                >Update your Spot</button>
            </div>
        </form>
        </div>
    );
}