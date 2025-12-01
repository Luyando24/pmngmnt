import { useNavigate } from 'react-router-dom';
import { getSession } from '@/lib/auth';

/**
 * Hook for handling application links that require authentication.
 * Returns a function that redirects to citizen dashboard if logged in,
 * or to login page if not authenticated.
 */
export function useAppNavigation() {
    const navigate = useNavigate();

    const handleAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const session = getSession();

        if (session && session.role === 'resident') {
            navigate('/citizen/dashboard');
        } else {
            navigate('/login');
        }
    };

    return handleAppClick;
}
