import React from "react";

export default function DiscussionsView({ discussions }) {
  return (
    <div className="space-y-4">

      <h2 className="text-xl font-semibold text-white">Discussions</h2>

      {discussions.map((post) => (
        <div
          key={post.id}
          className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800"
        >
          <a className="text-blue-400 text-base hover:underline">
            {post.title}
          </a>

          <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
            <span>
              {post.votes} votes • {post.posts} posts • by {post.author}
            </span>
            <div className="flex space-x-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}

    </div>
  );
}
