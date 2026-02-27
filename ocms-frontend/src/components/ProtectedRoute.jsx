import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

function ProtectedRoute({ instructorOnly = false }) {
    const { isAuthenticated, isInstructor, loading } = useAuth();

    if (loading) return <LoadingSpinner fullscreen />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (instructorOnly && !isInstructor)
        return <Navigate to="/" replace />;

    return <Outlet />;
}

export default ProtectedRoute;
