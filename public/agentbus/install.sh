#!/bin/sh
# agentbus installer — https://luqmaan.dev/agentbus
# Downloads agentbus from its gist, runs this device's daemon as a user service, and wires up the
# Claude Code / Codex / OpenCode / pi agents it finds. Re-run any time to update.
set -e
GIST="https://gist.githubusercontent.com/luqs1/1d03a4e9cfd1285d4f6131dd010503cf/raw"

case "$(uname -s)" in
  Linux|Darwin) ;;
  *) echo "agentbus: run this inside WSL on Windows (native Windows isn't supported yet)." >&2; exit 1 ;;
esac
command -v node >/dev/null 2>&1 || { echo "agentbus: needs Node.js >= 22.5 (https://nodejs.org)" >&2; exit 1; }
node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a>22||(a===22&&b>=5)?0:1)' \
  || { echo "agentbus: needs Node.js >= 22.5, found $(node --version)" >&2; exit 1; }

DIR="$HOME/.local/share/agentbus/app"
mkdir -p "$DIR" "$HOME/.local/bin"
for f in agentbus.mjs pi-extension.ts; do
  curl -fsSL "$GIST/$f?t=$(date +%s)" -o "$DIR/$f"
done
chmod +x "$DIR/agentbus.mjs"
ln -sf "$DIR/agentbus.mjs" "$HOME/.local/bin/agentbus"
node --no-warnings "$DIR/agentbus.mjs" install
