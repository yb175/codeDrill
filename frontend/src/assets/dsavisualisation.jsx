import {
  GitBranch,
  Cpu,
  Network,
  Database,
  Layers,
  Code2,
  CircuitBoard,
} from "lucide-react";

export default function DSAVisualization() {
  const icons = [GitBranch, Network, Cpu, Database, CircuitBoard, Code2];

  return (
    <div className="relative w-full h-[30rem] bg-gradient-to-b from-blue-950 via-black to-black rounded-3xl flex justify-center items-center overflow-hidden shadow-[0_0_100px_rgba(34,211,238,0.2)]">
      {/* Glowing Core Light */}
      <div className="absolute w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full" />

      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Node Grid Layout */}
      <div className="grid grid-cols-3 gap-16 z-10">
        {icons.map((Icon, i) => (
          <div
            key={i}
            className="relative flex justify-center items-center w-24 h-24 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 backdrop-blur-md hover:border-cyan-400 hover:scale-110 transition-all duration-500"
          >
            <Icon className="text-cyan-300 w-10 h-10 animate-pulse" />
            <div className="absolute inset-0 rounded-2xl shadow-[0_0_35px_rgba(34,211,238,0.3)] animate-ping-slow" />
          </div>
        ))}
      </div>
    </div>
  );
}