export const LoginFormSkeleton = () => {
  return (
    <div className="relative flex flex-col md:flex-row w-full max-w-4xl rounded-xl shadow-lg overflow-hidden bg-white animate-pulse">
      <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-neutral-300 z-10" />

      <div className="w-full md:w-1/2 flex items-center justify-center order-1 md:order-2 px-6 py-12 bg-neutral-100">
        <div className="relative w-40 h-40 md:w-72 md:h-72 rounded-full bg-neutral-300" />
      </div>

      <div className="w-full md:w-1/2 px-6 md:px-12 py-12 md:py-32 space-y-6 order-2 md:order-1">
        <div className="h-8 w-3/4 mx-auto bg-neutral-300 rounded" />

        <div className="space-y-2">
          <div className="h-4 w-24 bg-neutral-300 rounded" />
          <div className="h-10 w-full bg-neutral-200 rounded" />
        </div>

        <div className="space-y-2">
          <div className="h-4 w-20 bg-neutral-300 rounded" />
          <div className="h-10 w-full bg-neutral-200 rounded" />
        </div>

        <div className="h-4 w-32 ml-auto bg-neutral-300 rounded" />

        <div className="h-10 w-40 bg-neutral-300 rounded" />
      </div>
    </div>
  )
}
