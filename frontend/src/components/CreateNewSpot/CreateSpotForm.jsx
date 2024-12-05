import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import './CreateSpotForm.css';


export default function CreateSpotForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formInfo, setFormInfo] = useState({
        country: '',
        address: '',
        city: '',
        state: '',
        description: '',
        name: '',
        price: '',
        image1: '',
        image2: '',
        image3: '',
        image4: '',
        image5: '',
      });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormInfo({ ...formInfo, [e.target.id]: e.target.value });
    };

    useEffect(() => {
        const newErrors = {};
        if (!formInfo.country) newErrors.country = 'Country is required';
        if (!formInfo.address) newErrors.address = 'Address is required';
        if (!formInfo.city) newErrors.city = 'City is required';
        if (!formInfo.state) newErrors.state = 'State is required';
        if (formInfo.description < 30)
          newErrors.description = 'Description needs a minimum of 30 characters';
        if (!formInfo.name) newErrors.name = 'Name is required';
        if (!formInfo.price) newErrors.price = 'Price is required';
        if (!formInfo.image1) newErrors.image1 = 'Preview Image URL is required';
        setErrors(newErrors);
      }, [formInfo]);

    const handleSubmit = async e => {
        e.preventDefault();
        setSubmitted(true);

        if(Object.values(errors).length) {
            return;
        }

        const newSpot = {
            country: formInfo.country,
            address: formInfo.address,
            city: formInfo.city,
            state: formInfo.state,
            description: formInfo.description,
            name: formInfo.name,
            price: formInfo.price,
        }

        const createSpot = dispatch(spotActions.createSpot(newSpot, navigate));
        
        if(createSpot) {
            let spotImages = [
                { url: formInfo.image1, preview: true },
                { url: formInfo.image2, preview: false },
                { url: formInfo.image3, preview: false },
                { url: formInfo.image4, preview: false },
                { url: formInfo.image5, preview: false },
            ].filter((image) => image.url);

            await Promise.all(
                spotImages.map((img) => dispatch(spotActions.addSpotImages(createSpot.id, img)))
              );
        }
    }

// .dispatch(spotActions.addPreviewImg(id, previewImage))

    // 33.7626° N, 84.3924° W
    // This is the greatest spot in the whole world!
    // World of Coke

    // return (
    //     <h1>Create a new Spot</h1>
    // )

    return (
        <div className='create-spot-form'>
        <form 
        className='new-spot-form'
        action='POST'
        onSubmit={handleSubmit}
        >
            <div className='create-spot-intro'>
                <h2>Create a new Spot</h2>
                <h3>Where&apos;s your place located?</h3>
                <h5>Guests will only get your exact address once they booked a
                reservation.</h5>
            </div>
            
            <div className='new-spot-inputs'>
                <label>
                    Country
                    <input 
                    id="country"
                    placeholder="Country"
                    type="text"
                    value={formInfo.country}
                    onChange={handleChange}
                    />
                </label>
                {submitted && errors.country && (<p className="error">{errors.country}</p>)}
                <label>
                    Street Address
                    <input 
                    id="address"
                    placeholder="Street Address"
                    type="text"
                    value={formInfo.address}
                    onChange={handleChange}
                    />
                </label>
                {submitted && errors.address && (<p className="error">{errors.address}</p>)}
                <div className='city-state'>
                    <label>
                        City
                        <input
                        id="city"
                        placeholder="City"
                        type="text"
                        value={formInfo.city}
                        onChange={handleChange}
                        />
                    </label>
                    {submitted && errors.city && (<p className="error">{errors.city}</p>)}
                    <label>
                        State
                        <input
                        id="state"
                        placeholder="State"
                        type="text"
                        value={formInfo.state}
                        onChange={handleChange}
                        />
                    </label>
                    {submitted && errors.state && (<p className="error">{errors.state}</p>)}
                </div>
                {/* <div className='lat-lon'>
                    <label>
                        Latitude
                        <input 
                        type='number'
                        placeholder='Latitude'
                        value={lat}
                        onChange={e=>setLatitude(e.target.value)}
                        />
                    </label>
                    {submitted && errors.lat && (<p className="error">{errors.lat}</p>)}
                    <label>
                        Longitude
                        <input 
                        type='number'
                        placeholder='Longitude'
                        value={lng}
                        onChange={e=>setLongitude(e.target.value)}
                        />
                    </label>
                    {errors.lng && <p>{errors.lng}</p>}
                </div> */}
            </div>

            <div className='spot-description'>
                <h3>Describe your place to guests</h3>
                <h5>Mention the best features of your space, any special amentities like
                fast wi-fi or parking, and what you love about the neighborhood.</h5>
                <label>
                  <textarea
                    className="form-textarea"
                    placeholder="Please write at least 30 characters"
                    id="description"
                    value={formInfo.description}
                    onChange={handleChange}
                    />  
                </label>
                
                {submitted && errors.description && <p className="error">{errors.description}</p>}
            </div>
            

            <div className='spot-title'>
                <h3>Create a title for your spot</h3>
                <h5>Catch guests&apos; attention with a spot title that highlights what makes
                your place special.</h5>
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
                {submitted && errors.name && <p className="error">{errors.name}</p>}
            </div>

            <div className='spot-price'>
                <h3>Set a base price for your spot</h3>
                <h5>Competitive pricing can help your listing stand out and rank higher
                in search results.</h5>
                <div className='price-symbol'>
                    <p className='price'><b>$</b></p>
                    <label>
                      <input 
                        placeholder="Price per night (USD)"
                        type="number"
                        id="price"
                        value={formInfo.price}
                        onChange={handleChange}
                        />  
                    </label>
                    
                </div>
                {submitted && errors.price && <p className="error">{errors.price}</p>}
            </div>

            <div className='spot-photos'>
                <h3>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <label>
                    <input 
                    placeholder="Image URL"
                    type="url"
                    id="image1"
                    value={formInfo.image1}
                    onChange={handleChange}
                    />
                </label>
                {submitted && errors.image1 && (<p className="error">{errors.image1}</p>)}
                <label>
                    <input
                    placeholder="Image URL"
                    type="url"
                    id="image2"
                    value={formInfo.image2}
                    onChange={handleChange}
                    />
                </label>
                <label>
                    <input
                    placeholder="Image URL"
                    type="url"
                    id="image3"
                    value={formInfo.image3}
                    onChange={handleChange}
                    />
                </label>
                <label>
                    <input
                    placeholder="Image URL"
                    type="url"
                    id="image4"
                    value={formInfo.image4}
                    onChange={handleChange} 
                    />
                </label>
                <label>
                   <input
                    placeholder="Image URL"
                    type="url"
                    id="image5"
                    value={formInfo.image5}
                    onChange={handleChange}
                    /> 
                </label>
            </div>
            <div className='create-spot-button'>
                <button
                type='submit'
                >Create Spot</button>
            </div>
        </form>
        </div>
    );
}