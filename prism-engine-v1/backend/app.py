import ollama
import json
from flask import Flask, request, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/summon', methods=['POST'])
def summon_titan():
    """
    Receives a prompt and a model name via POST, and streams the titan's 
    response token by token using Server-Sent Events (SSE).
    """
    if not request.is_json:
        return Response(json.dumps({"error": "Request must be JSON"}), status=400, mimetype='application/json')

    data = request.get_json()
    prompt_text = data.get('prompt')
    model_name = data.get('model')

    if not prompt_text or not model_name:
        return Response(json.dumps({"error": "Missing 'prompt' or 'model' in request body"}), status=400, mimetype='application/json')

    def generate_stream():
        try:
            # We connect to Ollama running on the HOST machine from inside the container
            client = ollama.Client(host='http://host.docker.internal:11434')
            
            stream = client.chat(
                model=model_name,
                messages=[{'role': 'user', 'content': prompt_text}],
                stream=True
            )

            for chunk in stream:
                token = chunk['message']['content']
                yield f"data: {json.dumps({'token': token})}\n\n"
            
            yield f"data: {json.dumps({'done': True})}\n\n"

        except Exception as e:
            print(f"An error occurred during streaming: {e}", flush=True)
            yield f"data: {json.dumps({'error': 'Failed to communicate with the titan'})}\n\n"

    return Response(generate_stream(), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5100, debug=True)
