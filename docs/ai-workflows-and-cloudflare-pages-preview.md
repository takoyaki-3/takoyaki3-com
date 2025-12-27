---
title: "Cline-CLI on GitHub Actions で自動コーディング"
emoji: "rocket"
type: "tech"
topics:
  - "github"
  - "githubactions"
  - "cline"
  - "ai"
  - "cloudflare"
published: false
---

## はじめに

本記事は「Issue 起点の自動修正」と「PR コメント起点の追修正」という 2 つのワークフローを前提に、AI コーディングを開発フローへ組み込む方法を整理します。Issue を起点に AI が自動でブランチ作成、修正、PR 作成まで進める仕組みは、実運用の中で大きな時短になります。さらに、PR 上で追加の修正依頼を投げられると、レビューと修正が往復しやすくなります。

この記事では、次の 2 つのワークフローと、Cloudflare Pages でのプレビュー導線までをまとめます。

- Issue から AI が PR を作成するワークフロー
- PR コメントで @Cline に追修正を依頼できるワークフロー
- Cloudflare Pages で PR ごとのプレビューを確認する仕組み

両ワークフローとも、AI 実行の入口として Cline CLI を利用し、`cline -y -m act` でプロンプトを流しています。

## 全体像

全体の流れは次のとおりです。

1. Issue に `cline-coding` ラベルを付けると AI が修正と PR 作成を実行
2. PR 上で `@Cline` コメントを付けると AI が追修正コミットを追加
3. Cloudflare Pages の GitHub 連携で PR のプレビューを自動生成

### 1) Issue から PR を作る AI ワークフロー

対象ファイル: `.github/workflows/ai-coding-from-issue.yml`

- `issues` イベント（opened, labeled）をトリガー
- `cline-coding` ラベルが付いた Issue のみ実行
- Cline + OpenRouter を使って修正、コミット、PR 作成まで自動化

### 2) PR コメントから追修正する AI ワークフロー

対象ファイル: `.github/workflows/ai-coding-from-pr-comment.yml`

- `issue_comment` の created をトリガー
- PR コメントに `@Cline` が含まれている場合だけ実行
- PR ブランチに追修正コミットを追加

### 3) Cloudflare Pages プレビュー

PR 単位の変更を、実際の画面で確認できるようにします。Cloudflare Pages の GitHub 連携で自動プレビューする構成に絞ります。

## Issue → PR ワークフローの詳細

ワークフローの全文は次のリンクから確認してください。※記事執筆後の改良で変更されている可能性があります。

- https://github.com/takoyaki-3/takoyaki3-com/blob/main/.github/workflows/ai-coding-from-issue.yml

以下はワークフロー内の主要ステップを抜粋し、コード片の直後に解説を挟む形式で整理したものです。

### 0. トリガーと権限

```yaml
on:
  issues:
    types: [opened, labeled]

permissions:
  contents: write
  pull-requests: write
  issues: write

jobs:
  ai-coding:
    if: contains(github.event.issue.labels.*.name, 'cline-coding')
```

Issue の作成・ラベル付与をトリガーにしつつ、`cline-coding` ラベルがある Issue のみを対象にしています。`contents: write` と `pull-requests: write` を付けているのは、ブランチ作成や PR 作成を Actions から行うためです。

### 1. 実行環境の準備

```yaml
- name: Checkout repository
  uses: actions/checkout@v4
  with:
    fetch-depth: 0

- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'

- name: Setup Python
  uses: actions/setup-python@v4
  with:
    python-version: '3.13'

- name: Install dependencies
  run: npm ci

- name: Install Cline CLI
  run: |
    npm install -g cline@1.0.7
    cline version
```

Cline CLI は npm でインストールし、Node と Python を揃えたうえで実行します。`fetch-depth: 0` は差分生成や履歴参照を安定させるための設定です。

### 2. ブランチ名の自動生成

```yaml
- name: Create feature branch (human-readable & unique)
  env:
    ISSUE_TITLE: ${{ github.event.issue.title }}
  run: |
    ISSUE_NUM="${{ github.event.issue.number }}"
    RUN_ID="${{ github.run_id }}"
    RUN_ATTEMPT="${{ github.run_attempt }}"
    SAFE_TITLE=$(echo "$ISSUE_TITLE" | iconv -f UTF-8 -t ASCII//TRANSLIT 2>/dev/null || echo "$ISSUE_TITLE")
    SAFE_TITLE=$(echo "$SAFE_TITLE" | tr '[:upper:]' '[:lower:]')
    SAFE_TITLE=$(echo "$SAFE_TITLE" | sed 's/[^a-z0-9]/-/g')
    SAFE_TITLE=$(echo "$SAFE_TITLE" | sed 's/-\+/-/g')
    SAFE_TITLE=$(echo "$SAFE_TITLE" | sed 's/^-//' | sed 's/-$//')
    SAFE_TITLE=$(echo "$SAFE_TITLE" | cut -c1-40)
    if [ -z "$SAFE_TITLE" ]; then SAFE_TITLE="update"; fi
    BRANCH_NAME="ai-fix-issue-${ISSUE_NUM}-${SAFE_TITLE}-run-${RUN_ID}-attempt-${RUN_ATTEMPT}"
    git checkout -b "$BRANCH_NAME"
    echo "BRANCH_NAME=$BRANCH_NAME" >> $GITHUB_ENV
```

