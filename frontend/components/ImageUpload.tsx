'use client'

import { useState, useRef } from 'react'
import { Box, Button, Typography, IconButton, Chip, Alert } from '@mui/material'
import { CloudUpload, Delete, Image as ImageIcon } from '@mui/icons-material'

interface ImageUploadProps {
  images: File[]
  onImagesChange: (images: File[]) => void
  maxImages?: number
  maxSizePerImage?: number // bytes
}

export default function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 5,
  maxSizePerImage = 5 * 1024 * 1024 // 5MB
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setError(null)

    // ファイル数チェック
    if (images.length + files.length > maxImages) {
      setError(`画像は最大${maxImages}枚まで選択できます`)
      return
    }

    // ファイルサイズとタイプチェック
    const validFiles: File[] = []
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError('JPEG、PNG、GIF、WebP形式の画像のみ選択できます')
        return
      }

      if (file.size > maxSizePerImage) {
        setError(`画像ファイルは${Math.round(maxSizePerImage / 1024 / 1024)}MB以下である必要があります`)
        return
      }

      validFiles.push(file)
    }

    onImagesChange([...images, ...validFiles])
    
    // ファイル入力をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <Box className="space-y-4">
      <Box className="flex items-center gap-2">
        <Typography variant="subtitle2" className="font-medium">
          画像を添付（最大{maxImages}枚）
        </Typography>
        <Typography variant="caption" className="text-gray-500">
          JPEG、PNG、GIF、WebP形式、{Math.round(maxSizePerImage / 1024 / 1024)}MB以下
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <Button
        variant="outlined"
        startIcon={<CloudUpload />}
        onClick={() => fileInputRef.current?.click()}
        disabled={images.length >= maxImages}
        className="w-full"
      >
        画像を選択
      </Button>

      {images.length > 0 && (
        <Box className="space-y-2">
          <Typography variant="subtitle2">選択済み画像（{images.length}枚）</Typography>
          {images.map((file, index) => (
            <Box
              key={index}
              className="flex items-center justify-between p-2 border border-gray-300 rounded"
            >
              <Box className="flex items-center gap-2">
                <ImageIcon className="text-gray-500" fontSize="small" />
                <Box>
                  <Typography variant="body2" className="font-medium">
                    {file.name}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500">
                    {formatFileSize(file.size)}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                size="small"
                onClick={() => handleRemoveImage(index)}
                color="error"
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}