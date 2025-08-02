// ページネーション設定
export const PAGINATION_CONFIG = {
  DEFAULT_PER_PAGE: 10,
  PER_PAGE_OPTIONS: [10, 20, 50],
} as const

// フィルター設定
export const FILTER_CONFIG = {
  DEBOUNCE_DELAY: 500, // ms
  RESET_PAGE_ON_FILTER: true,
} as const

// 画像アップロード設定
export const IMAGE_CONFIG = {
  MAX_IMAGES: 3,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
} as const

// 通知設定
export const NOTIFICATION_CONFIG = {
  DURATION: {
    ERROR: 6000,
    WARNING: 5000,
    SUCCESS: 3000,
    INFO: 4000,
  },
  POSITION: {
    VERTICAL: 'bottom' as const,
    HORIZONTAL: 'center' as const,
  },
} as const

// API設定
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  TIMEOUT: 10000, // ms
} as const