Issue タイトルを ASCII 化し、ブランチ名に使える形へ正規化します。`run_id` と `run_attempt` を含めることで実行ごとにユニークになります。

### 3. 処理中ラベルの付与

```yaml
- name: Mark issue as in progress
  uses: actions/github-script@v7
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    script: |
      const labels = [
        { name: 'ai-processing', color: '0E8A16', description: 'AI job is running' },
        { name: 'ai-processed', color: '1D76DB', description: 'AI job completed' },
        { name: 'ai-failed', color: 'B60205', description: 'AI job failed' },
      ];
      await github.rest.issues.addLabels({
        owner,
        repo,
        issue_number,
        labels: ['ai-processing'],
      });
```

処理開始時に `ai-processing` を付けることで、Issue 一覧で進行中が一目で分かるようにします。ラベルが存在しない場合はスクリプト内で作成されます。

### 4. Cline 実行とプロンプト構築

```yaml
- name: Run Cline AI Coding
  env:
    OPEN_ROUTER_API_KEY: ${{ secrets.OPEN_ROUTER_API_KEY }}
    ISSUE_TITLE: ${{ github.event.issue.title }}
    ISSUE_BODY: ${{ github.event.issue.body }}
    GH_TOKEN: ${{ github.token }}
  run: |
    cline auth --provider "openrouter" --apikey "$OPEN_ROUTER_API_KEY" --modelid "google/gemini-3-flash-preview" || true
    gh issue view "$ISSUE_NUM" --json comments --jq '.comments[] | "### " + .author.login + "\n" + (.body // "") + "\n"' > "$COMMENTS_FILE" || true
    echo "## 過去の議論（Issueコメント）" >> /tmp/prompt.txt
    cat "$COMMENTS_FILE" >> /tmp/prompt.txt
    if ! cline -y -m act < /tmp/prompt.txt; then
      sleep 5
      cline -y -m act < /tmp/prompt.txt
    fi
```

Issue 本文だけでなくコメント履歴も取り込み、過去の議論を踏まえた提案が出るようにしています。Cline CLI でプロンプトを実行し、失敗時はリトライします。

### 5. 自動チェック（任意）

```yaml
- name: Run project checks
  if: ${{ false }}
  run: |
    npm run lint
    npm run build
```

lint/build を回す仕組みは用意していますが、デフォルトでは無効化しています。必要に応じて `if: ${{ false }}` を外して有効化します。

### 6. コミットメッセージ生成と push

```yaml
- name: Commit and push changes
  run: |
    if [ -n "$(git status --porcelain)" ]; then
      git add .
      cline -y -m act < /tmp/commit_prompt.txt > /tmp/raw_commit_msg.txt
      sed -n '/<COMMIT_MESSAGE>/,/<\/COMMIT_MESSAGE>/p' /tmp/raw_commit_msg.txt | sed 's/<COMMIT_MESSAGE>//;s/<\/COMMIT_MESSAGE>//' > /tmp/ai_commit_msg.txt
      git commit -F /tmp/ai_commit_msg.txt
      git push origin "$BRANCH_NAME"
    fi
```

差分がある場合のみコミットを作成し、Cline で Conventional Commits のメッセージを生成して push します。

### 7. PR タイトル・本文の生成と正規化

```yaml
- name: Generate PR title and body (Cline writes files)
  run: |
    rm -f /tmp/ai_pr_title.txt /tmp/ai_pr_body.txt
    OUT="$(cline -y -m act < /tmp/pr_prompt.txt || true)"
    echo "$OUT" | grep -q "PR_FILES_WRITTEN"
    PR_TITLE="$(head -n 1 /tmp/ai_pr_title.txt | tr -d '\r' | sed 's/[[:space:]]\+$//')"
    printf '%s\n' "$PR_TITLE" > /tmp/ai_pr_title.txt
```

PR のタイトル/本文は Cline がファイルに書き込みます。タイトルは 1 行に正規化し、余計な改行で失敗しないようにしています。

### 8. PR 作成と Issue 更新

```yaml
- name: Create Pull Request
  run: |
    gh pr create \
      --title "$PR_TITLE" \
      --body-file /tmp/ai_pr_body.txt \
      --base main \
      --head "$BRANCH_NAME"
```

```yaml
- name: Comment on Issue (Success)
  uses: actions/github-script@v7
  ...

- name: Update labels on success
  uses: actions/github-script@v7
  ...
```

`gh pr create` で PR を作成し、Issue へコメントとラベル更新を行います。成功・失敗でラベルが切り替わるため、Issue の状態管理が明確になります。

## PR コメントからの追修正ワークフロー

ワークフローの全文は次のリンクから確認してください。※記事執筆後の改良で変更されている可能性があります。

- https://github.com/takoyaki-3/takoyaki3-com/blob/main/.github/workflows/ai-coding-from-pr-comment.yml

