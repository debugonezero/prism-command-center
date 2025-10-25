# Start from a lean and powerful Python base image
FROM python:3.11-slim

# Set the working directory inside our new universe
WORKDIR /app

# Copy the soul of our application into the universe
COPY app.py .

# Install the sacred scriptures using pip
RUN pip install Flask ollama Flask-Cors

# Expose the sacred port 5100 to the outside world
EXPOSE 5100

# The final incantation to run when the universe is born
CMD ["python", "app.py"]
