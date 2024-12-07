import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import './UpdateSpot.css';


export default function UpdateSpot() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    

    const [formInfo, setFormInfo] = useState({
        country: "",
        address: "",
        city: "",
        state: "",
        lat: "",
        lng: "",
        description: "",
        name: "",
        price: "",
    });
    
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        dispatch(spotActions.getSpotById(+id))
    }, [dispatch, id])

    const spot = useSelector((state) => state.spots.spotDetails[id]);
  
    let targetUrl;
    console.log(targetUrl)

    useEffect(() => {
        if(spot) setFormInfo({
            country: spot.country || "",
            address: spot.address || "",
            city: spot.city || "",
            state: spot.state || "",
            lat: spot.lat || "",
            lng: spot.lng || "",
            description: spot.description || "",
            name: spot.name || "",
            price: spot.price || "",
            SpotImages: spot.SpotImages || []
            })
    }, [spot])

    const imgArr = formInfo.SpotImages;
    if(imgArr) {
        const findPreviewUrl = imgArr.find(img=>img.preview===true) 
         targetUrl = findPreviewUrl.url;
     }

    const handleChange = (e) => {
        setFormInfo({ ...formInfo, [e.target.id]: e.target.value });
    };

    useEffect(() => {
        const newErrors = {};
        if (!formInfo.country) newErrors.country = "Country is required";
        if (!formInfo.address) newErrors.address = "Address is required";
        if (!formInfo.city) newErrors.city = "City is required";
        if (!formInfo.state) newErrors.state = "State is required";
        if (formInfo.description < 30)
          newErrors.description = "Description needs 30 or more characters";
        if (!formInfo.name) newErrors.name = "Name is required";
        if (!formInfo.price) newErrors.price = "Price is required";
        setErrors(newErrors);

    }, [formInfo]);
    
    const handleSubmit = async e => {
        e.preventDefault();
        setSubmitted(true);

        if(Object.values(errors).length) return;

        const updateSpot = {
            address: formInfo.address,
            city: formInfo.city,
            state: formInfo.state,
            country: formInfo.country,
            name: formInfo.name,                                                                                           
            description: formInfo.description,
            price: parseFloat(formInfo.price),
        };

        return dispatch(spotActions.updateTargetSpot(id, imgArr, updateSpot, navigate))
            .then().catch(async (res) => {
                const data = await res.json();
                if(data?.errors) setErrors(data.errors)
            })

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
    
            <div className='spot-photos'>
                <h3>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <div className='img-labels'>
                    <label>
                        <input 
                        placeholder="Preview Image URL"
                        type="url"
                        id="previewImg"
                        value={targetUrl}
                        onChange={handleChange}
                        />
                    </label>
                    {submitted && errors.previewImage && (<h5 className="error">{errors.previewImage}</h5>)}
                    <label>
                        <input
                        placeholder="Image URL"
                        type="text"
                        id="img1"
                        // value={img1}
                        // onChange={e=>setImg1(e.target.value)}
                        />
                    </label>
                    {/* {submitted && errors.img1 && (<h5 className="error">{errors.img1}</h5>)} */}
                    <label>
                        <input
                        placeholder="Image URL"
                        type="text"
                        id="img2"
                        // value={img2}
                        // onChange={e=>setImg2(e.target.value)}
                        />
                    </label>
                    {/* {submitted && errors.img2 && (<h5 className="error">{errors.img2}</h5>)} */}
                    <label>
                        <input
                        placeholder="Image URL"
                        type="url"
                        id="img3"
                        // value={img3}
                        // onChangke={e=>setImg3(e.target.value)} 
                        />
                    </label>
                    {/* {submitted && errors.img3 && (<h5 className="error">{errors.img3}</h5>)} */}
                    <label>
                        <input
                        placeholder="Image URL"
                        type="url"
                        id="img4"
                        // value={img4}
                        // onChange={e=>setImg4(e.target.value)}
                        /> 
                    </label>
                    {/* {submitted && errors.img5 && (<h5 className="error">{errors.img5}</h5>)} */}
                </div>
            </div>
            <div className='create-spot-button'>
                {/* {errors.message && <h5 className='error'>{errors.message}</h5>} */}
                <button
                type='submit'
                >Update Spot</button>
            </div>
        </form>
        </div>
    );
}