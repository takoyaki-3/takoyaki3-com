#!/usr/bin/env python3
"""
Cline AI の出力から PR タイトルと本文を抽出するスクリプト
"""
import sys
import re


def _is_weak_title(text: str) -> bool:
    """タイトルとして弱すぎる文字列かどうかを判定する。"""
    normalized = text.strip()
    if not normalized:
        return True
    # 1〜3文字程度の極端に短いタイトルは避ける（「と」「修正」など）
    if len(normalized) <= 3:
        return True
    # 記号や句読点のみのタイトルも弾く
    if re.fullmatch(r"[。、・「」『』（）()［］\[\]{}…!！?？\-〜ー\s]+", normalized):
        return True
    return False


def extract_pr_details(input_text, title_file, body_file):
    """
    入力テキストから PR のタイトルと本文を抽出する。

    Expected format (tags can be upper/lower case, with optional spaces):
      <PR_TITLE>Title text</PR_TITLE>
      <PR_BODY>Body text</PR_BODY>

    Fallback: If tags are not found, split by '---'.
    """
    # タグからの抽出（大文字・小文字、空白を許容）
    tag_flags = re.DOTALL | re.IGNORECASE
    title_match = re.search(
        r"<\s*PR_TITLE\s*>(.*?)<\s*/\s*PR_TITLE\s*>", input_text, tag_flags
    )
    body_match = re.search(
        r"<\s*PR_BODY\s*>(.*?)<\s*/\s*PR_BODY\s*>", input_text, tag_flags
    )

    title = title_match.group(1).strip() if title_match else ""
    body = body_match.group(1).strip() if body_match else ""

    # どちらか片方でも欠けている場合は '---' での分割を試みる
    if not title or not body:
        parts = input_text.split("---", 1)
        if len(parts) >= 2:
            fallback_title = parts[0].strip()
            fallback_body = parts[1].strip()
        else:
            fallback_title = ""
            fallback_body = input_text.strip()

        if not title:
            title = fallback_title
        if not body:
            body = fallback_body

    # タイトルが短すぎる・意味が薄い場合の救済
    if _is_weak_title(title):
        # 本文の先頭の非空行をタイトル候補として再利用
        candidate = ""
        for line in body.splitlines():
            line = line.strip()
            if line:
                candidate = line
                break
        if not _is_weak_title(candidate):
            title = candidate
        else:
            # それでもダメならデフォルトタイトル
            title = "AI による自動PR"

    # 本文が空の場合のフォールバック
    if not body.strip():
        body = "このPRはAIによって自動生成されました。"

    # ファイルに書き出し
    with open(title_file, "w", encoding="utf-8") as f:
        f.write(title)

    with open(body_file, "w", encoding="utf-8") as f:
        f.write(body)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(
            "Usage: extract_pr_details.py <title_output_file> <body_output_file>",
            file=sys.stderr,
        )
        sys.exit(1)

    # 標準入力から全文を読み込む
    input_text = sys.stdin.read()

    extract_pr_details(input_text, sys.argv[1], sys.argv[2])

