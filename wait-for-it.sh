#!/bin/bash
# wait-for-it.sh
# From: https://github.com/vishnubob/wait-for-it

host="$1"
port="$2"
shift 2
cmd="$@"

while ! nc -z "$host" "$port"; do
  echo "Waiting for $host:$port..."
  sleep 0.5
done

>&2 echo "$host:$port is available"
exec "$cmd"
