class Task < ApplicationRecord
  validates :title, presence: true
  validates :priority, presence: true

  enum priority: {
    low: 0,
    medium: 1,
    high: 2
  }

  def self.ransackable_attributes(auth_object = nil)
    ["completed", "created_at", "description", "id", "priority", "title", "updated_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    []
  end
end
