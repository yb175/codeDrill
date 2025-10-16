/**
 * =========================================================
 * 🧠 FUNCTION DOCUMENTATION: getThreshhold
 * =========================================================
 * @description
 * Compares the semantic similarity between a new problem (title + description)
 * and existing problems stored in the Pinecone vector database. 
 * It uses Google Generative AI embeddings to convert text into numerical vectors 
 * and then queries Pinecone for the most similar problems based on cosine similarity.
 * 
 * ---------------------------------------------------------
 * 📥 Input JSON Format:
 * {
 *   "title": "Product of Two Numbers",
 *   "description": "Given two integers, find their product and print the result."
 * }
 * 
 * 📤 Output JSON Format:
 * {
 *   "threshhold": 0.84,                // Highest semantic similarity score found
 *   "problem": {                       // Metadata of the closest-matching problem
 *     "title": "Multiply Two Integers",
 *     "description": "Calculate the multiplication of two integers.",
 *     "difficulty": "easy",
 *     "problemCreator": "68e699b97952561e65c81cc5"
 *   }
 * }
 * 
 * ---------------------------------------------------------
 * 🧩 Key Details:
 * - Uses **text-embedding-004** model from Google Generative AI.
 * - Queries **top 5** most similar problems in Pinecone.
 * - Caps the similarity score at **0.87** to avoid false positives.
 * - Returns both the best match metadata and the final similarity threshold.
 * =========================================================
 */
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
dotenv.config();

// Initialising embedding
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "text-embedding-004",
});

const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

async function getThreshhold({ title, description }) {
  const detailsVector = await embeddings.embedQuery(title + " " + description);
  
  // Query multiple top results to catch near-duplicates
  const searchResults = await pineconeIndex.query({
    topK: 5,
    vector: detailsVector,
    includeMetadata: true,
  });

  let threshhold = 0.80;
  let problem = null;

  if (searchResults.matches && searchResults.matches.length > 0) {
    // Find the highest similarity score among the results
    const bestMatch = searchResults.matches.reduce((prev, curr) => 
      curr.score > prev.score ? curr : prev
    );

    problem = bestMatch.metadata;
    threshhold = Math.min(bestMatch.score, 0.87); // cap at 0.87
  }

  return { threshhold, problem };
}

export default getThreshhold;