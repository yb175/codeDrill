import DSAVisualization from "../../assets/dsavisualisation";
import { Sparkles, Feather, User, BarChart2, Code, GitBranch, Shield } from "lucide-react";
import FeatureCard from "../../components/featurecard";
function Hero() {
  return (
    <section className="grid md:grid-cols-2 gap-12 items-start mb-24">
      {/* Left Content: Text and IDE Mock */}
      <div className="space-y-6">
        {/* Mock IDE Snippet */}
        <div className="bg-gray-900 p-4 rounded-xl border border-purple-900 shadow-xl max-w-sm">
          <p className="text-sm text-green-400 mb-1">
            <span className="text-purple-400">$ </span>Initializing custom
            contest environment...
          </p>
          <p className="text-lg text-white font-mono my-2">
            Welcome to Code drill{" "}
            <Sparkles size={16} className="inline text-yellow-400" />
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Ready to challenge your algorithms?
          </p>
          <div className="flex space-x-4">
            <button className="flex-1 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition">
              Start Coding
            </button>
            <button className="flex-1 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition">
              Try AI Interview
            </button>
          </div>
        </div>

        {/* Unique Features Title */}
        <h2 className="text-3xl font-bold text-white pt-8">Unique Features</h2>
        <p className="text-gray-400 max-w-xl">
          Build your own path with AI-personalized problem sets and competitive
          tools.
        </p>

        {/* Feature Grid - Part 1 (Matching the two columns in the image) */}
        <div className="grid grid-cols-2 gap-4">
          <FeatureCard
            icon={Feather}
            title="Custom Contests on chosen topics"
          />
          <FeatureCard icon={User} title="AI Interview Assistant" />
          <FeatureCard
            icon={BarChart2}
            title="Contest Rooms with Leaderboards"
          />
          <FeatureCard icon={Shield} title="Personalized DSA Sheet" />
          <FeatureCard icon={Code} title="Interactive Code Summaries" />
          <FeatureCard
            icon={Sparkles}
            title="AI-generated Hints from User Discussions"
          />
          <FeatureCard icon={GitBranch} title="Algorithm Comparison Tool" />
        </div>
      </div>

      <DSAVisualization />
    </section>
  );
}

export default Hero;