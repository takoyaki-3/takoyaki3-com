---
title: "GitHub Issues から Cline で AI コーディングを自動化するワークフロー解説"
emoji: "x"
type: "tech"
topics:
  - "github"
  - "githubactions"
  - "cline"
  - "ai"
published: false
---

## はじめに

GitHub Actions と AI コーディングエージェントを組み合わせることで、「Issue を立ててラベルを付けるだけで、AI がブランチを切って修正を行い、Pull Request まで作ってくれる」フローを構築できます。

この記事では、`.github/workflows/ai-coding-from-issue.yml` で実装しているワークフローを題材に、

- どのように Issue から自動で AI コーディングを走らせているのか
- Cline CLI と OpenRouter API をどう組み合わせているのか
- 品質担保や PR 作成までをどこまで自動化しているのか

を解説します。

## ワークフローの全体像

ワークフロー名は「AI Coding from Issue with Cline」で、GitHub Issue をトリガーに動作します。

- **トリガー**: `issues` イベント（`opened`, `labeled`）
- **条件**: Issue に `cline-coding` ラベルが付いている場合のみ実行
- **実行環境**: `ubuntu-latest`
- **タイムアウト**: 30 分

Issue 側から見ると、

1. Issue を作成する
2. `cline-coding` ラベルを付ける

だけで、後続の処理はすべて GitHub Actions 上で自動実行されます。

## 事前準備と依存関係

ワークフローの前半では、AI コーディングを行うための環境をセットアップしています。

- リポジトリのチェックアウト（`actions/checkout@v4`）
- Node.js 20 のセットアップ（`actions/setup-node@v4`、npm キャッシュ有効化）
- Python 3.13 のセットアップ（`actions/setup-python@v4`）
- `npm ci` による依存関係のインストール
- Cline CLI のグローバルインストール

```bash
npm install -g cline
cline version
```

このリポジトリでは、Cline CLI を AI エージェントのフロントエンドとして利用し、モデル本体には OpenRouter 経由の `openai/gpt-5.1` を使っています。

## Issue から人間に読みやすいブランチ名を生成

AI が触るとはいえ、日々の開発運用ではブランチ名の見やすさも重要です。このワークフローでは、Issue タイトルから安全なブランチ名を自動生成しています。

1. Issue 番号（`ISSUE_NUM`）と Actions の `run_id` を取得
2. Issue タイトルを ASCII ベースに変換（`iconv` でのトランスリテレーション）
3. 小文字化・英数字以外をハイフンに置換
4. 連続ハイフンの圧縮、先頭末尾のハイフン除去
5. 40 文字にトリム
6. 空になった場合は `"update"` にフォールバック

最終的なブランチ名は次のような形式になります。

```bash
BRANCH_NAME="ai-fix-issue-${ISSUE_NUM}-${SAFE_TITLE}-run-${RUN_ID}"
```

これにより、

- どの Issue から生まれたブランチか
- ブランチが何のための変更か（Issue タイトル由来）
- どの Actions 実行で生成されたか

が一目で分かるようになっています。

その後、Git のユーザー情報を Cline 用に設定し、このブランチにチェックアウトします。ブランチ名は環境変数 `BRANCH_NAME` として後続ステップからも参照できるように `GITHUB_ENV` に書き込んでいます。

## Cline に渡すプロンプト設計

AI エージェントに任せるとはいえ、「どういう粒度で、どこまでやってよいか」を明確に伝えなければ、期待した変更にはなりません。そこで、`Run Cline AI Coding` ステップでは `/tmp/prompt.txt` に次のような情報を組み立ててから Cline を実行しています。

1. Issue 番号とタイトル
2. Issue 本文
3. プロジェクト独自ルール（.clinerules 相当）
4. 開発・レビュー観点のチェックリスト

具体的には、日本語で次のような指示が列挙されています（抜粋・要約）。

- 変更対象には必要に応じてテストコード（および Storybook）を追加・更新すること
- 最後に `npm run lint` / `npm run build` を実行し、エラーがない状態にすること
- コードの全体像やスタイルを崩さないこと
- 過度に複雑なエラーハンドリングを避けつつ、必要な範囲ではしっかり扱うこと
- 必要に応じてテストやビルド手順を更新すること

こうした「プロジェクトルール」を明示しておくことで、AI からの提案がこのリポジトリの開発文化から外れにくくなります。

プロンプトを組み立てた後、次のように Cline を起動します。

```bash
cline -y -m act < /tmp/prompt.txt
```

一度失敗した場合はメッセージを出しつつ数秒待ってリトライするようになっており、外部 API 側の一時的なエラーに対してある程度の耐性を持たせています。

## 自動チェックと AI による再修正の下ごしらえ

ワークフローの中盤には、次のようなステップが用意されています。

- `Run project checks`
- `Fix checks failures if needed`

現状は `if: ${{ false }}` で明示的に無効化されていますが、意図としては以下のような設計になっています。

### Run project checks

- `npm run lint`
- `npm run build`

を実行し、それぞれの終了コードを取得して `checks_result` という出力に反映する構造です。

将来的にここを有効化すると、

- AI が行った変更に lint / build エラーがないか
- どちらが失敗したか

を機械的に判定できるようになります。

### Fix checks failures if needed

こちらも現状は無効化されていますが、

- lint / build のログを含んだ追加プロンプトを `/tmp/fix_prompt.txt` に構築
- Cline に再度修正コードの作成を依頼
- 修正後に再度 `npm run lint` / `npm run build` を実行

