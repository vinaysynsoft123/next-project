export default function ProductDetailSkeleton() {
    return (
        <div className="bg-zinc-50 dark:bg-black min-h-screen animate-pulse">
            <div className="mx-auto max-w-7xl px-6 py-16">
                {/* Breadcrumb Skeleton */}
                <div className="mb-8 flex gap-2">
                    <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                    <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                    <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                    <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                    <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
                    {/* IMAGE Skeleton */}
                    <div className="rounded-2xl bg-white dark:bg-zinc-900 p-10 shadow">
                        <div className="aspect-square w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl"></div>
                    </div>

                    {/* DETAILS Skeleton */}
                    <div className="space-y-6">
                        <div className="h-10 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                        <div className="h-8 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>

                        <div className="space-y-3">
                            <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                            <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                            <div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                        </div>

                        {/* ACTIONS Skeleton */}
                        <div className="flex gap-4 pt-4">
                            <div className="h-12 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                            <div className="h-12 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                        </div>

                        {/* EXTRA INFO Skeleton */}
                        <div className="mt-10 border-t border-zinc-200 dark:border-zinc-800 pt-6 space-y-4">
                            <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                            <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                            <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Similar Products Title Skeleton */}
                <div className="mt-20 h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-8"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-xl bg-white dark:bg-zinc-900 shadow p-0 overflow-hidden">
                            <div className="h-64 w-full bg-zinc-100 dark:bg-zinc-800"></div>
                            <div className="p-5 space-y-3">
                                <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                                <div className="h-4 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
