# ChatCV: Your Personal AI CV Assistant

ChatCV is a Retrieval-Augmented Generation (RAG) powered AI assistant designed to represent you to recruiters and collaborators. It allows users to ask questions about your professional background, skills, and projects, providing accurate answers based strictly on your uploaded documents.

## 🚀 Key Features
- **Personalized AI Representative**: The assistant acts on your behalf, answering questions in a professional and consistent manner.
- **RAG Architecture**: Uses OpenAI's latest models for intelligent retrieval and answer generation.
- **Dynamic Customization**: Easily personalize the assistant's name, role, and guidance through environment variables.
- **Secure & Private**: Your personal documents are processed locally to build a searchable index and are never committed to the public repository.
- **Glassmorphic UI**: A modern, sleek chat interface built with Next.js and Tailwind CSS.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed and configured:

1.  **Programming Language & Runtime**:
    - [Node.js](https://nodejs.org/) (Version 18.x or later recommended).
    - [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/).
2.  **OpenAI Account**:
    - An [OpenAI API Key](https://platform.openai.com/api-keys) is required for embeddings and chat completions.
    - Ensure your account has sufficient credits for `gpt-4o-mini` and `text-embedding-3-small` usage.

---

## 📥 Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/YourUsername/chatCV-AI.git
    cd chatCV-AI
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables**:
    Copy the example environment file and fill in your details:
    ```bash
    cp .env.example .env
    ```
    Open `.env` and set the following:
    - `OPENAI_API_KEY`: Your secret OpenAI key.
    - `NEXT_PUBLIC_USER_NAME`: Your full name (e.g., John Doe).
    - `NEXT_PUBLIC_USER_TITLE`: Your professional title (e.g., AI Engineer).
    - `NEXT_PUBLIC_USER_GUIDANCE`: Brief instructions for the AI (e.g., "Answer questions about my AI projects").

---

## 📂 Setting Up Your Data

To make the assistant truly yours, you need to provide it with your data.

1.  **Add Your Documents**:
    Place your CV (PDF), project notes (Markdown), or portfolio descriptions in the `data/` folder.
2.  **Build the Search Index**:
    Run the indexing script to process your documents and create a local vector store:
    ```bash
    npm run build:index
    ```
    This will generate a `data/index.json` file (which is ignored by Git to protect your privacy).

---

## 💻 Usage

Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to interact with your AI assistant.

---

## 📝 Technical Guide

### Architecture Overview
- **Frontend**: Next.js 15 (App Router) for SSR and client-side interactions.
- **API**: Next.js Route Handlers (`app/api/chat/route.ts`) manage the RAG pipeline.
- **RAG Engine**:
  - **Chunking**: Documents are split into manageable sections with unique IDs.
  - **Embeddings**: `text-embedding-3-small` converts text into vectors.
  - **Similarity Search**: Cosine similarity is used to find the most relevant context for a user's query.
  - **Relevance Scoring**: A custom AI-relevance boost is applied based on specific keywords related to your field.
- **UI Components**:
  - `Chat.tsx`: Manages chat state and API calls.
  - `MessageBubble.tsx`: Renders individual messages with distinct roles.
  - `SourcesAccordion.tsx`: Displays the sources used by the AI to generate an answer.

---

## 🛡️ Security & Privacy
- **API Keys**: Never commit your `.env` file. It is already included in `.gitignore`.
- **Personal Data**: The `data/` folder is configured to exclude your sensitive PDFs and the generated `index.json`. 
- **Recommendation**: If your API key is ever exposed, rotate it immediately at OpenAI.

---

## 🤝 Contributing
Feel free to fork this project, open issues, or submit pull requests to improve the features or UI!

---

## 📜 License
This project is licensed under the MIT License.
