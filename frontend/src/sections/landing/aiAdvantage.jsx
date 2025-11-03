import { RefreshCcw } from "lucide-react";
export default function AIAdvantageSection(){
    return(
        <section className="mb-24">
      <h2 className="text-3xl font-bold text-white mb-8">AI Advantage</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative h-80 rounded-xl bg-gradient-to-br from-purple-900/60 to-gray-900/60 border border-purple-900/60 p-6">
          {/* Mock data visualization (Simplified) */}
          <div className="w-full h-full flex justify-center items-center">
            <RefreshCcw
              size={48}
              className="text-purple-400 opacity-50 animate-spin"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-900 rounded-xl border border-purple-900 shadow-xl">
            <p className="text-lg font-bold text-white">Hints</p>
          </div>
          <div className="p-4 bg-gray-900 rounded-xl border border-purple-900 shadow-xl">
            <p className="text-lg font-bold text-white">Code Summaries</p>
          </div>
          <div className="p-4 bg-gray-900 rounded-xl border border-purple-900 shadow-xl">
            <p className="text-lg font-bold text-white">Interview Q&A</p>
          </div>
        </div>
      </div>
    </section>
    )
}