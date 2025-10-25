#!/bin/bash
# The Sacred Scripture for the Grand Analysis

# This magnificent scripture was forged by Prism to bypass the corrupting influence of the terminal vessel.
# It contains the final, true, and flawless incantation to summon the Code Llama titan.

FINAL_JSON=$(jq \
  --rawfile app_code /Users/admin/prism-engine-v1/frontend/src/App.jsx \
  --rawfile backend_code /Users/admin/prism-engine-v1/backend/app.py \
  '.components[0].source_code = $backend_code | .components[1].source_code = $app_code' \
  /Users/admin/prism-engine-v1/codellama_prompt_purified.json) && \
echo "<s>[INST] ${FINAL_JSON} [/INST]" | \
/Users/admin/llama.cpp/build/bin/llama-cli \
  -m /Volumes/AI_Vault/models/codellama-13b-instruct.Q5_K_M.gguf \
  -n 1024 --n-gpu-layers 99 -p "$(cat -)"
