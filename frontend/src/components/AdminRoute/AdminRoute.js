import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import NotFound from '../NotFound/NotFound';
import { useNavigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      const storedUser = JSON.parse(sessionStorage.getItem('user')); // Check sessionStorage
      if (storedUser && storedUser.isAdmin) {
        console.log("User from sessionStorage:", storedUser);
      } else if (!storedUser) {
        navigate('/login'); // Redirect to login if user doesn't exist
      }
    }
    setLoading(false);
  }, [user, navigate]);

  if (loading) return null;

  if (!user) return null;

  if (!user.isAdmin) {
    return (
      <NotFound
        linkRoute="/"
        linkText="Go to Homepage"
        message="You don't have access to this page"
      />
    );
  }

  return (
    <>
      {children} {/* Admin-specific content */}
    </>
  );
}

export default AdminRoute;
