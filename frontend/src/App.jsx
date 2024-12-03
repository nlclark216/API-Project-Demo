// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import AllSpots from './components/Spots/Spots';
import * as sessionActions from './store/session';
import SingleSpot from './components/SingleSpot/SingleSpot';


function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);
  


  return (
    <>
      <Navigation isLoaded={isLoaded}/>
      {isLoaded && <Outlet />}
    </>
  );
}


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <AllSpots />
      },
      {
        path: '/spots/:id',
        element: <SingleSpot />
      },
      {
        path: '/spots/new',
        element: <h1>Create a new Spot</h1>
      },
      {
        path: '*',
        element: <Navigate to='/' replace={true} />
      }
    ]
  }
  
]);

export default function App() {
  return (<RouterProvider router={router} />);
}
