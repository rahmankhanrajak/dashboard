import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { useRefreshMutation } from '../store/authApi';
import { setAccessToken, setUser, authReady } from '../store/authSlice';
import type { RootState } from '../store/store';

function PersistLogin() {
  const dispatch = useDispatch();
  const [refresh] = useRefreshMutation();

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const isAuthReady = useSelector((state: RootState) => state.auth.isAuthReady);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        console.log('Attempting to refresh token on mount...');
        const result = await refresh().unwrap();

        if (result?.accessToken) {
          dispatch(setAccessToken(result.accessToken));
        }

        if (result?.user) {
          dispatch(setUser(result.user));
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
    return <div>Loading...</div>;
  }

  return <Outlet />;
}

export default PersistLogin;
