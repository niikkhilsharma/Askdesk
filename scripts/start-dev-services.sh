#!/usr/bin/env bash
# Starts the local LiteLLM database and proxy. npm runs this before `dev` only.
set -euo pipefail

DB_CONTAINER="embeded-ai-chatbot-db-1"
LLM_CONTAINER="embeded-ai-chatbot-litellm-1"

if ! docker info >/dev/null 2>&1; then
  echo "Docker is not running. Starting Docker Desktop..."
  if ! open -a Docker; then
    echo "Could not start Docker Desktop. Start it manually, then run npm run dev again."
    exit 1
  fi

  echo "Waiting for Docker to become ready..."
  ready=0
  for _ in $(seq 1 90); do
    if docker info >/dev/null 2>&1; then
      ready=1
      break
    fi
    sleep 2
  done

  if [ "$ready" -ne 1 ]; then
    echo "Docker Desktop did not become ready. Start it manually, then run npm run dev again."
    exit 1
  fi
fi

for container in "$DB_CONTAINER" "$LLM_CONTAINER"; do
  if ! docker container inspect "$container" >/dev/null 2>&1; then
    echo "Missing container ${container}. Create it once, then npm run dev can start it."
    exit 1
  fi
done

echo "Starting ${DB_CONTAINER}..."
docker start "$DB_CONTAINER" >/dev/null

echo "Waiting for ${DB_CONTAINER} to become healthy..."
for _ in $(seq 1 60); do
  health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$DB_CONTAINER")"
  if [ "$health" = "healthy" ] || [ "$health" = "none" ]; then
    break
  fi
  sleep 1
done

health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$DB_CONTAINER")"
if [ "$health" != "healthy" ] && [ "$health" != "none" ]; then
  echo "Database container did not become healthy (status: ${health})."
  exit 1
fi

echo "Starting ${LLM_CONTAINER}..."
docker start "$LLM_CONTAINER" >/dev/null
echo "LiteLLM proxy is starting on port 4000."
