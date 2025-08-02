'use client'

import { Box, Button, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { PaginationInfo } from '@/lib/types'

interface PaginationProps {
  pagination: PaginationInfo
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
}

export default function Pagination({ pagination, onPageChange, onPerPageChange }: PaginationProps) {
  const { current_page, total_pages, total_count, per_page, next_page, prev_page } = pagination

  const generatePageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, current_page - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(total_pages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  const startItem = (current_page - 1) * per_page + 1
  const endItem = Math.min(current_page * per_page, total_count)

  return (
    <Box className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
      {/* 表示件数情報 */}
      <Typography variant="body2" className="text-gray-600">
        {total_count === 0 
          ? '0件の結果'
          : `${startItem}〜${endItem}件（全${total_count}件）`
        }
      </Typography>

      {/* ページネーションボタン */}
      {total_pages > 1 && (
        <Box className="flex items-center gap-2">
          {/* 前のページボタン */}
          <Button
            variant="outlined"
            size="small"
            disabled={!prev_page}
            onClick={() => prev_page && onPageChange(prev_page)}
          >
            前へ
          </Button>

          {/* 最初のページ */}
          {generatePageNumbers()[0] > 1 && (
            <>
              <Button
                variant={current_page === 1 ? "contained" : "outlined"}
                size="small"
                onClick={() => onPageChange(1)}
              >
                1
              </Button>
              {generatePageNumbers()[0] > 2 && (
                <Typography variant="body2" className="mx-1">...</Typography>
              )}
            </>
          )}

          {/* ページ番号ボタン */}
          {generatePageNumbers().map((page) => (
            <Button
              key={page}
              variant={current_page === page ? "contained" : "outlined"}
              size="small"
              onClick={() => onPageChange(page)}
              className="min-w-[40px]"
            >
              {page}
            </Button>
          ))}

          {/* 最後のページ */}
          {generatePageNumbers()[generatePageNumbers().length - 1] < total_pages && (
            <>
              {generatePageNumbers()[generatePageNumbers().length - 1] < total_pages - 1 && (
                <Typography variant="body2" className="mx-1">...</Typography>
              )}
              <Button
                variant={current_page === total_pages ? "contained" : "outlined"}
                size="small"
                onClick={() => onPageChange(total_pages)}
              >
                {total_pages}
              </Button>
            </>
          )}

          {/* 次のページボタン */}
          <Button
            variant="outlined"
            size="small"
            disabled={!next_page}
            onClick={() => next_page && onPageChange(next_page)}
          >
            次へ
          </Button>
        </Box>
      )}

      {/* 1ページあたりの表示件数選択 */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>表示件数</InputLabel>
        <Select
          value={per_page}
          label="表示件数"
          onChange={(e) => onPerPageChange(Number(e.target.value))}
        >
          <MenuItem value={5}>5件</MenuItem>
          <MenuItem value={10}>10件</MenuItem>
          <MenuItem value={20}>20件</MenuItem>
          <MenuItem value={50}>50件</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
