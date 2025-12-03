import React, { useState } from "react";
import ProblemHeader from "./problemHeader";
import DescriptionView from "./descriptionview";
import DiscussionsView from "./discussview";

export default function ProblemDetails({
  title,
  breadcrumbs,
  tags,

  // backend objects
  description,
  examples,
  hints,
  discussions
}) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <ProblemHeader
        title={title}
        tags={tags}
        breadcrumbs={breadcrumbs}
      />

      {/* TABS */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-4">

          <button
            onClick={() => setActiveTab("description")}
            className={`px-1 py-3 border-b-2 text-sm ${
              activeTab === "description"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            Description
          </button>

          <button
            onClick={() => setActiveTab("discussions")}
            className={`px-1 py-3 border-b-2 text-sm ${
              activeTab === "discussions"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            Discussions
          </button>

        </nav>
      </div>

      {/* CONTENT */}
      {activeTab === "description" && (
        <DescriptionView
          description={description}      // PASS FULL OBJECT
          visibleTestCases={examples}     // MATCHING DESCRIPTIONVIEW API
          hints={hints}
        />
      )}

      {activeTab === "discussions" && (
        <DiscussionsView discussions={discussions || []} />
      )}

    </div>
  );
}
