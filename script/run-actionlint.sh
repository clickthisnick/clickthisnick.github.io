#!/usr/bin/env bash
# Pinned actionlint binary. Downloaded on first use so CI and laptops share one command.
set -euo pipefail

version="1.7.12"
root="$(cd "$(dirname "$0")/.." && pwd)"
bindir="$root/.cache/bin"
mkdir -p "$bindir"
bin="$bindir/actionlint-${version}"

if [[ ! -x "$bin" ]]; then
  os="$(uname -s | tr '[:upper:]' '[:lower:]')"
  machine="$(uname -m)"
  case "$os" in
    linux) platform="linux" ;;
    darwin) platform="darwin" ;;
    *) echo "actionlint is not set up for $os" >&2; exit 1 ;;
  esac
  case "$machine" in
    x86_64) arch="amd64" ;;
    aarch64 | arm64) arch="arm64" ;;
    *) echo "actionlint is not set up for $machine" >&2; exit 1 ;;
  esac
  tmp="$(mktemp -d)"
  url="https://github.com/rhysd/actionlint/releases/download/v${version}/actionlint_${version}_${platform}_${arch}.tar.gz"
  curl -fsSL "$url" -o "$tmp/actionlint.tar.gz"
  tar -xzf "$tmp/actionlint.tar.gz" -C "$tmp" actionlint
  mv "$tmp/actionlint" "$bin"
  chmod +x "$bin"
  rm -rf "$tmp"
fi

"$bin" "$@"
