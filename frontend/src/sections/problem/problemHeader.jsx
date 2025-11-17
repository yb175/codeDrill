import React from "react";
import { ChevronRight } from "lucide-react";

export default function ProblemHeader({ title, tags, breadcrumbs }) {
  return (
    <div className="space-y-4">

      {/* Breadcrumbs */}
      <nav className="flex text-sm" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-1 text-gray-400">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.name} className="flex items-center">
              <a href={crumb.href} className="hover:text-white">{crumb.name}</a>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="ml-1 h-4 w-4" />
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Title */}
      <h1 className="text-2xl font-bold text-white">{title}</h1>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.name}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tag.color}`}
          >
            {tag.name}
          </span>
        ))}
      </div>

    </div>
  );
}
