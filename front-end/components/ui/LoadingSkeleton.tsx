/**
 * Loading Skeleton Components
 * Reusable skeleton loaders following Apple design aesthetic
 */

interface SkeletonProps {
    className?: string;
}

/**
 * Base skeleton element with shimmer animation
 */
export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-apple-gray-100 rounded-lg ${className}`}
            aria-hidden="true"
        />
    );
}

/**
 * Skeleton for event/content cards
 */
export function CardSkeleton() {
    return (
        <div className="apple-card h-full flex flex-col overflow-hidden" aria-busy="true" aria-label="Loading content">
            <Skeleton className="h-35 w-full rounded-none" />
            <div className="p-5 flex-1 flex flex-col space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="mt-auto space-y-2">
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
            </div>
        </div>
    );
}

/**
 * Skeleton for table rows
 */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
    return (
        <tr className="border-b border-apple-gray-50">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <Skeleton className="h-4 w-full" />
                </td>
            ))}
        </tr>
    );
}

/**
 * Complete table skeleton
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <div className="overflow-x-auto" aria-busy="true" aria-label="Loading table">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-apple-gray-50/50 border-b border-apple-gray-100">
                        {Array.from({ length: columns }).map((_, i) => (
                            <th key={i} className="px-6 py-4">
                                <Skeleton className="h-3 w-20" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <TableRowSkeleton key={i} columns={columns} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/**
 * Skeleton for form fields
 */
export function FormFieldSkeleton() {
    return (
        <div className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-12 w-full rounded-xl" />
        </div>
    );
}

/**
 * Complete form skeleton
 */
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
    return (
        <div className="space-y-5" aria-busy="true" aria-label="Loading form">
            {Array.from({ length: fields }).map((_, i) => (
                <FormFieldSkeleton key={i} />
            ))}
            <Skeleton className="h-11 w-full rounded-full mt-6" />
        </div>
    );
}

/**
 * Skeleton for stat cards
 */
export function StatCardSkeleton() {
    return (
        <div className="apple-card p-6" aria-busy="true" aria-label="Loading statistics">
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-9 w-16" />
        </div>
    );
}

/**
 * Skeleton for user profile header
 */
export function ProfileHeaderSkeleton() {
    return (
        <div className="flex items-center gap-5" aria-busy="true" aria-label="Loading profile">
            <Skeleton className="w-16 h-16 rounded-[20px]" />
            <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-3 w-20" />
            </div>
        </div>
    );
}

/**
 * Grid of card skeletons
 */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" aria-busy="true" aria-label="Loading events">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}
