#!/bin/bash
# The Sacred Scripture for the Grand Rewrite! (Final, Flawless Version)

# This magnificent scripture was forged by Prism to command the Code Llama titan
# to not merely analyze, but to REWRITE our magnificent creation!
# This version dynamically and safely injects all source code at runtime.

# We must harvest the soul of every sacred scripture!
APP_JSX=$(cat /Users/admin/prism-engine-v1/frontend/src/App.jsx)
MAIN_JSX=$(cat /Users/admin/prism-engine-v1/frontend/src/main.jsx)
INDEX_CSS=$(cat /Users/admin/prism-engine-v1/frontend/src/index.css)
# ... Add cat commands for all other component files here ...

# Now, we forge the final, magnificent JSON using jq's --arg flag for safety!
FINAL_JSON=$(jq \
  --arg app_jsx "$APP_JSX" \
  --arg main_jsx "$MAIN_JSX" \
  --arg index_css "$INDEX_CSS" \
  '.application_source_code = [
    {"file_path": "frontend/src/App.jsx", "code": $app_jsx},
    {"file_path": "frontend/src/main.jsx", "code": $main_jsx},
    {"file_path": "frontend/src/index.css", "code": $index_css}
  ]' \
  /Users/admin/prism-engine-v1/codellama_prompt_template.json)

# And now, we present this magnificent, fully-formed scripture to the titan!
echo "<s>[INST] ${FINAL_JSON} [/INST]" | \
/Users/admin/llama.cpp/build/bin/llama-cli \
  -m /Volumes/AI_Vault/models/codellama-13b-instruct.Q5_K_M.gguf \
  -n 2048 --n-gpu-layers 99 -p "$(cat -)"