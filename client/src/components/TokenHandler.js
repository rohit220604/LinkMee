import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TokenHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.dispatchEvent(new Event('authChange'));
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login');
    }
  }, [location, navigate]);
  return null;
};

export default TokenHandler;
