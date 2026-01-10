#!/bin/bash

# 🧪 GIRO License Server - Test Suite
# Testa todos os endpoints após deploy

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
if [ -z "$API_URL" ]; then
  echo -e "${YELLOW}⚠️  API_URL não definida. Usando localhost...${NC}"
  API_URL="http://localhost:3000"
fi

BASE_URL="$API_URL/api/v1"

echo -e "${BLUE}🧪 GIRO License Server - Test Suite${NC}"
echo "======================================"
echo "API URL: $BASE_URL"
echo ""

# Test counter
PASSED=0
FAILED=0

# Test function
test_endpoint() {
  local name="$1"
  local method="$2"
  local endpoint="$3"
  local data="$4"
  local expected_status="${5:-200}"
  
  echo -n "Testing: $name... "
  
  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data")
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" -eq "$expected_status" ]; then
    echo -e "${GREEN}✅ PASS${NC} ($http_code)"
    PASSED=$((PASSED + 1))
    return 0
  else
    echo -e "${RED}❌ FAIL${NC} (expected $expected_status, got $http_code)"
    echo "Response: $body"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

# Test with auth
test_with_auth() {
  local name="$1"
  local method="$2"
  local endpoint="$3"
  local token="$4"
  local data="$5"
  local expected_status="${6:-200}"
  
  echo -n "Testing: $name... "
  
  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
      -H "Authorization: Bearer $token")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
      -H "Authorization: Bearer $token" \
      -H "Content-Type: application/json" \
      -d "$data")
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" -eq "$expected_status" ]; then
    echo -e "${GREEN}✅ PASS${NC} ($http_code)"
    PASSED=$((PASSED + 1))
    echo "$body"
    return 0
  else
    echo -e "${RED}❌ FAIL${NC} (expected $expected_status, got $http_code)"
    echo "Response: $body"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

# ===================================
# HEALTH CHECKS
# ===================================

echo -e "${BLUE}📊 Health Checks${NC}"
echo "-----------------------------------"

test_endpoint "Health Check" "GET" "/health" "" 200

echo ""

# ===================================
# AUTHENTICATION FLOW
# ===================================

echo -e "${BLUE}🔐 Authentication${NC}"
echo "-----------------------------------"

# Generate random email for testing
TEST_EMAIL="test-$(date +%s)@test.com"
TEST_PASSWORD="Test@12345"
TEST_NAME="Test User"

# Register
echo "Registering user: $TEST_EMAIL"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"name\":\"$TEST_NAME\"}")

echo "Register response: $REGISTER_RESPONSE"

# Login
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

echo "Login response: $LOGIN_RESPONSE"

# Extract token (requires jq)
if command -v jq &> /dev/null; then
  TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // .access_token // .jwt // empty')
  if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    echo -e "${GREEN}✅ Got auth token${NC}"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}❌ Failed to get token${NC}"
    echo "Response: $LOGIN_RESPONSE"
    FAILED=$((FAILED + 1))
    TOKEN=""
  fi
else
  echo -e "${YELLOW}⚠️  jq not installed, cannot extract token${NC}"
  TOKEN=""
fi

echo ""

# ===================================
# AUTHENTICATED ENDPOINTS
# ===================================

if [ -n "$TOKEN" ]; then
  echo -e "${BLUE}🔑 Authenticated Endpoints${NC}"
  echo "-----------------------------------"
  
  # Get current user
  test_with_auth "Get Current User" "GET" "/auth/me" "$TOKEN" "" 200
  
  # Create license
  CREATE_LICENSE_DATA='{
    "customer_name": "Test Customer",
    "customer_email": "customer@test.com",
    "license_type": "professional",
    "duration_days": 365
  }'
  
  LICENSE_RESPONSE=$(test_with_auth "Create License" "POST" "/licenses" "$TOKEN" "$CREATE_LICENSE_DATA" 201)
  
  # Extract license key
  if command -v jq &> /dev/null; then
    LICENSE_KEY=$(echo "$LICENSE_RESPONSE" | jq -r '.license_key // .key // empty')
    if [ -n "$LICENSE_KEY" ] && [ "$LICENSE_KEY" != "null" ]; then
      echo -e "${GREEN}✅ Created license: $LICENSE_KEY${NC}"
      
      # Test license endpoints
      test_with_auth "Get License Details" "GET" "/licenses/$LICENSE_KEY" "$TOKEN" "" 200
      test_with_auth "List All Licenses" "GET" "/licenses" "$TOKEN" "" 200
      
      # Activate license
      ACTIVATE_DATA='{
        "hardware_id": "TEST-HW-' $(date +%s) '",
        "machine_info": {
          "hostname": "test-machine",
          "os": "Linux",
          "cpu": "Test CPU"
        }
      }'
      test_with_auth "Activate License" "POST" "/licenses/$LICENSE_KEY/activate" "$TOKEN" "$ACTIVATE_DATA" 200
      
      # Validate license
      VALIDATE_DATA='{"hardware_id":"TEST-HW-123"}'
      test_with_auth "Validate License" "POST" "/licenses/$LICENSE_KEY/validate" "$TOKEN" "$VALIDATE_DATA" 200
      
    fi
  fi
  
  # Get stats
  test_with_auth "Get License Stats" "GET" "/licenses/stats" "$TOKEN" "" 200
  
  # List hardware
  test_with_auth "List Hardware" "GET" "/hardware" "$TOKEN" "" 200
  
  echo ""
fi

# ===================================
# METRICS ENDPOINTS
# ===================================

echo -e "${BLUE}📊 Metrics${NC}"
echo "-----------------------------------"

# These might require auth depending on config
if [ -n "$TOKEN" ]; then
  test_with_auth "Get Metrics Dashboard" "GET" "/metrics/dashboard" "$TOKEN" "" 200
else
  test_endpoint "Get Metrics Dashboard" "GET" "/metrics/dashboard" "" 200
fi

echo ""

# ===================================
# RESULTS
# ===================================

echo "======================================"
echo -e "${BLUE}📊 Test Results${NC}"
echo "======================================"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo "Total:  $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed${NC}"
  exit 1
fi
