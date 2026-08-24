from __future__ import annotations

import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


def extract_doc_strings(path: Path) -> str:
    data = path.read_bytes()
    chunks: list[str] = []
    # Legacy Word stores most body text as UTF-16LE; ASCII runs catch metadata.
    for match in re.finditer(rb"(?:[\x20-\x7e]\x00){4,}", data):
        chunks.append(match.group().decode("utf-16le", errors="ignore"))
    for match in re.finditer(rb"[\x20-\x7e\r\n\t]{8,}", data):
        value = match.group().decode("cp1252", errors="ignore")
        if not value.startswith(("Microsoft", "Word.Document")):
            chunks.append(value)
    return "\n".join(chunks)


def extract_docx(path: Path) -> tuple[str, list[str]]:
    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    parts = ["word/document.xml"]
    media: list[str] = []
    output: list[str] = []
    with zipfile.ZipFile(path) as zf:
        parts += sorted(
            name for name in zf.namelist()
            if re.fullmatch(r"word/(?:header|footer)\d+\.xml", name)
        )
        media = sorted(name for name in zf.namelist() if name.startswith("word/media/"))
        for part in parts:
            if part not in zf.namelist():
                continue
            root = ET.fromstring(zf.read(part))
            output.append(f"\n=== {part} ===")
            for para in root.findall(".//w:p", ns):
                text = "".join(node.text or "" for node in para.findall(".//w:t", ns)).strip()
                if text:
                    output.append(text)
    return "\n".join(output), media


if __name__ == "__main__":
    source = Path(sys.argv[1])
    target = Path(sys.argv[2])
    if source.suffix.lower() == ".docx":
        text, media = extract_docx(source)
        target.write_text(text + "\n\nMEDIA\n" + "\n".join(media), encoding="utf-8")
    else:
        target.write_text(extract_doc_strings(source), encoding="utf-8")
