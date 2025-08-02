class Task < ApplicationRecord
  validates :title, presence: true
  validates :priority, presence: true

  enum priority: {
    low: 0,
    medium: 1,
    high: 2
  }

  # 画像添付機能
  has_many_attached :images

  # 画像バリデーション
  validate :acceptable_images

  private

  def acceptable_images
    return unless images.attached?

    images.each do |image|
      unless image.blob.byte_size <= 5.megabytes
        errors.add(:images, 'は5MB以下である必要があります')
      end

      unless image.blob.content_type.in?(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
        errors.add(:images, 'はJPEG、PNG、GIF、WebP形式である必要があります')
      end
    end
  end

  def self.ransackable_attributes(auth_object = nil)
    %w[completed created_at description id priority title updated_at]
  end

  def self.ransackable_associations(auth_object = nil)
    []
  end

  def self.ransortable_attributes(auth_object = nil)
    %w[created_at priority title updated_at]
  end
end
