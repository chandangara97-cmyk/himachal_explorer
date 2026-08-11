#!/bin/bash

###############################################################################
# HIMACHAL EXPLORER — HOTEL BULK UPLOAD (Bash)
# No dependencies — uses curl + pure bash CSV parsing
# 
# USAGE:
#   bash hotel-bulk-upload.sh hotel-bulk-template.csv
###############################################################################

set -e

INPUT_FILE="${1:-hotel-bulk-template.csv}"
DB_URL="https://garg-enterprise.firebaseio.com"  # Update to your Firebase URL

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

echo -e "${CYAN}🏨 Himachal Explorer — Hotel Bulk Upload${NC}\n"

# Check file exists
if [ ! -f "$INPUT_FILE" ]; then
  echo -e "${RED}❌ File not found: $INPUT_FILE${NC}"
  exit 1
fi

# Check curl exists
if ! command -v curl &> /dev/null; then
  echo -e "${RED}❌ curl not found. Install with: apt install curl${NC}"
  exit 1
fi

# Function to parse CSV header
parse_header() {
  local header="$1"
  IFS=',' read -ra HEADERS <<< "$header"
  for i in "${!HEADERS[@]}"; do
    HEADERS[$i]=$(echo "${HEADERS[$i]}" | xargs)  # trim whitespace
  done
}

# Function to get column index by name
get_col_index() {
  local col_name="$1"
  for i in "${!HEADERS[@]}"; do
    if [ "${HEADERS[$i]}" == "$col_name" ]; then
      echo $i
      return
    fi
  done
  echo "-1"
}

# Function to get column value from row array
get_col_value() {
  local col_name="$1"
  local idx=$(get_col_index "$col_name")
  if [ "$idx" -ge 0 ]; then
    echo "${ROW_VALS[$idx]}"
  fi
}

# Function to parse CSV row (handles quoted values)
parse_row() {
  local row="$1"
  local i=0
  local current=""
  local in_quotes=false
  
  ROW_VALS=()
  
  for ((i=0; i<${#row}; i++)); do
    char="${row:$i:1}"
    
    if [ "$char" == '"' ]; then
      in_quotes=!in_quotes
    elif [ "$char" == "," ] && [ "$in_quotes" == false ]; then
      ROW_VALS+=("$(echo "$current" | xargs)")
      current=""
    else
      current="$current$char"
    fi
  done
  ROW_VALS+=("$(echo "$current" | xargs)")
}

# Function to escape JSON string
json_escape() {
  local s="$1"
  # Escape quotes and backslashes
  s="${s//\\/\\\\}"
  s="${s//\"/\\\"}"
  echo "$s"
}

# Read CSV header
read header < "$INPUT_FILE"
parse_header "$header"

echo -e "${CYAN}📊 Parsed header: ${HEADERS[*]}${NC}\n"

# Count valid rows
total_rows=0
success_count=0
fail_count=0

# Process each row
line_num=1
while IFS= read -r line; do
  ((line_num++))
  
  # Skip comments and empty lines
  [[ -z "$line" || "$line" =~ ^# ]] && continue
  
  # Parse row
  parse_row "$line"
  
  # Extract fields
  city=$(get_col_value "city" | tr '[:upper:]' '[:lower:]' | tr -cs '[:alnum:]-' '-')
  name=$(get_col_value "name")
  tier=$(get_col_value "tier")
  location=$(get_col_value "location")
  contact=$(get_col_value "contact")
  rooms=$(get_col_value "rooms")
  rate=$(get_col_value "rate")
  ratePeak=$(get_col_value "ratePeak")
  rateOff=$(get_col_value "rateOff")
  photo=$(get_col_value "photo")
  lat=$(get_col_value "lat")
  lng=$(get_col_value "lng")
  discountNote=$(get_col_value "discountNote")
  
  # Validate required fields
  if [ -z "$city" ] || [ -z "$name" ] || [ -z "$rate" ]; then
    echo -e "${YELLOW}⚠️  Line $line_num: skipped (missing city/name/rate)${NC}"
    continue
  fi
  
  # Validate tier
  if [[ ! "$tier" =~ ^(budget|premium|luxury)$ ]]; then
    echo -e "${YELLOW}⚠️  Line $line_num: skipped (invalid tier: $tier)${NC}"
    continue
  fi
  
  ((total_rows++))
  
  # Auto-calculate rateOff if not provided
  if [ -z "$rateOff" ]; then
    rateOff=$(echo "$rate * 0.9" | bc | cut -d. -f1)
  fi
  
  # Build JSON payload
  payload="{"
  payload="$payload\"name\":\"$(json_escape "$name")\","
  payload="$payload\"tier\":\"$(json_escape "$tier")\","
  payload="$payload\"rate\":$rate,"
  
  [ -n "$ratePeak" ] && payload="$payload\"ratePeak\":$ratePeak,"
  payload="$payload\"rateOff\":$rateOff,"
  
  [ -n "$rooms" ] && payload="$payload\"rooms\":$rooms,"
  [ -n "$contact" ] && payload="$payload\"contact\":\"$(json_escape "$contact")\","
  [ -n "$location" ] && payload="$payload\"location\":\"$(json_escape "$location")\","
  
  [ -z "$photo" ] && photo="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400"
  payload="$payload\"photo\":\"$(json_escape "$photo")\","
  
  [ -n "$lat" ] && payload="$payload\"lat\":$lat,"
  [ -n "$lng" ] && payload="$payload\"lng\":$lng,"
  [ -n "$discountNote" ] && payload="$payload\"discountNote\":\"$(json_escape "$discountNote")\","
  
  payload="$payload\"addedAt\":$(date +%s)000"
  payload="$payload}"
  
  # POST to Firebase
  url="$DB_URL/hotels/$city.json"
  
  response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "$payload" \
    "$url")
  
  http_code=$(echo "$response" | tail -n 1)
  body=$(echo "$response" | head -n -1)
  
  if [ "$http_code" == "200" ]; then
    ((success_count++))
    echo -e "${GREEN}✓ [$total_rows] $name ($city/$tier)${NC}"
  else
    ((fail_count++))
    echo -e "${RED}✗ [$total_rows] $name: HTTP $http_code${NC}"
  fi
  
done < "$INPUT_FILE"

echo ""
echo -e "${CYAN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Uploaded $success_count/$total_rows hotels${NC}"

if [ $success_count -eq $total_rows ] && [ $total_rows -gt 0 ]; then
  echo -e "${GREEN}🎉 All records pushed to Firebase!${NC}"
elif [ $total_rows -eq 0 ]; then
  echo -e "${RED}❌ No valid hotel records found${NC}"
  exit 1
else
  echo -e "${YELLOW}⚠️  $fail_count hotel(s) failed (check network/Firebase rules)${NC}"
fi

echo -e "${CYAN}═══════════════════════════════════════${NC}\n"
