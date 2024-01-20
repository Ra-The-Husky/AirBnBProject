import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import LandingPage from './components/LandingPage/LandingPage';
import SpotInfo from './components/SpotInfo/SpotInfo'
import NewSpotForm from './components/NewSpot/NewSpotForm'

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
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
        element: <LandingPage />
      },
      {
        path: '/spots/:spotId',
        element: <SpotInfo />
      },
      {
        path: '/spots/new',
        element: <NewSpotForm />
      },
      {
        path: '*',
        element: <h2>What you are looking for, cannot be found</h2>
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
