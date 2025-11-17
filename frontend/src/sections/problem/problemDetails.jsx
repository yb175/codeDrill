import React, { useState } from "react";
import ProblemHeader from "./problemHeader";
import DescriptionView from "./descriptionview";
import DiscussionsView from "./discussview";

export default function ProblemDetails({
  title,
  breadcrumbs,
  tags,
  description,
  examples,
  hints,
  discussions
}) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="space-y-6">
      
      <ProblemHeader
        title={title}
        tags={tags}
        breadcrumbs={breadcrumbs}
      />

      {/* Tabs */}
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

      {/* Content */}
      {activeTab === "description" && (
        <DescriptionView
          description={description}
          examples={examples}
          hints={hints}
        />
      )}

      {activeTab === "discussions" && (
        <DiscussionsView discussions={discussions} />
      )}

    </div>
  );
}
