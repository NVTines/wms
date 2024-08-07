import { Outlet, useNavigate } from 'react-router-dom';
import BaseLayout from './BaseLayout';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/redux/features/auth/auth.slice';

export default function AuthLayout() {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);
  return (
    !user && (
      <BaseLayout>
        <Outlet />
      </BaseLayout>
    )
  );
}
