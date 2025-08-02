class Task < ApplicationRecord
  validates :title, presence: true
  validates :priority, presence: true

  enum priority: {
    low: 0,
    medium: 1,
    high: 2
  }
end