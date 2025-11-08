import ProblemManagement from "../../components/problemManagement";
import QuickTips from "../../components/quicktips";
import { useSelector } from "react-redux";
import { useState,useEffect } from "react";
import { useDispatch } from "react-redux";
import { getProblems } from "../../slice/problemSlice";
export default function ProblemsSection() {
  const loading = useSelector((state) => state.problem.loading);
  const count = useSelector((state) => state.problem.number);
  const data = useSelector((state) => state.problem.data);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 5;
  const totalPages = Math.ceil(count / limit);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProblems({ page, limit: 5 }));
  }, [page]);
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Problems Management (Main Column) */}
      <div className="lg:col-span-2">
        <ProblemManagement
          problemCount={count}
          problems={data}
          loading={loading}
          page={page}
          limit={5}
          totalPages={totalPages}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onPageChange={setPage}
        />
      </div>

      {/* Quick Tips (Sidebar) */}
      <div className="lg:col-span-1">
        <QuickTips />
      </div>
    </section>
  );
}
