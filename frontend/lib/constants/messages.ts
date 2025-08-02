// 成功メッセージ
export const SUCCESS_MESSAGES = {
  TASK_CREATED: 'タスクを追加しました',
  TASK_DELETED: 'タスクを削除しました',
  TASK_UPDATED: 'タスクを更新しました',
} as const

// エラーメッセージ
export const ERROR_MESSAGES = {
  TASK_FETCH_FAILED: 'タスクの取得に失敗しました',
  TASK_CREATE_FAILED: 'タスクの追加に失敗しました',
  TASK_UPDATE_FAILED: 'タスクの更新に失敗しました',
  TASK_DELETE_FAILED: 'タスクの削除に失敗しました',
} as const

// ローディングメッセージ
export const LOADING_MESSAGES = {
  LOADING_TASKS: 'タスクを読み込み中...',
  LOADING_DEFAULT: '読み込み中...',
  PROCESSING: '処理中...',
} as const

// UI文字列
export const UI_TEXT = {
  APP_TITLE: 'タスク管理アプリ',
  ADD_NEW_TASK: '新しいタスクを追加',
  TASK_LIST: 'タスク一覧',
  ADD_TASK_BUTTON: 'タスクを追加',
  TASK_TITLE_LABEL: 'タスクのタイトル',
  TASK_DESCRIPTION_LABEL: 'タスクの説明（任意）',
  PRIORITY_LABEL: '優先度',
  SEARCH_FILTERS: '検索・フィルター',
  SEARCH_PLACEHOLDER: 'タスクを検索...',
  CLEAR_ALL_FILTERS: 'すべてクリア',
  ACTIVE_FILTERS: 'アクティブフィルター:',
} as const

// 優先度の表示文字列
export const PRIORITY_LABELS = {
  high: '高',
  medium: '中',
  low: '低',
} as const

// 完了状態の表示文字列
export const COMPLETION_LABELS = {
  completed: '完了済み',
  incomplete: '未完了',
  all: 'すべて',
} as const