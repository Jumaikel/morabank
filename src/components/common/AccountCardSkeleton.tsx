"use client";

export const AccountCardSkeleton = () => (
  <div
    className={`
      w-full max-w-2xl min-w-[400px] min-h-[250px]
      p-8 rounded-3xl
      bg-white border-2 border-neutral-950 shadow-2xl
      flex flex-col justify-between
      overflow-hidden mx-auto
      animate-pulse
    `}
    style={{
      background:
        "linear-gradient(135deg,rgba(255,255,255,0.97) 60%,rgba(220,240,255,0.98) 100%)",
    }}
  >
    {/* Row superior: chip y tipo */}
    <div className="flex justify-between items-center w-full mb-4">
      <div className="w-14 h-9 bg-neutral-200 rounded-md" />
      <div className="h-6 w-20 bg-neutral-200 rounded-full" />
    </div>

    {/* Número de cuenta */}
    <div className="flex justify-center items-center my-3">
      <div className="h-8 w-48 bg-neutral-200 rounded-md" />
    </div>

    {/* Balance y estado */}
    <div className="flex justify-between items-center mt-2 mb-4">
      <div className="flex flex-col space-y-2">
        <div className="h-3 w-16 bg-neutral-200 rounded" />
        <div className="h-5 w-24 bg-neutral-200 rounded" />
      </div>
      <div className="flex flex-col items-end space-y-2">
        <div className="h-3 w-10 bg-neutral-200 rounded" />
        <div className="h-5 w-16 bg-neutral-200 rounded" />
      </div>
    </div>

    {/* Titular, IBAN y logo */}
    <div className="flex justify-between items-end mt-2 w-full">
      <div className="flex flex-col space-y-2">
        <div className="h-3 w-12 bg-neutral-200 rounded" />
        <div className="h-5 w-28 bg-neutral-200 rounded" />
        <div className="h-3 w-10 bg-neutral-200 rounded" />
        <div className="h-4 w-40 bg-neutral-200 rounded" />
      </div>
      <div className="h-10 w-16 bg-neutral-200 rounded-lg" />
    </div>
  </div>
);
