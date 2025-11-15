#!/usr/bin/env python3
"""
Cline AI の出力から PR タイトルと本文を抽出するスクリプト。
"""
import re
import sys


def _has_alnum(text: str) -> bool:
    """Return True if text contains any alphanumeric character (including CJK)."""
    return any(ch.isalnum() for ch in text)


def _is_weak_title(text: str) -> bool:
    """タイトルとして明らかに弱い（短すぎる・記号だけなど）かどうかを判定。"""
    normalized = text.strip()
    if not normalized:
        return True
    # 1〜3 文字程度のタイトルはさすがに弱い（例: 「と」「OK」など）
    if len(normalized) <= 3:
        return True
    # 記号や空白だけのタイトルも弱いとみなす
    if not _has_alnum(normalized):
        return True
    return False


def _is_weak_body(text: str) -> bool:
    """PR 本文として明らかに弱いかどうかを判定。"""
    normalized = text.strip()
    if not normalized:
        return True
    # 数文字だけ（例: 「と」）の本文は PR 説明として不十分
    if len(normalized) <= 5:
        return True
    # 記号や空白だけの本文も弱い
    if not _has_alnum(normalized):
        return True
    return False


def extract_pr_details(input_text: str, title_file: str, body_file: str) -> None:
    """
    標準入力から受け取ったテキストから PR のタイトルと本文を抽出する。

    想定フォーマット（タグは大文字/小文字やスペースの有無は許容）:
      <PR_TITLE>Title text</PR_TITLE>
      <PR_BODY>Body text</PR_BODY>

    フォールバック: タグが見つからない場合は '---' で前後を分割して使用する。
    """
    tag_flags = re.DOTALL | re.IGNORECASE
    title_match = re.search(
        r"<\s*PR_TITLE\s*>(.*?)<\s*/\s*PR_TITLE\s*>", input_text, tag_flags
    )
    body_match = re.search(
        r"<\s*PR_BODY\s*>(.*?)<\s*/\s*PR_BODY\s*>", input_text, tag_flags
    )

    title = title_match.group(1).strip() if title_match else ""
    body = body_match.group(1).strip() if body_match else ""

    # タグが無い／片方だけのときにも使えるように、汎用フォールバックを一度計算しておく。
    parts = input_text.split("---", 1)
    if len(parts) >= 2:
        fallback_title = parts[0].strip()
        fallback_body = parts[1].strip()
    else:
        fallback_title = ""
        fallback_body = input_text.strip()

    # タイトル／本文のどちらかが空ならフォールバックを使う。
    if not title:
        title = fallback_title
    if not body:
        body = fallback_body

    # 本文が明らかに弱い（例: 「と」）場合は、よりマシな候補を探す。
    if _is_weak_body(body):
        candidate = fallback_body
        if _is_weak_body(candidate):
            # タグ行を除いた全文から再度候補を作る。
            cleaned_lines = []
            for line in input_text.splitlines():
                if re.search(r"PR_TITLE|PR_BODY", line, re.IGNORECASE):
                    continue
                cleaned_lines.append(line)
            candidate = "\n".join(cleaned_lines).strip()

        if not _is_weak_body(candidate):
            body = candidate

    # まだ弱い場合は完全にフォールバックの定型文にする。
    if _is_weak_body(body):
        body = (
            "このPRはAIによって自動生成されましたが、"
            "本文の抽出に失敗した可能性があります。コミットメッセージや diff を確認してください。"
        )

    # タイトルも弱い場合は、本文の先頭行から拾うか、最後の最後でデフォルトタイトルを使う。
    if _is_weak_title(title):
        candidate = ""
        for line in body.splitlines():
            line = line.strip()
            if line:
                candidate = line
                break
        if not _is_weak_title(candidate):
            title = candidate
        else:
            title = "AI による自動PR"

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

    # 標準入力から Cline の出力全文を読み込む
    input_text = sys.stdin.read()

    extract_pr_details(input_text, sys.argv[1], sys.argv[2])

