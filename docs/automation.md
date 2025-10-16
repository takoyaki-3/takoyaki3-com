自動化: GitHub Actions で OpenHands + Gemini を使う

前提条件
- リポジトリのシークレットに `GEMINI_API_KEY`（Gemini の API キー）を登録する。
- PR 作成にはデフォルトの `GITHUB_TOKEN` で十分（追加の PAT は不要）。

ワークフロー
- `.github/workflows/openhands-pr.yml`
  - 手動トリガー（workflow_dispatch で goal を指定）または Issue コメント `/openhands pr <goal>` で起動。
  - OpenHands（Docker）を Gemini（`gemini-1.5-pro`）で実行し、変更があれば PR を作成。
  - メモ: OpenHands の CLI フラグが環境によって異なる場合は、`docker run` の引数を適宜調整してください。

- `.github/workflows/qa-gemini.yml`
  - Issue に `/ask <質問内容>` とコメントすると起動。
  - Gemini に質問を送り、回答を Issue コメントとして返信します。

使い方（例）
- 手動: Actions → 「OpenHands PR Bot」→ Run workflow → "goal" を入力して実行。
- Issue コメント（PR 作成）: `/openhands pr 単体テストを実行する CI ステップを追加`
- Q&A: `/ask ローカルでの起動方法を教えてください`

必要な権限（permissions）
- PR 用ワークフロー: `contents: write`, `pull-requests: write`, `issues: write`
- Q&A ワークフロー: `issues: write`

トラブルシューティング
- OpenHands のコマンド/フラグ不一致で失敗する場合は、使用している OpenHands イメージに合わせて `docker run` の引数を修正してください。
- `GEMINI_API_KEY` が未設定または無効な場合、リクエストは失敗します。リポジトリの Secrets を確認してください。
