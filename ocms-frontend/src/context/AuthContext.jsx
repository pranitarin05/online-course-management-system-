import { createContext, useState, useCallback, useEffect } from 'react';
import { login as loginApi } from '../api/auth';
import { getProfiles } from '../api/profiles';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);       // { id, username, role }
    const [profile, setProfile] = useState(null); // full Profile object
    const [loading, setLoading] = useState(true);

    // ── Bootstrap: re-hydrate from localStorage on page reload ────────────────
    useEffect(() => {
        const access = localStorage.getItem('access');
        const storedUser = localStorage.getItem('user');
        if (access && storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUser(parsed);
            } catch {
                localStorage.clear();
            }
        }
        setLoading(false);
    }, []);

    // ── Fetch the profile for the logged-in user ───────────────────────────────
    const fetchMyProfile = useCallback(async (username) => {
        try {
            // accounts/ returns a paginated list; we iterate pages to find our user
            let url = '/accounts/';
            let found = null;
            // Keep fetching pages until we find the profile or run out of pages
            let res = await getProfiles({ page: 1 });
            const checkList = (results) =>
                results.find((p) => p.user === username || p.user?.username === username);

            found = checkList(res.data.results || []);
            while (!found && res.data.next) {
                res = await getProfiles({ page: res.data.next });
                found = checkList(res.data.results || []);
            }
            if (found) {
                setProfile(found);
                return found;
            }
        } catch (e) {
            console.warn('Could not fetch profile:', e);
        }
        return null;
    }, []);

    // ── Login ──────────────────────────────────────────────────────────────────
    const login = useCallback(async (username, password) => {
        const res = await loginApi(username, password);
        const { access, refresh } = res.data;
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);

        // Decode JWT payload to get user id (without external library)
        const payload = JSON.parse(atob(access.split('.')[1]));
        const userBase = {
            id: payload.user_id,
            username: payload.username || username,
            role: 'student', // default until profile fetched
        };

        setUser(userBase);
        localStorage.setItem('user', JSON.stringify(userBase));

        // Fetch real role from profile
        const prof = await fetchMyProfile(userBase.username);
        if (prof) {
            const updated = { ...userBase, role: prof.role, profileId: prof.id };
            setUser(updated);
            setProfile(prof);
            localStorage.setItem('user', JSON.stringify(updated));
        }

        return userBase;
    }, [fetchMyProfile]);

    // ── Logout ─────────────────────────────────────────────────────────────────
    const logout = useCallback(() => {
        localStorage.clear();
        setUser(null);
        setProfile(null);
    }, []);

    const isAuthenticated = Boolean(user && localStorage.getItem('access'));
    const isInstructor = user?.role === 'instructor';
    const isStudent = user?.role === 'student';

    return (
        <AuthContext.Provider
            value={{ user, profile, loading, login, logout, isAuthenticated, isInstructor, isStudent }}
        >
            {children}
        </AuthContext.Provider>
    );
}