という「AI による自動デバッグサイクル」を実現するためのステップです。

lint やビルドエラーを手作業で読み解く手間を減らし、ある程度までは AI が自動でリカバリしてくれるような構成を目指しています。

## コミットメッセージも AI に任せる

コード変更が終わったら、次はコミットと Push です。このワークフローではコミットメッセージも Cline に生成させています。

1. Stage 済みの差分（`git diff --staged`）と Issue タイトルを `commit_prompt.txt` に書き出す
2. Conventional Commits スタイル（`feat: ...`, `fix: ...` など）でのメッセージ作成を依頼
3. 本文は複数行の詳細説明を書けるようにしつつ、最初の 1 行は 50 文字程度に収まるよう指示
4. `<COMMIT_MESSAGE>...</COMMIT_MESSAGE>` タグの中にコミットメッセージ全文を埋め込むよう Cline に要請
5. 生成結果からタグ部分だけを `sed` で抽出し、`/tmp/ai_commit_msg.txt` に保存
6. `git commit -F /tmp/ai_commit_msg.txt` でコミット、続けて `git push origin "$BRANCH_NAME"` を実行

これにより、

- 差分内容に沿った意味のあるコミットメッセージ
- チームの規約（Conventional Commits）に沿ったフォーマット

を半自動で満たすことができます。

ステージングされた差分が存在しない場合には、「変更はありません」とログを出して `has_changes=false` を出力し、後続の PR 作成処理がスキップされるようになっています。

## PR タイトル・本文の自動生成

コミットが作られた後は、その内容を元に PR のタイトルと本文も Cline に生成させます。

1. PR 用プロンプト `/tmp/pr_prompt.txt` を構築
   - PR タイトル・本文の書き方に関するガイドライン
   - Issue 番号・タイトル・本文
   - 生成されたコミットメッセージ
   - `origin/main...HEAD` の差分
2. Cline に対して、`<PR_TITLE>...</PR_TITLE>` と `<PR_BODY>...</PR_BODY>` タグの中にそれぞれ出力するよう依頼
3. 生成されたテキストを `.github/scripts/extract_pr_details.py` にパイプで渡し、タグ部分だけを抽出して
   - `/tmp/ai_pr_title.txt`
   - `/tmp/ai_pr_body.txt`
   に保存

PR タイトルには、

- `feat: ...` や `fix: ...` といった先頭の種別
- どの Issue に対応しているか

などが盛り込まれるようにガイドしており、レビューする人が内容を把握しやすい形を狙っています。

## GitHub CLI で PR を作成

PR タイトルと本文がファイルに出力されたら、GitHub CLI（`gh`）を使って PR を作成します。

- タイトル: `/tmp/ai_pr_title.txt` の内容
- 本文: `/tmp/ai_pr_body.txt` の内容
- ベースブランチ: `main`
- ヘッドブランチ: 先ほど生成した `BRANCH_NAME`
- 付与ラベル: `"ai-generated"`, `"needs-review"`

作成後には `gh pr list --head "$BRANCH_NAME"` から PR 番号を取得し、環境変数 `PR_NUMBER` として `GITHUB_ENV` に書き込みます。これを後続の Issue コメント用ステップで利用します。

## Issue へのコメントとラベル操作

ワークフローの最後では、GitHub の Issue に対して結果をフィードバックします。

### 成功時

- `actions/github-script@v7` を使って `issues.createComment` を実行
- 「Cline AI による PR を作成した」旨と、レビューすべき PR 番号を案内
- 元の Issue に `"ai-processed"` ラベルを追加

これにより、

- どの Issue が AI により処理されたか
- 対応する PR がどれか

が Issue 一覧からひと目で分かるようになります。

### 失敗時

ワークフローが失敗した場合には、別のコメントテンプレートが呼び出されます。

- Actions の実行ログへのリンクを案内
- 見直すべきポイント（Issue 内容、権限設定、API キー、テストやビルドの実行状況など）を箇条書きで提示

AI による自動処理が失敗しても、開発者が次に何を確認すればよいかが分かるようになっています。

## このワークフローから学べるポイント

このワークフローは、単に「AI にコードを書かせる」だけではなく、実運用を意識した設計になっています。

- Issue ラベルをトリガーにすることで、自動化したい Issue だけを明示的に選べる
- ブランチ名やコミットメッセージ、PR タイトルなど、人間が日常的に目にする部分も AI に任せつつ、スタイルをガイドしている
- lint / build をワークフローに組み込み、将来的には AI による自動修正サイクルまで見据えている
- 成功・失敗時それぞれのユーザー通知を整備し、「動いているのか分からない」状態を避けている

## 発展アイデア

同様の仕組みを自分のプロジェクトに取り入れる場合、以下のようなカスタマイズも考えられます。

- `Run project checks` を有効化し、lint / build の結果に応じて自動修正を試みる
- `.clinerules` やプロンプトをプロジェクトに合わせてチューニングする
- `issues` 以外に、`pull_request` へのコメントやスラッシュコマンドをトリガーにする
- モデルごとにプロンプトを分けたり、実験的なブランチでのみ AI を有効化したりする

AI コーディングはまだ発展途上の領域ですが、GitHub Actions と組み合わせることで「安全に」「少しずつ」導入していくことができます。このワークフローが、その一例として参考になれば幸いです。

