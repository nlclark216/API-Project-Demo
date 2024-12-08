import { useForm } from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
    country: yup.string().required('Country is required'),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    lat: yup.number().required('Latitude is required').min(-90).max(90),
    lng: yup.number().required('Longitude is required').min(-180).max(180),
    name: yup.string().required('Name is required').min(4),
    description: yup.string().required('Description needs 30 or more characters').min(30),
    previewImage: yup.string().required('Preview image is required.'),
    price: yup.number().required('Price is required').positive().integer()
})

// console.log(schema)

export default function CreateNewSpotForm() {
    const { register, formState: {errors}, handleSubmit } = useForm({
        resolver: yupResolver(schema)
    });
    let formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    console.log('ERRORS',errors)

    const onSubmit = data => {
        localStorage.setItem('formData', JSON.stringify(data));
        return dispatch(spotActions.createNewSpot(newSpot, spotImages, navigate))
            .catch(async (res) => {
                const data = await res.json();
                if(data?.errors) setErrors(data.errors)
            })
    };

    console.log('FORMDATA',formData)

    //  Greatest spot on the whole earth

    return (
        <div className='create-spot-form'>
        <form
        className='new-spot-form' 
        onSubmit={handleSubmit(onSubmit)}
        method='POST'
        >
            <div className='create-spot-intro'>
            <h2>Create a new Spot</h2>
            <h3>Where&apos;s your place located?</h3>
            <p>Guests will only get your exact address once they booked a
            reservation.</p>
            </div>

            <div className='new-spot-inputs'>

            <label>Country
            <input {...register('country')}
            placeholder='Country'
            type='text'
            aria-invalid={errors.country ? 'true' : 'false'} 
            />
            </label>
            {errors.country?.type === 'required' &&
            (<h5 role='alert'>{errors.country.message}</h5>)}

            <label> Street Address
            <input {...register('address')}
            placeholder='Street Address'
            type='text'
            aria-invalid={errors.address ? 'true' : 'false'}
            />
            </label>
            {errors.address?.type === 'required' && 
            (<h5 role='alert'>{errors.address.message}</h5>)}
            
            <div className='city-state'>
            <label className='city'>City
            <input {...register('city')}
            placeholder='City'
            type='text'
            aria-invalid={errors.city ? 'true' : 'false'} 
            />,
            </label>
            {errors.city?.type === 'required' &&
            (<h5 role='alert'>{errors.city.message}</h5>)}

            <label className='state'> State
            <input {...register('state')}
            placeholder='STATE'
            type='text'
            aria-invalid={errors.state ? 'true' : 'false'} 
            />
            </label>
            {errors.state?.type === 'required' &&
            (<h5 role='alert'>{errors.state.message}</h5>)}
            </div>

            <div className='lat-lon'>
            <label>Latitude
            <input {...register('lat', {required: true})}
            placeholder='Latitude'
            type='decimal'
            aria-invalid={errors.lat ? 'true' : 'false'} 
            />,
            </label>
            {errors.lat?.type === 'typeError' &&
            (<h5 role='alert'>Latitude must be within -90 and 90</h5>)}
            {errors.lat?.type === 'required' &&
            (<h5 role='alert'>{errors.lat.message}</h5>)}

            <label> Longitude
            <input {...register('lng', {required: true})}
            placeholder='Longitude'
            type='decimal'
            aria-invalid={errors.lng ? 'true' : 'false'} 
            />
            </label>
            {errors.lng?.type === 'typeError' &&
            (<h5 role='alert'>Longitude must be within -180 and 180</h5>)}
            {errors.lng?.type === 'required' &&
            (<h5 role='alert'>{errors.lng.message}</h5>)}
            </div>

            <div className='spot-description'>
            <h3>Describe your place to guests</h3>
            <p>Mention the best features of your space, any special amentities like
            fast wi-fi or parking, and what you love about the neighborhood.</p> 
            <label>Description
            <textarea {...register('description', {required: true})}
            placeholder='Please write at least 30 characters'
            aria-invalid={errors.description ? 'true' : 'false'}
            id='description'
            className='form-textarea' 
            />
            </label>
            {errors.description?.type === 'required' &&
            (<h5 role='alert'>{errors.description.message}</h5>)}
            {errors.description?.type === 'min' &&
            (<h5 role='alert'>Description needs 30 or more characters</h5>)}
            </div>

            <div className='spot-title'>
            <h3>Create a title for your spot</h3>
            <p>Catch guests&apos; attention with a spot title that highlights what makes
            your place special.</p>
            <label>Name
            <input {...register('name')}
            placeholder='Name of your spot'
            aria-invalid={errors.name ? 'true' : 'false'} 
            />
            </label>
            {errors.name?.type === 'required' &&
            (<h5 role='alert'>{errors.name.message}</h5>)} 
            {errors.name?.type === 'min' &&
            (<h5 role='alert'>*{errors.name.message}</h5>)}  
            </div>
            </div>

            <div className='spot-price'>
            <h3>Set a base price for your spot</h3>
            <p>Competitive pricing can help your listing stand out and rank higher
            in search results.</p>
    
            <label><b>$ </b> 
            <input {...register('price', {required: true})}
            placeholder='Price per night'
            />
            {errors.price?.type === 'typeError' &&
            (<h5 role='alert'>Price must be a positive number greater than 1.</h5>)}
            {errors.price?.type === 'required' &&
            (<h5 role='alert'>{errors.price.message}</h5>)}  
            </label>  
            </div>

            <div className='spot-photos'>
            <h3>Liven up your spot with photos</h3>
            <p>Submit a link to at least one photo to publish your spot.</p>

            <input {...register('previewImage')}
            placeholder='Preview Image URL'
            />
            {errors.previewImage?.type === 'required' &&
            (<h5 role='alert'>{errors.previewImage.message}</h5>)} 

            <input 
            // send to image array and separate error array
            placeholder='Image URL'
            />
            {errors.img1?.type === 'endsWith' && (<h5>Image URL must end in .png, .jpg, or .jpeg</h5>)}
            </div>

        <button type='submit'>Create Spot</button>
        </form>
        </div>
    )
}