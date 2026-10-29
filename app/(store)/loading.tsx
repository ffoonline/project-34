export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="h-8 w-40 bg-muted" />
      <div className="mt-6 h-16 w-2/3 max-w-md bg-muted" />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="aspect-[3/4] bg-muted" />
        ))}
      </div>
    </div>
  );
}
