````
# Project Goal

The primary objective is to create a compact, high-performance, and feature-rich chatbot application. The application will be a native macOS app built with **Tauri** to achieve optimal performance and a small footprint. The core of the application will use the `llama.cpp` C++ library for local Large Language Model (LLM) inference. The long-term goal is to make the application cross-platform (macOS, Windows, and Linux).

## Key Features

* **Offline Chat**: All model inference should occur locally.
* **Conversation Memory**: The app should maintain context across a single chat session.
* **Time-Travel/Undo**: The ability to step back and "undo" previous messages and model responses.
* **Stop Button**: A button to halt model inference if it starts to hallucinate or produces an undesirable response.
* **Projects**: The ability to manage and organize different chat sessions as separate "projects."

# Technology Stack

This project uses a hybrid technology stack: a high-performance backend and a flexible frontend.

* **Backend**: `llama.cpp` (C++ library) wrapped in **Rust**.
* **Frontend**: **Tauri** with **React** and **Vite**.

# Development Environment

## Prerequisites

The following tools and libraries are required to build and run this project:

* **Xcode Command Line Tools**: Essential for macOS development.
* **Rust**: The Rust programming language and its package manager `cargo`.
* **Node.js**: For the Tauri frontend, including `yarn` or `npm`.
* **System Libraries**: Ensure necessary C++ build tools and system dependencies are installed for `llama.cpp`.

## Build and Run Commands

* To run the app in development mode:
    ```bash
    yarn tauri dev
    ```
* To build the final production bundle:
    ```bash
    yarn tauri build
    ```

## Project Structure and Logic

### Frontend (React/Vite)

* **Chat History**: The chat history will be managed as a state in the React frontend (e.g., an array of message objects).
* **`invoke` Commands**: The frontend will use Tauri's `invoke` API to call Rust commands. The entire conversation history will be passed as an argument to the Rust backend with each new user message.

### Backend (Rust)

* **API**: The Rust code will expose a Tauri command (e.g., `generate_response`) that accepts the chat history from the frontend.
* **Prompt Formatting**: The Rust backend is responsible for taking the structured chat history and formatting it into a single, cohesive prompt string that `llama.cpp` can understand.
* **Model Inference**: The Rust code will call the `llama.cpp` library to run the model inference and then return the generated response back to the frontend.
* **Concurrency**: The backend should handle the model inference in a way that doesn't block the UI, likely using Rust's async features.

## Coding Style and Conventions

* **Code Formatting**: Use `rustfmt` for Rust code and `prettier` for the frontend.
* **Component Logic**: Keep React components as simple as possible. Pass complex logic and state management to custom hooks or a state management library.
* **Comments**: Add detailed comments to explain the purpose of complex `invoke` commands and Rust functions.

## Known Issues and Troubleshooting

* **Compilation Errors**: If compilation fails, first check that all system dependencies are installed and that `tauri.conf.json` is configured correctly. Focus on the first error message in the console, as it is often the root cause.
* **Context Loss**: Remember that `AGENTS.md` is the primary source of truth for the project. If you switch to a new tool, an initial prompt should point to this file for project context.

````