import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline, TrashIcon } from '@heroicons/react/24/outline';

function StarRating({ value }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) =>
                s <= value ? (
                    <StarIcon key={s} className="w-4 h-4 text-amber-400" />
                ) : (
                    <StarOutline key={s} className="w-4 h-4 text-slate-600" />
                )
            )}
        </div>
    );
}

function ReviewCard({ review, currentUserId, onDelete }) {
    const canDelete = currentUserId && review.student === currentUserId;

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center text-white text-xs font-bold">
                        {review.student_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">
                            {review.student_name || `User #${review.student}`}
                        </p>
                        <StarRating value={review.rating} />
                    </div>
                </div>
                {canDelete && (
                    <button
                        onClick={() => onDelete?.(review.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                )}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mt-2 ml-11">
                {review.comment}
            </p>
        </div>
    );
}

export { StarRating };
export default ReviewCard;
