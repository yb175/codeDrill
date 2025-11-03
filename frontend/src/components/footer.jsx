const Footer = () => (
  <footer className="w-full bg-black/60 border-t border-purple-600/20 py-12 md:py-16 mt-20">
    <div className="max-w-7xl mx-auto px-6 text-gray-400 flex flex-col md:flex-row justify-between gap-10 md:gap-20">
      {/* Left section - Branding */}
      <div className="flex flex-col space-y-3">
        <h2 className="text-3xl font-bold text-white tracking-wide">
          Code<span className="text-purple-500">Drill</span>
        </h2>
        <p className="text-sm text-gray-500 max-w-xs">
          Built for devs who live for the grind. Compete. Learn. Dominate.
        </p>
        <div className="flex space-x-4 mt-2">
          <a href="#" className="hover:text-purple-400 transition">GitHub</a>
          <a href="#" className="hover:text-purple-400 transition">Medium</a>
          <a href="#" className="hover:text-purple-400 transition">Open Source</a>
        </div>
      </div>

      {/* Middle section - Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="text-white font-semibold mb-3">Platform</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-purple-400">Problems</a></li>
            <li><a href="#" className="hover:text-purple-400">Contests</a></li>
            <li><a href="#" className="hover:text-purple-400">Leaderboard</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Community</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-purple-400">Discord</a></li>
            <li><a href="#" className="hover:text-purple-400">Forum</a></li>
            <li><a href="#" className="hover:text-purple-400">Events</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Support</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-purple-400">Help</a></li>
            <li><a href="#" className="hover:text-purple-400">Contact</a></li>
            <li><a href="#" className="hover:text-purple-400">Report Bug</a></li>
          </ul>
        </div>
      </div>

      {/* Right section - Tagline */}
      <div className="flex flex-col justify-between">
        <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-6 text-center">
          <p className="text-lg font-semibold text-white">Join the Grind.</p>
          <p className="text-sm text-gray-400 mt-1">Level up your DSA skills every day.</p>
          <button className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm transition">
            Join Community
          </button>
        </div>
      </div>
    </div>

    {/* Bottom Copyright Bar */}
    <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-600 text-sm">
      © 2025 CodeDrill. Built for the ones who code till dawn ⚡
    </div>
  </footer>
);

export default Footer;
