import React from "react";
import ProblemDetails from "./problemDetails";
import EditorPanel from "./editorPanel";
export default function ProblemWorkspace() {
  const problemData = {
    title: "121. Best Time to Buy and Sell Stock",
    breadcrumbs: [
      { name: "Problems", href: "#" },
      { name: "Arrays", href: "#" },
      { name: "Best Time to Buy and Sell Stock", href: "#" },
    ],
    tags: [
      { name: "Easy", color: "bg-green-700/20 text-green-400" },
      { name: "Array", color: "bg-gray-700/20 text-gray-400" },
      { name: "Dynamic Programming", color: "bg-gray-700/20 text-gray-400" },
    ],
    description: [
      "You are given an array prices where prices[i] is the price of a given stock on the ith day.",
      "You want to maximize profit by choosing a day to buy and a future day to sell.",
      "Return the maximum profit possible. If no profit is possible, return 0."
    ],
    examples: [
      {
        id: 1,
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy on day 2 and sell on day 5 → profit = 5."
      },
      {
        id: 2,
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation: "No profitable transaction possible."
      }
    ],
    hints: [
      "Track minimum price seen so far.",
      "Profit = current price - min price so far."
    ],
    defaultCode: `class Solution:
    def maxProfit(self, prices):
        min_price = float('inf')
        max_profit = 0
        
        for p in prices:
            if p < min_price:
                min_price = p
            else:
                max_profit = max(max_profit, p - min_price)
        
        return max_profit`,
    language: "Python 3"
  };

  const discussions = [
    { id: 1, title: "O(n) solution explained", author: "coderx", posts: 42, votes: 102, tags: ["solution"] },
    { id: 2, title: "DP approach timing out", author: "newbie", posts: 15, votes: 7, tags: ["dp"] },
  ];

  return (
    <main className="flex h-full overflow-hidden">

      {/* LEFT */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:w-1/2">
        <ProblemDetails
          title={problemData.title}
          breadcrumbs={problemData.breadcrumbs}
          tags={problemData.tags}
          description={problemData.description}
          examples={problemData.examples}
          hints={problemData.hints}
          discussions={discussions}
        />
      </div>

      {/* RIGHT */}
      <div className="hidden lg:flex flex-col flex-1 border-l border-gray-700 lg:w-1/2">
        <EditorPanel
          defaultCode={problemData.defaultCode}
          language={problemData.language}
        />
      </div>

    </main>
  );
}
