import { Link } from 'react-router-dom';
import {
    AcademicCapIcon,
    CurrencyDollarIcon,
    TagIcon,
    PencilSquareIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';

function CourseCard({ course, isInstructor, onDelete }) {
    return (
        <div className="card group hover:border-primary-700 transition-all duration-200 flex flex-col">
            {/* Category badge */}
            <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-400 bg-primary-500/10 border border-primary-500/20 px-2.5 py-1 rounded-full">
                    <TagIcon className="w-3.5 h-3.5" />
                    {course.category || 'General'}
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold text-sm">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    {course.price ?? '0'}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-white font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary-300 transition-colors">
                {course.title}
            </h3>

            {/* Description */}
            <p className="text-slate-400 text-sm line-clamp-3 flex-1 mb-4">
                {course.description || 'No description provided.'}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <AcademicCapIcon className="w-4 h-4" />
                    <span>Instructor #{course.instructor}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        to={`/courses/${course.id}`}
                        className="text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors"
                    >
                        View →
                    </Link>
                    {isInstructor && (
                        <>
                            <Link
                                to={`/courses/${course.id}/edit`}
                                className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-all"
                                title="Edit"
                            >
                                <PencilSquareIcon className="w-4 h-4" />
                            </Link>
                            <button
                                onClick={() => onDelete?.(course.id)}
                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                title="Delete"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CourseCard;
