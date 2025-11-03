// --- Feature Card Component ---
const FeatureCard = ({ icon: Icon, title }) => (
  <div className="p-6 bg-gray-900 border border-purple-900/60 rounded-xl shadow-2xl hover:border-purple-600/50 transition duration-500 ease-in-out transform hover:-translate-y-1 h-20 flex items-center">
    <div className="flex items-center space-x-4">
      <div className="p-2 rounded-full bg-purple-800/50 text-purple-400">
        <Icon size={16} />
      </div>
      <p className="text-white font-medium text-base">{title}</p>
    </div>
  </div>
);

export default FeatureCard;