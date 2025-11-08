import StatCard from "../../components/starCard";
import { FileText, Bot, FilePlus } from "lucide-react";
import { useSelector } from "react-redux";
export default function Stats() {
  const problemCount = useSelector((state)=>state.problem.number) ;
  const loading = useSelector((state)=>state.problem.loading)
  return (
    <section className="mb-8">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Skeleton Loaders */}
          <div className="h-24 bg-neutral-800 rounded-lg animate-pulse border border-neutral-700"></div>
          <div className="h-24 bg-neutral-800 rounded-lg animate-pulse border border-neutral-700"></div>
          <div className="h-24 bg-neutral-800 rounded-lg animate-pulse border border-neutral-700"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Problems"
            value={problemCount}
            icon={FileText}
            bgColorClass="bg-neutral-800/50"
          />
          <StatCard
            title="Premium Users"
            value="-"
            icon={Bot}
            bgColorClass="bg-neutral-800/50"
          />
          <StatCard
            title="Active Users"
            value="-"
            icon={FilePlus}
            bgColorClass="bg-neutral-800/50"
          />
        </div>
      )}
    </section>
  );
}
