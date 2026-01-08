import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { useRefreshMutation } from '../store/authApi';
import { setAccessToken, authReady } from '../store/authSlice';
import type { RootState } from '../store/store';

function PersistLogin() {
  const dispatch = useDispatch();
  const [refresh] = useRefreshMutation();
  const isAuthReady = useSelector((state: RootState) => state.auth.isAuthReady);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        console.log('Attempting to refresh token on mount...');
        const result = await refresh().unwrap();
        
        if (result.accessToken) {
          console.log('Token refreshed successfully');
          dispatch(setAccessToken(result.accessToken));
        }
      } catch (err) {
        console.log('No valid refresh token found');
      } finally {
        dispatch(authReady());
      }
    };

    if (!accessToken && !isAuthReady) {
      verifyRefreshToken();
    } else if (!isAuthReady) {
      dispatch(authReady());
    }
  }, []);

  if (!isAuthReady) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return <Outlet />;
}

export default PersistLogin;