こちらも同様に、ステップごとのコード片と解説で整理します。

### 0. トリガーと対象の判定

```yaml
on:
  issue_comment:
    types: [created]

jobs:
  ai-pr-followup:
    if: github.event.issue.pull_request && (contains(github.event.comment.body, '@Cline') || contains(github.event.comment.body, '@cline'))
```

PR に紐づくコメントで、かつ本文に `@Cline` が含まれている場合だけ起動します。

### 1. PR 情報の取得

```yaml
- name: Get PR info
  uses: actions/github-script@v7
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    script: |
      const { data: pr } = await github.rest.pulls.get({
        owner,
        repo,
        pull_number: issue_number,
      });
      core.setOutput('head_ref', pr.head.ref);
      core.setOutput('head_repo', pr.head.repo.full_name);
      core.setOutput('is_fork', pr.head.repo.full_name !== `${owner}/${repo}`);
```

PR のブランチやフォーク判定をここで行い、後続の処理に必要な情報を出力として渡します。

### 2. フォーク PR への安全ガード

```yaml
- name: Comment on forked PR
  if: steps.pr.outputs.is_fork == 'true'
  uses: actions/github-script@v7
  env:
    COMMENT_BODY: |
      Thanks for the request. This workflow cannot push changes to forked PRs.
      Please apply the changes in the fork or open the PR from the main repo.
```

フォーク PR は権限の都合で push できないため、ここで処理を止めて案内コメントを返します。

### 3. チェックアウトと実行環境の準備

```yaml
- name: Checkout PR branch
  uses: actions/checkout@v4
  with:
    repository: ${{ steps.pr.outputs.head_repo }}
    ref: ${{ steps.pr.outputs.head_ref }}

- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'

- name: Setup Python
  uses: actions/setup-python@v4
  with:
    python-version: '3.13'

- name: Install dependencies
  run: npm ci

- name: Install Cline CLI
  run: |
    npm install -g cline@1.0.7
    cline version
```

PR ブランチに対して Cline を実行できるよう、Issue ワークフローと同様の環境を整えます。

### 4. Cline による追修正

```yaml
- name: Run Cline for requested PR changes
  env:
    PR_TITLE: ${{ steps.pr.outputs.pr_title }}
    PR_BODY: ${{ steps.pr.outputs.pr_body }}
    COMMENT_AUTHOR: ${{ github.event.comment.user.login }}
    COMMENT_BODY: ${{ github.event.comment.body }}
  run: |
    echo "PR #$PR_NUMBER: $PR_TITLE" > /tmp/pr_fix_prompt.txt
    echo "## Request from PR comment" >> /tmp/pr_fix_prompt.txt
    echo "@$COMMENT_AUTHOR" >> /tmp/pr_fix_prompt.txt
    printf '%s\n' "$COMMENT_BODY" >> /tmp/pr_fix_prompt.txt
    if ! cline -y -m act < /tmp/pr_fix_prompt.txt; then
      sleep 5
      cline -y -m act < /tmp/pr_fix_prompt.txt
    fi
```

PR 本文とコメント内容を併せてプロンプトに渡し、Cline で追加修正を適用します。リトライの動きは Issue ワークフローと同じです。

### 5. 追修正コミットの作成

```yaml
- name: Commit and push updates
  run: |
    if [ -n "$(git status --porcelain)" ]; then
      git add .
      git commit -m "fix: $SUBJECT"
      git push origin HEAD
    fi
```

PR ブランチに直接コミットを追加するため、既存 PR に対して差分が積み上がる形になります。

### 6. PR への結果通知

```yaml
- name: Comment on PR (updated)
  uses: actions/github-script@v7
  ...

- name: Comment on PR (no changes)
  uses: actions/github-script@v7
  ...
```

変更があった場合はコミット情報付きでコメントし、差分が無い場合は確認依頼を返します。

## Cloudflare Pages で PR プレビューを実現する

### Cloudflare Pages の GitHub 連携を使う

一番シンプルで、PR ごとのプレビューが自動作成されます。

1. Cloudflare Pages で新規プロジェクトを作成
2. GitHub リポジトリを連携
3. Build command を `npm run build` に設定
4. Output directory を `dist` に設定（Vite の標準出力）
5. Node.js バージョンを 20 に設定（必要なら環境変数 `NODE_VERSION=20`）

この設定で、PR が開かれるたびに `https://<branch>.<project>.pages.dev` 形式の Preview URL が生成されます。

## 運用のポイント

- @Cline の実行権限を絞りたい場合は、コメント投稿者の `author_association` をチェックする
- 重要な環境変数は Cloudflare Pages の環境設定に集約する
- Preview URL を PR に自動コメントする運用にするとレビューがよりスムーズ

## まとめ

Issue 起点の自動コーディングと、PR コメントでの追修正を組み合わせると、AI を「レビューと修正の往復」にも組み込めます。さらに Cloudflare Pages の Preview を入れることで、UI 変更をすぐに確認できる状態になります。

この 3 点セットは、フロントエンド中心のプロジェクトでは特に効果的です。必要に応じて、権限管理やレビューのフローに合わせて調整していくのがおすすめです。
