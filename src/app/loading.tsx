export default function GlobalLoading() {
  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-[2.4rem] px-6 py-8 md:px-10 md:py-12">
        <div className="skeleton-block h-6 w-40 rounded-full" />
        <div className="mt-6 space-y-4">
          <div className="skeleton-block h-14 w-full max-w-3xl rounded-2xl" />
          <div className="skeleton-block h-5 w-full max-w-2xl rounded-full" />
          <div className="skeleton-block h-5 w-[80%] max-w-xl rounded-full" />
        </div>
        <div className="mt-8 flex gap-3">
          <div className="skeleton-block h-12 w-40 rounded-full" />
          <div className="skeleton-block h-12 w-40 rounded-full" />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {[0, 1].map((item) => (
          <section key={item} className="glass-panel rounded-[2rem] p-6">
            <div className="skeleton-block h-8 w-52 rounded-xl" />
            <div className="mt-3 skeleton-block h-4 w-72 rounded-full" />
            <div className="mt-6 grid gap-3">
              {[0, 1, 2].map((card) => (
                <div key={card} className="skeleton-block h-24 rounded-[1.4rem]" />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
