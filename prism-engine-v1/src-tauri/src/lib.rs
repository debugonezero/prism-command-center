
use tauri::{Emitter, Manager, Window};
use std::process::{Command, Stdio, Child};
use std::sync::Mutex;
use std::io::{BufReader, BufRead};
use std::thread;

// State to hold the child process handle
pub struct AppState {
    llama_server_process: Mutex<Option<Child>>,
    
}

#[derive(Clone, serde::Serialize)]
struct TokenPayload {
    token: String,
}

#[derive(Clone, serde::Serialize)]
struct DonePayload {
    done: bool,
}


// --- The `summon_titan` command ---
#[tauri::command]
async fn summon_titan(prompt: String, window: Window) -> Result<(), String> {
    let client = reqwest::Client::new();
    let request_body = serde_json::json!({
        "model": "model.gguf",
        "messages": [{"role": "user", "content": prompt}],
        "stream": true
    });

    // The llama-server runs on port 8080 by default
    let url = "http://localhost:8080/v1/chat/completions";

    let response_future = client.post(url)
        .json(&request_body)
        .send()
        .await;

    let mut response = match response_future {
        Ok(res) => res,
        Err(e) => return Err(format!("Failed to send request to llama-server: {}", e)),
    };

    while let Some(chunk) = response.chunk().await.unwrap() {
        let chunk_str = String::from_utf8_lossy(&chunk);
        for line in chunk_str.lines() {
            if line.starts_with("data:") {
                let json_str = line.strip_prefix("data: ").unwrap_or_default();
                if json_str == "[DONE]" {
                    window.emit("llm_done", DonePayload { done: true }).unwrap();
                    break;
                }
                if let Ok(json) = serde_json::from_str::<serde_json::Value>(json_str) {
                    if let Some(choices) = json.get("choices").and_then(|c| c.as_array()) {
                        if let Some(first_choice) = choices.get(0) {
                            if let Some(delta) = first_choice.get("delta") {
                                if let Some(content) = delta.get("content").and_then(|c| c.as_str()) {
                                    window.emit("llm_token", TokenPayload { token: content.to_string() }).unwrap();
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    Ok(())
}


// --- Main application setup ---
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let state = AppState {
        llama_server_process: Mutex::new(None),
    };

    tauri::Builder::default()
        .manage(state)
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            let resource_dir = app.path().resource_dir()
                .map_err(|e| format!("Failed to resolve resource dir: {}", e))?;

            // --- Spawn llama-server ---
            // In development, resources are in _up_ directory
            let server_path = if cfg!(debug_assertions) {
                resource_dir.join("_up_/backend/llama-server")
            } else {
                resource_dir.join("backend/llama-server")
            };
            let model_path = if cfg!(debug_assertions) {
                resource_dir.join("_up_/backend/models/model.gguf")
            } else {
                resource_dir.join("backend/models/model.gguf")
            };
            let lib_dir = if cfg!(debug_assertions) {
                resource_dir.join("_up_/backend")
            } else {
                resource_dir.join("backend")
            };

            log::info!("Starting llama-server from: {}", server_path.display());
            log::info!("Loading model from: {}", model_path.display());
            log::info!("Setting DYLD_LIBRARY_PATH to: {}", lib_dir.display());

            // Check if required files exist before spawning
            if !server_path.exists() {
                return Err(format!("llama-server binary not found at: {}", server_path.display()).into());
            }
            if !model_path.exists() {
                return Err(format!("Model file not found at: {}", model_path.display()).into());
            }

            let mut child = Command::new(&server_path)
                .arg("-m")
                .arg(&model_path)
                .arg("--port")
                .arg("8080")
                .env("DYLD_LIBRARY_PATH", &lib_dir)
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .spawn()
                .map_err(|e| format!("Failed to spawn llama-server at '{}': {}", server_path.display(), e))?;

            let stdout = child.stdout.take()
                .ok_or("Failed to capture stdout")?;
            let stderr = child.stderr.take()
                .ok_or("Failed to capture stderr")?;

            thread::spawn(move || {
                let reader = BufReader::new(stdout);
                for line in reader.lines() {
                    log::info!("[llama-server] {}", line.unwrap());
                }
            });
            thread::spawn(move || {
                let reader = BufReader::new(stderr);
                for line in reader.lines() {
                    log::error!("[llama-server] {}", line.unwrap());
                }
            });
            
            let state = app.state::<AppState>();
            *state.llama_server_process.lock().unwrap() = Some(child);

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::Destroyed = event {
                if window.label() == "main" {
                    let state = window.state::<AppState>();
                    let child_to_kill = state.llama_server_process.lock().unwrap().take();
                    if let Some(mut child) = child_to_kill {
                        log::info!("Killing llama-server process...");
                        if let Err(e) = child.kill() {
                            log::error!("Failed to kill llama-server process: {}", e);
                        }
                    }
                }
            }
        })
        .invoke_handler(tauri::generate_handler![summon_titan])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}