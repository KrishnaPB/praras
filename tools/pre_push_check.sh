#!/usr/bin/env bash
# Pre-Push Safety Guard
# Automatically verifies component integrity, link health, and schema validation before any push to git.

set -e

echo "=================================================="
echo "RUNNING PRE-PUSH VALIDATION GUARD..."
echo "=================================================="

# 1. Run Component Synchronization Check / Build
python3 tools/sync_components.py

# 2. Run Comprehensive Full Site Regression Test
python3 tools/test_regression.py

echo "=================================================="
echo "✓ PRE-PUSH VALIDATION PASSED - SAFE TO DEPLOY"
echo "=================================================="
