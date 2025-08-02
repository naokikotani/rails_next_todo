# タスク管理アプリ（Todo App）

Rails APIモードとNext.jsを組み合わせたシンプルなタスク管理アプリケーションです。

## 技術スタック

### バックエンド
- Ruby on Rails（APIモード）
- SQLite3
- CORS対応

### フロントエンド
- Next.js 14
- TypeScript
- Material-UI (MUI)
- Tailwind CSS

## 機能

- タスクの一覧表示
- タスクの新規作成
- タスクの完了/未完了の切り替え
- タスクの削除

## セットアップ手順

### 1. リポジトリのクローン

```bash
cd todo-app
```

### 2. Dockerコンテナの起動

```bash
docker-compose up -d
```

### 3. データベースのセットアップ

```bash
# Railsコンテナに入る
docker-compose exec backend bash

# データベースの作成とマイグレーション
rails db:create
rails db:migrate
rails db:seed  # サンプルデータの投入（任意）
exit
```

### 4. アプリケーションへのアクセス

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:3001

## API エンドポイント

| メソッド | パス | 説明 |
|---------|------|------|
| GET | /tasks | タスク一覧の取得 |
| POST | /tasks | 新規タスクの作成 |
| PUT | /tasks/:id | タスクの更新 |
| DELETE | /tasks/:id | タスクの削除 |

## 開発コマンド

### バックエンド

```bash
# Railsコンソール
docker-compose exec backend rails console

# マイグレーションの実行
docker-compose exec backend rails db:migrate

# ログの確認
docker-compose logs -f backend
```

### フロントエンド

```bash
# パッケージのインストール
docker-compose exec frontend npm install

# ログの確認
docker-compose logs -f frontend
```

## Docker コマンド

```bash
# コンテナの起動
docker-compose up -d

# コンテナの停止
docker-compose down

# コンテナの再起動
docker-compose restart

# コンテナのビルドし直し
docker-compose build --no-cache
```

## トラブルシューティング

### CORSエラーが発生する場合

`backend/config/initializers/cors.rb` のorigins設定を確認してください。

### データベースエラーが発生する場合

```bash
docker-compose exec backend rails db:drop db:create db:migrate
```

## 今後の拡張案

- ユーザー認証機能の追加
- タスクのカテゴリー分け
- 期限設定機能
- 検索・フィルター機能
- ドラッグ&ドロップでの並び替え