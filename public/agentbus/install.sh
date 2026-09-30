#!/bin/sh
# agentbus installer — https://luqmaan.dev/agentbus
# Downloads the agentbus binary for this machine, runs its daemon as a user service, and wires up the
# Claude Code / Codex / OpenCode / pi agents it finds. Re-run any time to update.
set -e
REPO="luqs1/agentbus"
case "$(uname -s)-$(uname -m)" in
  Linux-x86_64) T=x86_64-unknown-linux-musl ;;
  Linux-aarch64|Linux-arm64) T=aarch64-unknown-linux-musl ;;
  Darwin-arm64) T=aarch64-apple-darwin ;;
  Darwin-x86_64) T=x86_64-apple-darwin ;;
  *) echo "agentbus: unsupported platform $(uname -sm). On Windows, run this inside WSL." >&2; exit 1 ;;
esac
DIR="$HOME/.local/share/agentbus/bin"
mkdir -p "$DIR" "$HOME/.local/bin"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
curl -fsSL "https://github.com/$REPO/releases/latest/download/agentbus-$T.tar.gz" | tar -xz -C "$TMP"
chmod +x "$TMP/agentbus"
mv "$TMP/agentbus" "$DIR/agentbus"
ln -sf "$DIR/agentbus" "$HOME/.local/bin/agentbus"
"$DIR/agentbus" install "$@"
