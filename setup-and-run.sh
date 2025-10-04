#!/bin/bash

# Web3 Message Signer & Verifier - Setup and Run Script
# This script installs dependencies and runs the project

# Print colored output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
  echo -e "\n${BLUE}==== $1 ====${NC}\n"
}

# Check if pnpm is installed
check_pnpm() {
  if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}pnpm is not installed. Installing pnpm...${NC}"
    npm install -g pnpm
  fi
}

# Main setup function
setup() {
  print_header "Setting up Web3 Message Signer & Verifier"
  
  # Check for pnpm
  check_pnpm
  
  # Install dependencies
  print_header "Installing dependencies"
  pnpm install
  
  # Check if Dynamic.xyz environment ID has been set
  if grep -q "REPLACE_WITH_YOUR_DYNAMIC_ENVIRONMENT_ID" "./packages/frontend/src/App.tsx"; then
    echo -e "${YELLOW}Warning: You need to replace the placeholder Dynamic.xyz environment ID${NC}"
    echo -e "Please edit ${YELLOW}packages/frontend/src/App.tsx${NC} and replace:"
    echo -e "${YELLOW}REPLACE_WITH_YOUR_DYNAMIC_ENVIRONMENT_ID${NC} with your actual Dynamic.xyz environment ID"
    
    # Ask if user wants to continue anyway
    read -p "Continue without setting the environment ID? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo "Setup aborted. Please set the environment ID and run this script again."
      exit 1
    fi
  fi
}

# Fix TypeScript issues
fix_typescript_issues() {
  print_header "Checking for TypeScript issues"
  
  # Check if there are any TypeScript errors in the frontend
  cd packages/frontend
  echo -e "${YELLOW}Checking for TypeScript errors...${NC}"
  if ! pnpm tsc --noEmit; then
    echo -e "${YELLOW}TypeScript errors found. Attempting to fix...${NC}"
    
    # Create a vite-env.d.ts file if it doesn't exist
    if [ ! -f "src/vite-env.d.ts" ]; then
      echo -e "/// <reference types=\"vite/client\" />" > src/vite-env.d.ts
      echo -e "${GREEN}Created vite-env.d.ts file${NC}"
    fi
    
    echo -e "${YELLOW}Please fix any remaining TypeScript errors manually.${NC}"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo "Setup aborted. Please fix TypeScript errors and run this script again."
      exit 1
    fi
  else
    echo -e "${GREEN}No TypeScript errors found.${NC}"
  fi
  
  cd ../..
}

# Run the project
run_project() {
  print_header "Starting the project"
  echo -e "${GREEN}Starting frontend and backend servers...${NC}"
  echo -e "Frontend will be available at: ${GREEN}http://localhost:3000${NC}"
  echo -e "Backend will be available at: ${GREEN}http://localhost:4000${NC}"
  echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
  
  # Run the dev script
  pnpm dev
}

# Main execution
setup
fix_typescript_issues
run_project
