import PricingCard from "../../components/pricingcard";
export default function PricingSection(){
    return(
        <section className="mb-24">
      <h2 className="text-3xl font-bold text-white mb-4">Premium</h2>
      <p className="text-gray-400 mb-10 max-w-2xl">
        Choose the plan that unlocks your next level.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <PricingCard
          title="Free Plan"
          price="€0"
          priceDetail=""
          features={["Basic problems", "Limited contests"]}
          buttonText="Get Started"
          isPrimary={false}
        />

        {/* Pro Plan */}
        <PricingCard
          title="Pro Plan"
          price="€299"
          priceDetail="/month"
          features={["All Hints", "AI Interview Prep", "Custom contests"]}
          buttonText="Upgrade to Pro"
          isPrimary={true}
        />

        {/* Elite Plan */}
        <PricingCard
          title="Elite Plan"
          price="€599"
          priceDetail="/month"
          features={["Mock Interviews", "1:1 mentorship", "All summaries"]}
          buttonText="Go Elite"
          isPrimary={false}
        />
      </div>
    </section>

    )
}