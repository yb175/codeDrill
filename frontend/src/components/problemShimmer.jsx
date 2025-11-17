export default function ProblemTableShimmer() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-800 bg-[#111827]/70 p-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-10 bg-gray-700/30 rounded-md mb-3"
        ></div>
      ))}
    </div>
  );
}
