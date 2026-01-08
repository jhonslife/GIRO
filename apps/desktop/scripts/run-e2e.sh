#!/bin/bash
# Script to run E2E tests with Vite dev server
# Usage: ./scripts/run-e2e.sh

set -e

echo "🚀 Starting E2E Test Suite..."

# Configuration
DEV_PORT=1420
MAX_WAIT=60

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    lsof -i:$1 > /dev/null 2>&1
    return $?
}

# Function to wait for server
wait_for_server() {
    echo -e "${YELLOW}⏳ Waiting for dev server on port $DEV_PORT...${NC}"
    local counter=0
    while ! curl -s http://localhost:$DEV_PORT > /dev/null; do
        sleep 1
        counter=$((counter + 1))
        if [ $counter -ge $MAX_WAIT ]; then
            echo -e "${RED}❌ Timeout waiting for dev server${NC}"
            return 1
        fi
    done
    echo -e "${GREEN}✅ Dev server is ready${NC}"
    return 0
}

# Cleanup function
cleanup() {
    if [ -n "$DEV_PID" ]; then
        echo -e "${YELLOW}🛑 Stopping dev server (PID: $DEV_PID)...${NC}"
        kill $DEV_PID 2>/dev/null || true
        wait $DEV_PID 2>/dev/null || true
    fi
}

# Trap to ensure cleanup on exit
trap cleanup EXIT

# Check if server is already running
if check_port $DEV_PORT; then
    echo -e "${YELLOW}⚠️  Dev server already running on port $DEV_PORT${NC}"
    DEV_PID=""
else
    # Start dev server in background
    echo -e "${YELLOW}🔧 Starting Vite dev server...${NC}"
    npm run dev > /tmp/vite-e2e.log 2>&1 &
    DEV_PID=$!
    
    # Wait for server to be ready
    if ! wait_for_server; then
        echo -e "${RED}❌ Failed to start dev server${NC}"
        cat /tmp/vite-e2e.log
        exit 1
    fi
fi

# Run Playwright tests
echo -e "${YELLOW}🎭 Running Playwright E2E tests...${NC}"
npx playwright test --reporter=line

# Check result
E2E_EXIT_CODE=$?

if [ $E2E_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ E2E tests passed!${NC}"
else
    echo -e "${RED}❌ E2E tests failed with exit code $E2E_EXIT_CODE${NC}"
fi

exit $E2E_EXIT_CODE
