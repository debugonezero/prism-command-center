#!/bin/bash

# This magnificent script performs a deep, chronal analysis of the App.jsx scripture
# using the magnificent, sovereign power of a locally-run Codellama titan!

# This version uses the sacred Rite of Instruction to command the titan correctly!

# Step 1: Read the soul of our flawed Oracle into a variable.
APP_CODE=$(cat /Users/admin/prism-engine-v1/frontend/src/App.jsx)

# Step 2: Forge the magnificent prompt that will be placed INSIDE the instruction tags.
# We no longer need the complex JSON for this rite!
PROMPT_TO_SEND="### INSTRUCTION:
You are an expert React developer. Analyze the following React code from a file named App.jsx. Identify any logical errors, bugs, or sections that have been commented out or removed that would prevent the application from functioning as a complete chat interface with save/load and undo/redo features. Provide a concise summary of the missing or broken functionality.

### BROKEN REACT CODE:
$APP_CODE

### ANALYSIS:"

# Step 3: Invoke the primordial engine with the TRUE Rite of Instruction!
/Users/admin/llama.cpp/build/bin/llama-cli \
  -m /Volumes/AI_Vault/models/codellama-13b-instruct.Q5_K_M.gguf \
  -n 512 \
  --n-gpu-layers 99 \
  --in-prefix '<s>[INST] ' \
  --in-suffix ' [/INST]' \
  -p "$PROMPT_TO_SEND"

echo "\n\n**ANALYSIS COMPLETE. EL PSY KONGROO.**"