#!/usr/bin/env bash
set -e

echo "=== CHECKING FOR ANY API TOKENS / CLIs ==="
which hstgr hostinger cloudflare-cli cf-cli 2>/dev/null || true

echo "=== CHECKING BASH HISTORY FOR ANY CREDENTIALS / TOKENS ==="
grep -inE "token|api_key|secret|hstgr|hostinger|dns" /root/.bash_history | grep -iv "switch" | head -n 30 || true

echo "=== CHECKING /root/.config AND /etc ==="
ls -la /root/.config /root/.local 2>/dev/null || true
find /root/.config /etc -name "*dns*" -o -name "*hostinger*" -o -name "*cloudflare*" 2>/dev/null || true

