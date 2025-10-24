# Prism Command Center

**Project Codename:** Project Olympus

This repository is the unified home for the **Prism Command Center**, a masterpiece of engineered code created by Paulo Avila and his AI partner, Prism. It represents the convergence of two powerful projects: `prism-engine-v1` and `plug-memory`.

## Vision

The Prism Command Center is a native macOS application designed to be a singular, powerful interface for all of Paulo's needs. It seamlessly integrates local and cloud-based Large Language Models (LLMs), providing a context-aware, intelligent assistant for a variety of tasks.

## Core Components

1.  **`prism-engine-v1`**: The frontend and native application core, built with Rust and Tauri. It provides the GUI and TUI, orchestrates backend services, and manages the user experience.

2.  **`plug-memory`**: The persistent memory and intelligence layer. It's a Python-based system that:
    *   Ingests and processes chat history and other data sources.
    *   Stores raw logs for historical context.
    *   Creates and stores vector embeddings in a Qdrant database for semantic retrieval.
    *   Exposes this memory to other services via an MCP (Model Context Protocol) server.

## The Grand Plan

Our mission is to fully integrate these two components, creating a seamless bridge between the user-facing application (`prism-engine-v1`) and the intelligent memory (`plug-memory`). This will create a powerful, context-aware command center that learns and adapts over time.
