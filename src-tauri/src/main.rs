#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod champions;

use champions::{champion::Champion, data::get_champions};
use rand::seq::SliceRandom;
use rand::thread_rng;
use chrono::Utc;
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

use dotenvy::dotenv;
use std::env;
use tauri::State;
use serde_json::json;
use tauri_plugin_dialog;

struct AppState {
    webhook_url: String,
}

#[tauri::command]
fn get_champ() -> Champion {
    let champions = get_champions();
    let mut rng = thread_rng();
    champions.choose(&mut rng).expect("No champions found").clone()
}

#[tauri::command]
fn search_champions(prefix: String) -> Vec<Champion> {
    let champions = get_champions();
    champions
        .into_iter()
        .filter(|c| c.name.to_lowercase().starts_with(&prefix.to_lowercase()))
        .collect()
}

#[tauri::command]
fn get_daily_champion() -> Champion {
    let champions = get_champions();
    let today = Utc::now().date_naive().to_string();
    let mut hasher = DefaultHasher::new();
    today.hash(&mut hasher);
    let index = (hasher.finish() as usize) % champions.len();
    champions[index].clone()
}

#[tauri::command]
fn get_all_champions() -> Vec<Champion> {
    get_champions()
}

#[tauri::command]
fn all_champions_count() -> usize {
    get_champions().len()
}

#[tauri::command]
async fn send_bug_report(state: State<'_, AppState>, description: String) -> Result<(), String> {
    let client = reqwest::Client::new();
    let payload = json!({
        "embeds": [{
            "title": "🐛 Bug Report",
            "description": description,
            "color": 16711680, // Red
            "timestamp": chrono::Utc::now().to_rfc3339(),
        }]
    });

    let res = client
        .post(&state.webhook_url)
        .json(&payload)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if res.status().is_success() {
        Ok(())
    } else {
        Err(format!("Discord API returned {}", res.status()))
    }
}

fn main() {
    dotenv().ok();
    let webhook_url = env::var("DISCORD_WEBHOOK_URL").expect("Missing DISCORD_WEBHOOK_URL in .env");

    tauri::Builder::default()
        .manage(AppState { webhook_url })
        .setup(|app| {  
        #[cfg(desktop)]
        app.handle().plugin(
        tauri_plugin_updater::Builder::new().build()
        );
        Ok(())
  })
        .invoke_handler(tauri::generate_handler![
            get_champ,
            search_champions,
            get_daily_champion,
            get_all_champions,
            all_champions_count,
            send_bug_report
        ])
        .plugin(tauri_plugin_dialog::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
