#!/bin/bash
# Scripts to clean up old debug databases

# Common locations for GIRO data on Linux
DATA_DIR="$HOME/.local/share/GIRO"
DEBUG_DB="giro_debug_reconstructed_v1.db"

echo "Cleaning up debug database..."

if [ -f "$DATA_DIR/$DEBUG_DB" ]; then
    echo "Found debug database at $DATA_DIR/$DEBUG_DB"
    rm "$DATA_DIR/$DEBUG_DB"
    echo "Debug database deleted."
else
    echo "Debug database not found in $DATA_DIR"
fi

# Check for SHM and WAL files
if [ -f "$DATA_DIR/$DEBUG_DB-shm" ]; then
    rm "$DATA_DIR/$DEBUG_DB-shm"
fi

if [ -f "$DATA_DIR/$DEBUG_DB-wal" ]; then
    rm "$DATA_DIR/$DEBUG_DB-wal"
fi

echo "Cleanup complete."
