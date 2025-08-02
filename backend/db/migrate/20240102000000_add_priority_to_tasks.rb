class AddPriorityToTasks < ActiveRecord::Migration[7.1]
  def change
    add_column :tasks, :priority, :integer, default: 1, null: false
    add_index :tasks, :priority
  end
end