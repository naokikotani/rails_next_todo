require 'rails_helper'

RSpec.describe Task, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:priority) }
  end

  describe 'enums' do
    it { should define_enum_for(:priority).with_values(low: 0, medium: 1, high: 2) }
  end

  describe 'factory' do
    it 'creates a valid task' do
      task = build(:task)
      expect(task).to be_valid
    end

    it 'creates a completed task with trait' do
      task = build(:task, :completed)
      expect(task.completed).to be true
    end

    it 'creates a high priority task with trait' do
      task = build(:task, :high_priority)
      expect(task.priority).to eq 'high'
    end
  end

  describe 'ransackable attributes' do
    it 'returns the correct ransackable attributes' do
      expected_attributes = %w[completed created_at description id priority title updated_at]
      actual_attributes = Task.ransackable_attributes
      expect(actual_attributes).to match_array(expected_attributes)
    end

    it 'returns empty array for ransackable associations' do
      expect(Task.ransackable_associations).to eq([])
    end
  end

  describe 'priority enum behavior' do
    let(:task) { create(:task) }

    it 'can set priority as string' do
      task.priority = 'high'
      expect(task.priority).to eq 'high'
      expect(task.high?).to be true
    end

    it 'can set priority as integer' do
      task.priority = 2
      expect(task.priority).to eq 'high'
      expect(task.high?).to be true
    end

    it 'provides priority query methods' do
      task.priority = 'medium'
      expect(task.medium?).to be true
      expect(task.high?).to be false
      expect(task.low?).to be false
    end
  end

  describe 'database persistence' do
    it 'persists task with all attributes' do
      task = create(:task,
        title: 'Test Task',
        description: 'Test Description',
        completed: true,
        priority: 'high'
      )

      saved_task = Task.find(task.id)
      expect(saved_task.title).to eq 'Test Task'
      expect(saved_task.description).to eq 'Test Description'
      expect(saved_task.completed).to be true
      expect(saved_task.priority).to eq 'high'
    end
  end
end
