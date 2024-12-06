import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import './CreateSpotForm.css';


export default function CreateSpotForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [lat, setLatitude] = useState(0);
    const [lng, setLongitude] = useState(0);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [img1, setImg1] = useState('');
    const [img2, setImg2] = useState('');
    const [img3, setImg3] = useState('');
    const [img4, setImg4] = useState('');
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);


    // console.log(errors)

    const newSpot = {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    }


    const handleSubmit = async e => {
        e.preventDefault();

        console.log(newSpot)
       
        const newErrors = {};
        if (!country) newErrors.country = 'Country is required';
        if (!address) newErrors.address = 'Address is required';
        if (!city) newErrors.city = 'City is required';
        if (!state) newErrors.state = 'State is required';
        if (description < 30)
            newErrors.description = 'Description needs a minimum of 30 characters';
        if (!name) newErrors.name = 'Name is required';
        if (!price) newErrors.price = 'Price is required';
        if (!previewImage) newErrors.previewImage = 'Preview image is required.';
        if(img1 && (!img1.endsWith('.jpg') 
            || !img1.endsWith('.jpeg') 
            || !img1.endsWith('.png'))) newErrors.img1 = 'Image URL must end in .png, .jpg, or .jpeg';
        if(img2 && (!img2.endsWith('.jpg') 
            || !img2.endsWith('.jpeg') 
            || !img2.endsWith('.png'))) newErrors.img2 = 'Image URL must end in .png, .jpg, or .jpeg';
        if(img3 && (!img3.endsWith('.jpg') 
            || !img3.endsWith('.jpeg') 
            || !img3.endsWith('.png'))) newErrors.img3 = 'Image URL must end in .png, .jpg, or .jpeg';
        if(img4 && (!img4.endsWith('.jpg') 
            || !img4.endsWith('.jpeg') 
            || !img4.endsWith('.png'))) newErrors.img4 = 'Image URL must end in .png, .jpg, or .jpeg';
        if(!lat) newErrors.lat = 'Latitude is required';
        if(!lng) newErrors.lng = 'Longitude is required';

        setErrors(newErrors);

        setSubmitted(true);

        // if(Object.values(errors).length) {
        //     return;
        // }
        let spotImages = [
            { url: previewImage, preview: true },
            { url: img1, preview: false },
            { url: img2, preview: false },
            { url: img3, preview: false },
            { url: img4, preview: false },
        ].filter((img) => img.url); 
        console.log(spotImages)

        if(Object.values(newErrors).length) return;

 
        dispatch(spotActions.createNewSpot(newSpot, spotImages, navigate));

    }

    console.log(errors)

// .dispatch(spotActions.addPreviewImg(id, previewImage))

    // 33.7626° N, 84.3924° W
    // This is the greatest spot in the whole world!
    // World of Coke
    // https://a0.muscache.com/im/pictures/miso/Hosting-788677501749872896/original/ac54836d-9522-44c8-8e13-dae7b46bf080.jpeg

    // return (
    //     <h1>Create a new Spot</h1>
    // )

return (
    <div className='create-spot-form'>
    <form 
    className='new-spot-form'
    method='POST'
    onSubmit={handleSubmit}
    >
        <div className='create-spot-intro'>
            <h2>Create a new Spot</h2>
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
                value={country}
                onChange={e=>setCountry(e.target.value)}
                />
            </label>
            
            <label>
                <div className='err-div'>Street Address {submitted && errors.address && (<h5 className="error">{errors.address}</h5>)}</div>
                <input 
                id="address"
                placeholder="Street Address"
                type="text"
                value={address}
                onChange={e=>setAddress(e.target.value)}
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
                        value={city}
                        onChange={e=>setCity(e.target.value)}
                        />,
                    </span>
                </label>
                
                <label className='state'>
                    <div className='err-div'>State {submitted && errors.state && (<h5 className="error">{errors.state}</h5>)}</div>
                    <input
                    id="state"
                    placeholder="STATE"
                    type="text"
                    value={state}
                    onChange={e=>setState(e.target.value)}
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
                        onChange={e=>setLatitude(parseFloat(e.target.value))}
                        />,
                    </div>  
                </label>
                
                <label>
                    <div className='err-div'>Longitude {submitted && errors.lng && <h5 className='error'>{errors.lng}</h5>}</div>
                    <input 
                    type='decimal'
                    id='lng'
                    placeholder='Longitude'
                    onChange={e=>setLongitude(parseFloat(e.target.value))}
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
                value={description}
                onChange={e=>setDescription(e.target.value)}
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
                value={name}
                onChange={e=>setName(e.target.value)}
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
                    onChange={e=>setPrice(parseInt(e.target.value))}
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
                    value={previewImage}
                    onChange={e=>setPreviewImage(e.target.value)}
                    />
                </label>
                {submitted && errors.previewImage && (<h5 className="error">{errors.previewImage}</h5>)}
                <label>
                    <input
                    placeholder="Image URL"
                    type="text"
                    id="img1"
                    value={img1}
                    onChange={e=>setImg1(e.target.value)}
                    />
                </label>
                {submitted && errors.img1 && (<p className="error">{errors.img1}</p>)}
                <label>
                    <input
                    placeholder="Image URL"
                    type="text"
                    id="img2"
                    value={img2}
                    onChange={e=>setImg2(e.target.value)}
                    />
                </label>
                {submitted && errors.img2 && (<p className="error">{errors.img2}</p>)}
                <label>
                    <input
                    placeholder="Image URL"
                    type="url"
                    id="img3"
                    value={img3}
                    onChange={e=>setImg3(e.target.value)} 
                    />
                </label>
                {submitted && errors.img3 && (<p className="error">{errors.img3}</p>)}
                <label>
                    <input
                    placeholder="Image URL"
                    type="url"
                    id="img4"
                    value={img4}
                    onChange={e=>setImg4(e.target.value)}
                    /> 
                </label>
                {submitted && errors.img5 && (<p className="error">{errors.img5}</p>)}
            </div>
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