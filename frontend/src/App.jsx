// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navigation from './components/Navigation';
import AllSpots from './components/Spots/Spots';
import SingleSpot from './components/SingleSpot/SingleSpot';
import * as sessionActions from './store/session';


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
        element: <AllSpots />,
      },
      {
        path: '/spots',
        element: <AllSpots />,
        children: [
          {
            path: '/new'
          },
          {
            path: '/:id',
            element: <SingleSpot />
          }
        ]
      }
    ]
  }
  
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;