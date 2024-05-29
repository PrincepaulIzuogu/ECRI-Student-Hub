#!/bin/sh
# Script to wait for a host:port to be available before executing a command

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

until nc -z -v -w30 "$host" "$port"; do
  echo "Waiting for $host:$port to be available..."
  sleep 5
done

>&2 echo "$host:$port is available, starting command: $cmd"
exec $cmd
