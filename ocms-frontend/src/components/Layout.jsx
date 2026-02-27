import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {
    HomeIcon,
    AcademicCapIcon,
    ClipboardDocumentListIcon,
    PlusCircleIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

function NavItem({ to, icon: Icon, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
            }
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
        </NavLink>
    );
}

function Layout() {
    const { user, logout, isInstructor } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed inset-y-0 left-0 z-30">
                {/* Logo */}
                <div className="px-6 py-5 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                            <AcademicCapIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-white text-lg">OCMS</span>
                    </div>
                </div>

                {/* User Info */}
                <div className="px-4 py-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-700 flex items-center justify-center text-white font-bold text-sm uppercase">
                            {user?.username?.[0] || '?'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user?.username}</p>
                            <span className={user?.role === 'instructor' ? 'badge-instructor' : 'badge-student'}>
                                {user?.role || 'student'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    <NavItem to="/" icon={HomeIcon} label="Dashboard" />
                    <NavItem to="/courses" icon={AcademicCapIcon} label="Courses" />
                    <NavItem to="/enrollments" icon={ClipboardDocumentListIcon} label="Enrollments" />
                    {isInstructor && (
                        <NavItem to="/courses/new" icon={PlusCircleIcon} label="Create Course" />
                    )}
                </nav>

                {/* Logout */}
                <div className="px-3 py-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen bg-slate-950">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default Layout;
