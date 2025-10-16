/**
 * =========================================================
 * 🧠 FUNCTION DOCUMENTATION: storeProblemSemantic
 * =========================================================
 * @description
 * This function stores a problem’s semantic information (title + description)
 * into a Pinecone vector database. It uses Google Generative AI embeddings to 
 * convert the problem into a dense numerical vector representation for 
 * semantic similarity search in the future.
 * 
 * ---------------------------------------------------------
 * 📥 Input JSON Format:
 * {
 *   "title": "Product of Two Numbers",
 *   "description": "Given two integers, find their product and print the result.",
 *   "problemNumber": 102
 * }
 * 
 * 📤 Output JSON Format:
 * {
 *   "success": true,
 *   "message": "Problem 'Product of Two Numbers' stored in Pinecone with semantic vector."
 * }
 * 
 * ---------------------------------------------------------
 * 🧩 Key Details:
 * - Uses **text-embedding-004** model from Google Generative AI to generate embeddings.
 * - Stores each problem in **Pinecone** using **LangChain’s PineconeStore**.
 * - Embedding data is stored with metadata (title, description, problemNumber).
 * - Allows semantic duplicate detection and similarity search later.
 * =========================================================
 */
import { Document } from "langchain/document";
import { PineconeStore } from "@langchain/pinecone";
import dotenv from "dotenv" 
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
dotenv.config(); 

const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'text-embedding-004',
  });
const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
async function storeProblemSemantic({ title, description, problemNumber}) {
  const doc = new Document({
    pageContent: title + " " + description, // for embedding
    metadata: {
      title,
      description,
      problemNumber
    },
  });

  await PineconeStore.fromDocuments([doc], embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
  });

  console.log(`Problem "${title}" stored in Pinecone with semantic vector.`);
}

export default storeProblemSemantic ; 