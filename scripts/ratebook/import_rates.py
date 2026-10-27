#!/usr/bin/env python3
"""Rate-book ingest: Excel workbook -> validated providers -> AES-256-GCM encrypted blob.

Usage:
    python scripts/ratebook/import_rates.py <workbook.xlsx>

Reads TableCreditProvider (MasterData!A:B) from Eddie's CLI quote workbook,
validates it, prints an import report, and writes the encrypted rate book to
src/server/ratebook/ratebook.enc.

The encryption key comes from the RATEBOOK_KEY environment variable
(base64-encoded 32 raw bytes). Generate one with:

    python -c "import secrets,base64;print(base64.b64encode(secrets.token_bytes(32)).decode())"

Policy for dirty data (deterministic, honest):
  - duplicate provider with identical rate  -> keep one
  - duplicate provider with conflicting rates -> EXCLUDED + flagged
  - missing / out-of-range rate              -> EXCLUDED + flagged
  - rate range expected: 0 < rate <= 4.5 (NCA prescribed cap)
"""
from __future__ import annotations

import base64
import datetime as dt
import json
import os
import struct
import sys
from pathlib import Path

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from openpyxl import load_workbook

REPO_ROOT = Path(__file__).resolve().parents[2]
OUTPUT = REPO_ROOT / "src" / "server" / "ratebook" / "ratebook.enc"
MAGIC = b"IQRB"  # InsurQ Rate Book
VERSION = 1
RATE_MAX = 4.5


def extract(workbook: Path) -> list[tuple[str, float | None]]:
    wb = load_workbook(workbook, data_only=True, read_only=True)
    ws = wb["MasterData"]
    rows: list[tuple[str, float | None]] = []
    for row in ws.iter_rows(min_row=2, min_col=1, max_col=2, values_only=True):
        name, rate = row
        if name is None:
            continue
        rows.append((str(name).strip(), rate if isinstance(rate, (int, float)) else None))
    wb.close()
    return rows


def validate(rows: list[tuple[str, float | None]]):
    kept: dict[str, float] = {}
    excluded: list[tuple[str, str]] = []
    seen: dict[str, float] = {}
    for name, rate in rows:
        if rate is None:
            excluded.append((name, "missing rate"))
            continue
        rate = round(float(rate), 2)
        if not (0 < rate <= RATE_MAX):
            excluded.append((name, f"rate {rate} outside (0, {RATE_MAX}]"))
            continue
        if name in seen:
            if abs(seen[name] - rate) < 1e-9:
                continue  # identical duplicate -> keep one silently
            excluded.append((name, f"conflicting duplicate rates {seen[name]} vs {rate}"))
            kept.pop(name, None)
            continue
        if name in {e for e, _ in excluded}:
            continue  # already excluded as conflicting; ignore later rows
        seen[name] = rate
        kept[name] = rate
    return kept, excluded


def encrypt(payload: bytes, key: bytes) -> bytes:
    iv = os.urandom(12)
    tag = AESGCM(key).encrypt(iv, payload, MAGIC)
    # cryptography returns ciphertext || tag (last 16 bytes)
    ciphertext, mac = tag[:-16], tag[-16:]
    return MAGIC + struct.pack("B", VERSION) + iv + mac + ciphertext


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 2
    workbook = Path(sys.argv[1])
    if not workbook.exists():
        print(f"ERROR: workbook not found: {workbook}")
        return 2

    key_b64 = os.environ.get("RATEBOOK_KEY", "").strip()
    if not key_b64:
        print("ERROR: RATEBOOK_KEY is not set (base64 of 32 raw bytes).")
        return 2
    key = base64.b64decode(key_b64)
    if len(key) != 32:
        print("ERROR: RATEBOOK_KEY must decode to exactly 32 bytes.")
        return 2

    rows = extract(workbook)
    kept, excluded = validate(rows)

    payload = json.dumps(
        {
            "importedAt": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
            "source": workbook.name,
            "providers": [{"name": n, "rate": r} for n, r in sorted(kept.items())],
        },
        ensure_ascii=False,
        separators=(",", ":"),
    ).encode("utf-8")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_bytes(encrypt(payload, key))

    print(f"Imported {len(kept)} providers -> {OUTPUT.relative_to(REPO_ROOT)}")
    print(f"Encrypted blob: {OUTPUT.stat().st_size} bytes")
    if excluded:
        print(f"\nEXCLUDED ({len(excluded)}) — fix these in the workbook and re-import:")
        for name, why in excluded:
            print(f"  - {name!r}: {why}")
    else:
        print("No data-quality exclusions.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
