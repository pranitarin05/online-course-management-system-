function LoadingSpinner({ fullscreen = false, size = 'md' }) {
    const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

    const spinner = (
        <div className={`${sizes[size]} border-2 border-primary-600 border-t-transparent rounded-full animate-spin`} />
    );

    if (fullscreen) {
        return (
            <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-3">
                    {spinner}
                    <p className="text-slate-400 text-sm">Loading…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-16">
            {spinner}
        </div>
    );
}

export default LoadingSpinner;
