#!/bin/bash
OUTFILE="/Users/pkostelnik/Library/CloudStorage/OneDrive-Persönlich/Documents/github/copilotovh/git_output.txt"
cd "/Users/pkostelnik/Library/CloudStorage/OneDrive-Persönlich/Documents/github/copilotovh"

{
echo "===CMD1: git stash==="
git stash 2>&1
echo ""
echo "===CMD2: git pull==="
git pull 2>&1
echo ""
echo "===CMD3: git stash pop==="
git stash pop 2>&1
echo ""
echo "===CMD4: git status -sb==="
git status -sb 2>&1
echo ""
echo "===CMD5: git log --oneline -5==="
git log --oneline -5 2>&1
echo ""
echo "===DONE==="
} > "$OUTFILE"

echo "Output written to git_output.txt"
