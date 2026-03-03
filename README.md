# ⚡ CodeDrill

> A full-stack competitive programming platform with AI-powered problem management, multi-language code execution, and real-time verdict analysis — built from scratch.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-99.6%25-yellow)](https://github.com/yb175/codeDrill)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-5-000000)](https://expressjs.com)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Key Technical Highlights](#-key-technical-highlights)
- [Database Models](#-database-models)
- [License](#-license)

---

## 🧠 Overview

**CodeDrill** is a LeetCode-inspired online judge where users can browse coding problems, write solutions in multiple languages, run code against test cases, and receive automated verdicts. Admins can create and manage problems through a dedicated panel, with AI-powered semantic duplicate detection ensuring problem quality.

### What Makes It Different?

- 🤖 **AI-Powered Duplicate Detection** — Uses vector embeddings to detect semantically similar problems before they're added
- 🔧 **Custom Code Runner Engine** — Dynamically generates language-specific runner programs that wrap user solutions with I/O parsing, data structure helpers, and output serialization
- 🛡️ **Production-Grade Security** — JWT token blacklisting via Redis, sliding window rate limiting, role-based access control
- ⚡ **Submission Caching** — SHA-256 based cache keys to skip redundant Judge0 API calls

---

## ✨ Features

### For Users
- 📝 Browse problems by difficulty (Easy / Medium / Hard), tags, and company
- 💻 Write code in **C++, Python, Java, JavaScript** with syntax highlighting (CodeMirror + Dracula theme)
- ▶️ **Run** code against visible test cases or **Submit** against hidden test cases
- 📊 Detailed verdicts: Accepted, Wrong Answer, TLE, Runtime Error, Compilation Error
- 🔍 View test case diffs — expected vs actual output
- 📈 Track solved problems on your profile
- 🔐 Register with email verification, login with password or magic link

### For Admins
- ➕ Create problems with rich Markdown descriptions, hints, tags, and image support
- ✅ Reference solution auto-validation against Judge0 before problem is saved
- 🧠 AI semantic check prevents duplicate/similar problems from being added
- ✏️ Edit existing problems with live preview
- 📊 Dashboard with problem statistics

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite 7, TailwindCSS 4, DaisyUI, Redux Toolkit, CodeMirror 6, Framer Motion, React Router 7 |
| **Backend** | Express 5 (ESM), Node.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Caching & Queues** | Redis, IORedis, BullMQ |
| **Code Execution** | Judge0 CE (via RapidAPI) — batch submission API |
| **AI / Embeddings** | LangChain, Google Gemini Embeddings (`text-embedding-004`), Pinecone Vector DB |
| **Auth** | JWT (httpOnly cookies), bcrypt, Nodemailer |
| **Validation** | Zod (frontend), custom validators (backend) |

---

## 🏗 Architecture

```
┌─────────────────────┐     REST API      ┌─────────────────────┐
│                     │  (JSON + Cookies)  │                     │
│   React Frontend    │◄────────────────►  │   Express Backend   │
│   (Vite + Redux)    │                    │   (ESM Modules)     │
│                     │                    │                     │
└─────────────────────┘                    └──────┬──────────────┘
                                                  │
                    ┌─────────────────────────────┼──────────────────────────┐
                    │                             │                          │
                    ▼                             ▼                          ▼
           ┌───────────────┐            ┌─────────────────┐        ┌────────────────┐
           │   MongoDB     │            │     Redis        │        │   Judge0 CE    │
           │  (Problems,   │            │  (Cache, Rate    │        │  (RapidAPI)    │
           │   Users,      │            │   Limit, Token   │        │  Code Runner   │
           │   Submissions)│            │   Blacklist)     │        │                │
           └───────────────┘            └─────────────────┘        └────────────────┘
                                                                            │
                    ┌───────────────────────────────────────────────────────┘
                    │
                    ▼
           ┌────────────────────┐
           │   Pinecone + Gemini│
           │   (Semantic Search │
           │    & Embeddings)   │
           └────────────────────┘
```

### Request Flow for Code Submission

```
User writes code → Frontend dispatches Redux action
    → POST /submissions/ (with JWT cookie)
        → checkBlackList middleware (verify JWT, check Redis blacklist)
        → ratelimiter middleware (Redis sorted set sliding window)
        → fetchProblem middleware (load problem from Redis/MongoDB)
        → submitCode controller:
            1. Check Redis cache (SHA-256 key: code + problemNumber + language)
            2. If cache miss → batch submit to Judge0
            3. Poll Judge0 with exponential backoff (max 20 attempts)
            4. Aggregate results (runtime, memory, pass/fail)
            5. Update submission in MongoDB
            6. Cache result in Redis (1hr TTL)
            7. Update user's solved problems list
            8. Return verdict to frontend
```

---

## 📁 Project Structure

```
codeDrill/
├── Backend/
│   ├── config/
│   │   ├── mongooseConfig.js          # MongoDB connection
│   │   └── redisConfig.js             # Redis connection
│   ├── controllers/
│   │   ├── auth/
│   │   │   ├── register-user.js       # Registration + email verification
│   │   │   ├── loginWithPassword.js   # Password-based login
│   │   │   ├── sendConfirmationMail.js # Magic link login
│   │   │   ├── verify-register-email.js
│   │   │   ├── verifyConfirmationMail.js
│   │   │   ├── changePassword.js
│   │   │   ├── logout.js             # Token blacklisting
│   │   │   ├── checkUser.js
│   │   │   └── getinfo.js            # Get solved problems
│   │   ├── problem/
│   │   │   └── createProblem.js       # Problem creation pipeline
│   │   └── submission/
│   │       ├── runcode.js             # Run against visible tests
│   │       ├── submitcode.js          # Submit against hidden tests
│   │       └── runcustomInput.js      # Custom input execution
│   ├── middlewares/
│   │   ├── userAuth.js                # JWT + blacklist check
│   │   ├── adminAuth.js               # Admin role verification
│   │   ├── ratelimiter.js             # Redis sorted set rate limiter
│   │   └── fetchproblem.js            # Problem loader middleware
│   ├── models/
│   │   ├── auth/
│   │   │   ├── User.js               # User model
│   │   │   └── Schema/problem.js      # Solved problems sub-schema
│   │   ├── problem/
│   │   │   ├── problemSchema.js       # Problem model
│   │   │   └── Schema/
│   │   │       ├── boilerPlateSchema.js
│   │   │       ├── descriptionSchema.js
│   │   │       └── visibleTestCasesSchema.js
│   │   ├── submission/
│   │   │   └── submission.js          # Submission model + cache key
│   │   └── redis/
│   │       ├── client.js              # Redis client instance
│   │       └── connection.js          # IORedis/BullMQ setup
│   ├── submissionTemplate/
│   │   ├── cpp_runner.js              # C++ runner generator
│   │   ├── java_runner.js             # Java runner generator
│   │   ├── py_runner.js               # Python runner generator
│   │   └── js_runner.js               # JavaScript runner generator
│   ├── boilerplateTemplate/
│   │   └── py.js                      # Boilerplate generators
│   ├── utils/
│   │   ├── problem/
│   │   │   ├── checkSementicMeaning.js  # Pinecone similarity search
│   │   │   ├── storeProblemSementicly.js # Store embeddings
│   │   │   ├── problemValidation.js     # Full problem validation
│   │   │   ├── submissionResults.js     # Judge0 result fetcher
│   │   │   └── langCode.js             # Language ID mapper
│   │   ├── submission/
│   │   │   ├── batchSubmit.js           # Judge0 batch submit
│   │   │   ├── getbatchSubmit.js        # Polling with backoff
│   │   │   └── decodebase64.js          # Base64 decoder
│   │   └── user/
│   │       ├── userValidation.js        # Input validation
│   │       └── transporter.js           # Nodemailer setup
│   ├── routes/
│   │   ├── auth.js
│   │   ├── problem.js
│   │   └── submission.js
│   ├── server.js                       # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                     # Root app with routing
│   │   ├── main.jsx                    # Entry point (Redux Provider)
│   │   ├── components/
│   │   │   ├── header.jsx
│   │   │   ├── footer.jsx
│   │   │   ├── login.jsx               # Login with Zod + react-hook-form
│   │   │   ├── solutionEditor.jsx       # Multi-language editor
│   │   │   ├── executionOutput.jsx
│   │   │   └── leftSidebarProblem.jsx
│   │   ├── pages/
│   │   │   ├── landing.jsx
│   │   │   ├── problemlist.jsx
│   │   │   ├── problems.jsx            # Problem workspace page
│   │   │   ├── admin.jsx
│   │   │   ├── addProblem.jsx
│   │   │   ├── editProblem.jsx
│   │   │   └── signup-login.jsx
│   │   ├── sections/
│   │   │   ├── landing/                # Hero, Journey, Pricing, AI Advantage
│   │   │   ├── problem/
│   │   │   │   ├── problemWorkspace.jsx # Split-panel workspace
│   │   │   │   ├── editorPanel.jsx      # Code editor + resizer + results
│   │   │   │   ├── codeEditor.jsx       # CodeMirror wrapper
│   │   │   │   ├── editorHeader.jsx     # Language selector + run/submit
│   │   │   │   ├── problemDetails.jsx   # Problem description panel
│   │   │   │   └── resultsPanel.jsx     # Test case results
│   │   │   ├── Addproblem/
│   │   │   ├── editProblem/
│   │   │   ├── Admin/
│   │   │   └── problemDetailFormAdmin/
│   │   ├── slice/
│   │   │   ├── authSlice.js             # Auth state management
│   │   │   ├── problemSlice.js          # Run/submit state
│   │   │   └── problemWorkspaceSlice.js # Problem fetching state
│   │   ├── store/
│   │   │   └── authStore.js             # Redux store config
│   │   ├── layout/
│   │   │   └── adminLayout.jsx
│   │   └── assets/
│   │       └── errorToast.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.confing.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **MongoDB** (local or Atlas)
- **Redis** (local or cloud — e.g., Upstash, AWS ElastiCache)
- **Judge0 CE API Key** — [Get from RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce)
- **Google Gemini API Key** — [Get from AI Studio](https://aistudio.google.com/apikey)
- **Pinecone Account** — [Sign up free](https://www.pinecone.io/)

### Installation

```bash
# Clone the repository
git clone https://github.com/yb175/codeDrill.git
cd codeDrill
```

#### Backend Setup

```bash
cd Backend
npm install

# Create .env file (see Environment Variables section)
cp .env.example .env

# Start the server
npm start
```

#### Frontend Setup

```bash
cd frontend
npm install

# Start the dev server
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend at `http://localhost:3000`.

---

## 🔐 Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
# Server
PORT=3000

# MongoDB
mongoose_connection_string=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>

# Redis
REDIS_HOST=<your-redis-host>
REDIS_PORT=<your-redis-port>
REDIS_PASSWORD=<your-redis-password>

# JWT
JWT_SECRET_KEY=<your-secret-key>

# Judge0 (RapidAPI)
JUDGE0_API_KEY=<your-rapidapi-key>

# Nodemailer (Email Verification)
EMAIL_USER=<your-email>
EMAIL_PASS=<your-email-password>

# Verification Links
VERIFICATION_LINK_REGISTER=http://localhost:3000/user/verify
VERIFICATION_LINK_LOGIN=http://localhost:3000/user/login-verify
FRONTEND_URL=http://localhost:5173

# Google Gemini (AI Embeddings)
GEMINI_API_KEY=<your-gemini-api-key>

# Pinecone (Vector DB)
PINECONE_API_KEY=<your-pinecone-api-key>
PINECONE_INDEX_NAME=<your-pinecone-index-name>
```

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/user/register` | Register new user (sends verification email) | ❌ |
| `GET` | `/user/verify/:token` | Verify registration email | ❌ |
| `POST` | `/user/login-with-password` | Login with email & password | ❌ |
| `POST` | `/user/send-email-verification` | Send magic link login email | ❌ |
| `GET` | `/user/login-verify/:token` | Verify magic link token | ❌ |
| `PATCH` | `/user/reset-password` | Change password | ✅ |
| `GET` | `/user/logout` | Logout (blacklists token) | ✅ |
| `GET` | `/user/problem-solved` | Get user's solved problems | ✅ |
| `GET` | `/user/check` | Validate current session | ✅ |

### Problems

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/problems` | List all problems | ❌ |
| `GET` | `/problems/:id` | Get problem by ID | ❌ |
| `POST` | `/problems` | Create new problem | 🔑 Admin |
| `PATCH` | `/problems/:id` | Update problem | 🔑 Admin |

### Submissions

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/submissions/run` | Run code against visible test cases | ❌ |
| `POST` | `/submissions/` | Submit code against hidden test cases | ✅ |

---

## 💡 Key Technical Highlights

### 1. Multi-Language Code Runner Template Engine

Instead of simply passing user code to Judge0, CodeDrill generates **complete runnable programs** for each language. The runner templates:

- Parse JSON input from stdin
- Build data structures (ListNode, TreeNode) from serialized input
- Call the user's solution function with parsed arguments
- Serialize the output back to a comparable string format

```
User's Solution → Runner Template Engine → Complete Program → Judge0 → Verdict
```

Supported types: `int`, `string`, `bool`, `int[]`, `string[]`, `ListNode`, `TreeNode`

### 2. AI Semantic Duplicate Detection

When an admin creates a problem, the system:

1. Generates a vector embedding of the title + description using **Google Gemini `text-embedding-004`**
2. Queries **Pinecone** for the top 5 most similar existing problems
3. If similarity score > **0.87**, the problem is flagged as a potential duplicate
4. Successfully validated problems are stored in Pinecone for future comparisons

### 3. Redis-Powered Security Layer

- **Token Blacklisting**: On logout or password change, the JWT is stored in Redis with a TTL equal to its remaining lifetime — preventing reuse even if the token is copied
- **Sliding Window Rate Limiter**: Uses Redis sorted sets (`ZADD`/`ZCARD`/`ZRANGEBYSCORE`) with a 1-hour window (500 requests max) and 10-second per-request cooldown
- **Submission Caching**: SHA-256 hash of `code + problemNumber + language` used as cache key with 1-hour TTL

### 4. Problem Validation Pipeline

Before a problem is saved to MongoDB, it goes through:

1. **Schema validation** — field types, lengths, required fields
2. **Reference solution execution** — the admin's solution is actually run against all test cases via Judge0 to verify correctness
3. **Semantic duplicate check** — vector similarity search via Pinecone + Gemini embeddings

### 5. Workspace-Aware Layout

The app detects when a user is on a problem workspace route (`/problems/:id`) and switches to a **fixed viewport, overflow-hidden layout** — the same pattern LeetCode uses. All other pages use standard scrollable layout.

---

## 🗃 Database Models

### User

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | 3-20 characters |
| `email` | String | Unique, indexed |
| `password` | String | bcrypt hashed |
| `role` | Enum | `admin`, `user`, `guest` |
| `problemSolved` | ObjectId[] | References to solved problems |

### Problem

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Problem title |
| `problemNumber` | Number | Auto-incremented, unique |
| `description` | Object | `{ text, imgUrl }` |
| `difficulty` | Enum | `easy`, `medium`, `hard` |
| `problemTags` | String[] | Topic tags (e.g., Arrays, DP) |
| `companyTags` | String[] | Company tags |
| `hints` | String[] | Progressive hints |
| `visibleTestCases` | Object[] | `{ testCase, output, description, imgUrl }` |
| `hiddentestCases` | Object[] | `{ testCase, output }` — not exposed to users |
| `boilerplate` | Object | Function signature + language snippets |
| `refrenceSol` | Object[] | Admin's reference solutions per language |

### Submission

| Field | Type | Description |
|-------|------|-------------|
| `user` | ObjectId | Reference to user |
| `problemNumber` | Number | Problem identifier |
| `status` | Enum | `solved`, `attempted`, `not attempted`, `pending` |
| `languageUsed` | String | `c++`, `java`, `python` |
| `runtime` | Number | Total execution time |
| `memory` | Number | Peak memory usage |
| `testcasesPassed` | Number | Count of passed tests |
| `totalTestcases` | Number | Total test count |
| `code` | String | Submitted source code |
| `failedTest` | Object | First failing test case details |
| `aiAnalysis` | Object | `{ timeComplexity, spaceComplexity, optimizationSuggestions }` |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/yb175">yb175</a>
</p>
