'use client'

import { useState } from 'react'
import { Box, ImageList, ImageListItem, Dialog, DialogContent, IconButton, Typography } from '@mui/material'
import { Close, ZoomIn } from '@mui/icons-material'
import { TaskImage } from '@/lib/types'

interface TaskImagesProps {
  images: TaskImage[]
  compact?: boolean
}

export default function TaskImages({ images, compact = false }: TaskImagesProps) {
  const [selectedImage, setSelectedImage] = useState<TaskImage | null>(null)

  if (!images || images.length === 0) {
    return null
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  if (compact) {
    // コンパクト表示（タスク一覧用）
    return (
      <Box className="mt-2">
        <Box className="flex flex-wrap gap-1">
          {images.slice(0, 3).map((image) => (
            <Box
              key={image.id}
              className="relative cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.url}
                alt={image.filename}
                className="w-16 h-16 object-cover rounded border"
              />
              <ZoomIn className="absolute top-1 right-1 text-white bg-black bg-opacity-50 rounded text-xs" />
            </Box>
          ))}
          {images.length > 3 && (
            <Box className="w-16 h-16 border rounded flex items-center justify-center bg-gray-100">
              <Typography variant="caption" className="text-gray-600">
                +{images.length - 3}
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* 画像拡大表示ダイアログ */}
        <Dialog
          open={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogContent className="p-0 relative">
            {selectedImage && (
              <>
                <IconButton
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                  size="small"
                >
                  <Close />
                </IconButton>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.filename}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <Box className="p-2 bg-gray-50">
                  <Typography variant="body2" className="font-medium">
                    {selectedImage.filename}
                  </Typography>
                  <Typography variant="caption" className="text-gray-600">
                    {formatFileSize(selectedImage.byte_size)}
                  </Typography>
                </Box>
              </>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    )
  }

  // フル表示（詳細画面用）
  return (
    <Box className="mt-4">
      <Typography variant="subtitle2" className="mb-2 font-medium">
        添付画像（{images.length}枚）
      </Typography>
      
      <ImageList variant="masonry" cols={3} gap={8}>
        {images.map((image) => (
          <ImageListItem 
            key={image.id}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.url}
              alt={image.filename}
              loading="lazy"
              className="rounded border"
            />
          </ImageListItem>
        ))}
      </ImageList>

      {/* 画像拡大表示ダイアログ */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent className="p-0 relative">
          {selectedImage && (
            <>
              <IconButton
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                size="small"
              >
                <Close />
              </IconButton>
              <img
                src={selectedImage.url}
                alt={selectedImage.filename}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <Box className="p-2 bg-gray-50">
                <Typography variant="body2" className="font-medium">
                  {selectedImage.filename}
                </Typography>
                <Typography variant="caption" className="text-gray-600">
                  {formatFileSize(selectedImage.byte_size)}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}