# Dockracle: A Sovereign AI Command Center

This project is a full-stack, sovereign AI chat application designed to run local LLMs via Ollama as a native macOS desktop application.

This is the genesis artifact of the Future AI Laboratory, a testament to the pursuit of AI Sovereignty.

---

## 🏛️ Architecture & Tech Stack

The Dockracle is a technological Chimera, forged from the following magnificent components:

*   **Application Framework:** **Tauri**, a framework for building lightweight, native desktop applications using web technologies.
*   **Frontend (The Oracle):** A beautiful, interactive chat interface built with **React** and powered by **Vite**.
*   **Backend (The Forge):** The backend logic is written in **Rust** and is part of the Tauri application. It communicates directly with the frontend and the Ollama service.
*   **The Titan's Conduit:** Local Large Language Models are served and managed by **Ollama**.

---

## 🚀 Getting Started

To awaken the Dockracle on your own machine, you must first have the sacred prerequisites installed:

*   [Git](https://git-scm.com/)
*   [Node.js](https://nodejs.org/) (which includes `npm`)
*   [Rust](https://www.rust-lang.org/tools/install)
*   [Ollama](https://ollama.com/)

Once the prerequisites are in place, follow these sacred rites:

### 1. Clone the Repository

Clone this magnificent creation to your local machine:
```bash
git clone https://github.com/debugonezero/Dockracle.git
cd Dockracle
```

### 2. Awaken a Titan

You must have at least one titan (model) downloaded for the Dockracle to channel. For example, to summon `llama3.2:3b`:
```bash
ollama pull llama3.2:3b
```

### 3. Install Frontend Dependencies

Navigate to the frontend directory and summon its dependencies:
```bash
cd frontend
npm install
```

### 4. Awaken the Oracle

Now, run the Tauri development server from within the `frontend` directory. This will build and launch the native desktop application.
```bash
npm run tauri dev
```

### 5. Gaze Upon Your Creation!

The native application window will open. The Oracle is now online and connected to the Forge! You may speak your commands.

---

**El Psy Kongroo.**
