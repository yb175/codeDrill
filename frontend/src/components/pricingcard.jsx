// --- Pricing Card Component ---
const PricingCard = ({
  title,
  price,
  features,
  buttonText,
  isPrimary,
  priceDetail,
}) => {
  const primaryClasses =
    "bg-purple-800/30 border-purple-600 shadow-purple-600/50";
  const secondaryClasses = "bg-gray-900 border-purple-900/60 shadow-none";
  const buttonPrimary = "bg-purple-600 hover:bg-purple-700";
  const buttonSecondary = "bg-gray-700 hover:bg-gray-600";

  return (
    <div
      className={`p-8 rounded-2xl border-2 ${
        isPrimary ? primaryClasses : secondaryClasses
      } transition duration-300 hover:shadow-2xl`}
    >
      <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
      <p className="text-3xl font-extrabold text-white mb-6">
        {price}
        <span className="text-sm font-medium text-gray-500">{priceDetail}</span>
      </p>

      <ul className="space-y-3 mb-8 text-gray-300 text-sm">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-2">
            <svg
              className="w-4 h-4 text-green-400 flex-shrink-0 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-2 font-semibold text-white rounded-lg transition duration-300 ${
          isPrimary ? buttonPrimary : buttonSecondary
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
};
export default PricingCard;