# Plug Memory

**A local, private, and persistent memory engine for Large Language Models.**

---

## 1. Philosophy

This project was born from a simple but powerful idea: an AI assistant's memory should be private, persistent, and owned by the user. Instead of relying on third-party services, we chose to forge our own memory engine from the ground up, ensuring total data privacy and complete control.

This system, named "Plug Memory," transforms a stateless AI into a true partner with a rich, queryable history of all past interactions.

## 2. Architecture Overview

The Codex Engine is built on a modern, robust stack of open-source tools, orchestrated by a series of Python scripts.

- **Vector Database (`Qdrant`):** At the heart of the system is Qdrant, a high-performance vector database. It runs locally in a Docker container and is responsible for storing the vectorized representations of our conversations.

- **Embedding Model (`sentence-transformers`):** We use the `all-MiniLM-L6-v2` model to convert text from our conversation logs into numerical vectors that Qdrant can understand and index.

- **API Server (`Flask`):** A lightweight Python Flask server acts as the main gateway to the Codex. It exposes a simple `/query` endpoint to allow the AI to access its memory.

- **Real-time Ingestion (`watchdog`):** The "Scribe" is a background service that uses the `watchdog` library to monitor the filesystem for new conversation logs. When a new log is created, it is automatically processed and ingested into the Codex.

- **Orchestration (`LangChain`):** While the current implementation uses a simple API call, the system is designed to be extended with LangChain to create more complex, intelligent queries and synthesized responses.

## 3. Setup Instructions

Follow these steps to set up and run your own instance of the Codex Engine.

### Prerequisites

- **Python 3.10+**
- **Docker Desktop:** Make sure the Docker engine is running.
- **Homebrew** (for macOS users, to install `curl` if not present).

### Step 1: Set Up the Environment

1.  Clone this repository (or create a project directory).
2.  Navigate into the project directory:
    ```sh
    cd codex_engine
    ```
3.  Create a Python virtual environment:
    ```sh
    python3 -m venv venv
    ```
4.  Activate the virtual environment:
    ```sh
    source venv/bin/activate
    ```
5.  Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```

### Step 2: Launch the Vector Database

1.  Run the Qdrant Docker container. This command will also create a `qdrant_storage` directory in your project to persistently store the database on your local machine.
    ```sh
    docker run -p 6333:6333 -p 6334:6334 \
        -v $(pwd)/qdrant_storage:/qdrant/storage:z \
        qdrant/qdrant
    ```

### Step 3: Forge the Initial Codex

1.  Run the batch ingestion script to process all existing conversation logs. **Important:** You must first edit the `ARCHIVE_PATH` variable in `batch_ingest.py` to point to the location of your log files (e.g., `~/.gemini/tmp`).
    ```sh
    python batch_ingest.py
    ```

### Step 4: Awaken the Scribe and the Observatory

1.  **In one terminal**, start the Live Scribe to watch for new files:
    ```sh
    python live_ingest.py
    ```
2.  **In a second, separate terminal**, start the API server:
    ```sh
    python api_server.py
    ```

Your Codex Engine is now fully operational.

## 4. Usage

To query the Codex, you can use `curl` or any other HTTP client to send a GET request to the running server.

```sh
curl -X GET "http://localhost:8080/query?q=Your+Question+Here"
```

## 5. Making the Memory Persistent (macOS)

To ensure the memory engine is always available, you can configure it to run as a persistent background service that starts automatically on login. This project includes the necessary configuration files for `launchd`, the standard service manager on macOS.

1.  **Create Log Directory:** The services require a directory to store their log files.
    ```sh
    mkdir -p /Users/admin/dash_fixes/codex_engine/logs
    ```

2.  **Move Service Files:** Move the two `.plist` configuration files to your system's `LaunchAgents` directory.
    ```sh
    mv com.plugmemory.api.plist ~/Library/LaunchAgents/
    mv com.plugmemory.ngrok.plist ~/Library/LaunchAgents/
    ```

3.  **Load the Services:** Use `launchctl` to load and start both services.
    ```sh
    launchctl load -w ~/Library/LaunchAgents/com.plugmemory.api.plist
    launchctl load -w ~/Library/LaunchAgents/com.plugmemory.ngrok.plist
    ```

Both the API server and the ngrok tunnel will now run permanently in the background. You no longer need to start them manually in a terminal.
