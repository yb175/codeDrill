import { Sparkles, Feather, Clock, Code } from "lucide-react";
export default function Journey(){
    return (
        <section className="mb-24">
      <h2 className="text-3xl font-bold text-white mb-4">Your Journey</h2>
      <p className="text-gray-400 mb-10 max-w-2xl">
        Here curated by the best, guided by AI.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-900/70 p-6 rounded-2xl border border-purple-900 shadow-2xl">
        {[
          { icon: Clock, label: "Choose Topics" },
          { icon: Feather, label: "Generate Custom Content" },
          { icon: Sparkles, label: "Analyze & Improve with AI" },
          { icon: Code, label: "Compete & Compare" },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center space-y-3 text-center p-3"
          >
            <div className="p-4 rounded-full bg-purple-700/50 text-purple-300">
              <item.icon size={20} />
            </div>
            <p className="text-sm font-semibold text-white">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
    )
}