// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import AllSpots from './components/Spots/Spots';
// import SingleSpot from './components/SingleSpot/SingleSpot';
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
      <AllSpots />
      <SingleSpot />
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
        path: '*',
        element: <Navigate to='/' replace={true} />
      }
    ]
  }
  
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;