#!/usr/bin/env python3
"""
Cline AI の出力から PR タイトルと本文を抽出するスクリプト。

- `<PR_TITLE>...</PR_TITLE>` / `<PR_BODY>...</PR_BODY>` を優先して利用
- タグが入れ子になっている場合は、一番「深い」側（後ろ側）のタグ内テキストを採用
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


def _normalize_body(text: str) -> str:
    """
    本文内の余計な空行や末尾の空白を整形する。
    行数・文字数は基本的に制限しない（ユーザーの指示優先）。
    """
    if not text:
        return ""

    lines = [line.rstrip() for line in text.splitlines()]

    # 先頭・末尾の空行を削除
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()

    # 連続する空行は 1 行に圧縮
    compressed = []
    blank = False
    for line in lines:
        if line.strip():
            compressed.append(line)
            blank = False
        else:
            if not blank:
                compressed.append("")
                blank = True

    return "\n".join(compressed).rstrip()


def _extract_deepest_tag_content(input_text: str, tag_name: str) -> str:
    """
    指定タグの内容をすべて抽出し、そのうち「一番深い」とみなせる最後のマッチを返す。

    例:
      <PR_BODY>outer <PR_BODY>inner</PR_BODY></PR_BODY>
    の場合、inner が採用される。
    """
    pattern = rf"<\s*{tag_name}\s*>(.*?)<\s*/\s*{tag_name}\s*>"
    matches = list(
        re.finditer(pattern, input_text, flags=re.DOTALL | re.IGNORECASE)
    )
    if not matches:
        return ""

    # 最後のマッチ（もっとも「内側」とみなせるもの）を使う
    for match in reversed(matches):
        content = match.group(1).strip()
        if content:
            return content
    # すべて空白の場合は最後のもの
    return matches[-1].group(1).strip()


def extract_pr_details(input_text: str, title_file: str, body_file: str) -> None:
    """
    標準入力から受け取ったテキストから PR のタイトルと本文を抽出する。

    優先順位:
      1. 最も内側の <PR_TITLE>/<PR_BODY> タグの内容
      2. なければ '---' で分割した前半/後半
      3. それでも弱すぎる本文の場合は、タグ行を除いた全文
      4. 最後の最後は定型文
    """
    # 1. ネスト対応: 最も内側のタグから抽出
    title = _extract_deepest_tag_content(input_text, "PR_TITLE")
    body = _extract_deepest_tag_content(input_text, "PR_BODY")

    # 2. フォールバック用に '---' で分割
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

    # 3. 本文が明らかに弱い（例: 「と」）場合は、よりマシな候補を探す。
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

    # 4. まだ弱い場合は完全にフォールバックの定型文にする。
    if _is_weak_body(body):
        body = (
            "このPRはAIによって自動生成されましたが、"
            "本文の抽出に失敗した可能性があります。コミットメッセージや diff を確認してください。"
        )

    # 本文の軽い整形（空行圧縮など）
    body = _normalize_body(body)

    # タイトルが弱い場合は、本文の先頭行から拾うか、最後にデフォルトタイトルを使う。
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

