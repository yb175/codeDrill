import React from "react";
import AccordionItem from "../../assets/AccordationItem";
import { XCircle, CheckCircle2 } from "lucide-react";

export default function DescriptionView({ description, examples, hints }) {
  return (
    <div className="space-y-8">

      {/* Problem Description */}
      <div className="prose prose-invert max-w-none text-gray-300">
        {description.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* Examples */}
      <AccordionItem title="Examples / Testcases" defaultOpen={true}>
        {examples.map((ex) => (
          <div key={ex.id} className="bg-gray-800/50 rounded-lg p-4 space-y-2">
            
            <p className="font-medium text-white">Example {ex.id}</p>

            <div className="font-mono text-sm">
              <strong className="text-gray-400">Input:</strong> {ex.input}
            </div>

            <div className="font-mono text-sm">
              <strong className="text-gray-400">Output:</strong> {ex.output}
            </div>

            <div className="flex items-start space-x-2 text-gray-400 pt-2 text-sm">
              {ex.output === "0" ? <XCircle /> : <CheckCircle2 />}
              <p>{ex.explanation}</p>
            </div>

          </div>
        ))}
      </AccordionItem>

      {/* Hints */}
      <AccordionItem title="Hints">
        <ul className="space-y-2 text-gray-300 list-disc list-inside">
          {hints.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </AccordionItem>

    </div>
  );
}
