#!/bin/bash

# Script to seed test rooms into the booking service
# Usage: ./scripts/seed-rooms.sh [API_URL]
# Example: ./scripts/seed-rooms.sh http://localhost:8080

API_URL=${1:-http://159.65.208.64:8080}

echo "Seeding test rooms to $API_URL..."

rooms=(
  '{"name":"Conference Room A","location":"New York","basePrice":50,"capacity":10}'
  '{"name":"Conference Room B","location":"New York","basePrice":75,"capacity":20}'
  '{"name":"Executive Suite","location":"San Francisco","basePrice":100,"capacity":15}'
  '{"name":"Innovation Lab","location":"San Francisco","basePrice":80,"capacity":25}'
  '{"name":"Boardroom","location":"London","basePrice":120,"capacity":12}'
  '{"name":"Meeting Room 1","location":"London","basePrice":60,"capacity":8}'
  '{"name":"Collaboration Space","location":"Tokyo","basePrice":90,"capacity":30}'
  '{"name":"Quiet Room","location":"Tokyo","basePrice":40,"capacity":6}'
)

for room in "${rooms[@]}"; do
  echo "Creating room: $room"
  curl -X POST "$API_URL/rooms" \
    -H "Content-Type: application/json" \
    -d "$room"
  echo ""
done

echo "Done seeding rooms!"

