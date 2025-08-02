class TasksController < ApplicationController
  before_action :set_task, only: [:update, :destroy]

  def index
    @q = Task.ransack(params[:q])
    @tasks = @q.result.order(created_at: :desc).page(params[:page]).per(params[:per_page])

    render json: {
      tasks: @tasks,
      pagination: {
        current_page: @tasks.current_page,
        total_pages: @tasks.total_pages,
        total_count: @tasks.total_count,
        per_page: @tasks.limit_value,
        next_page: @tasks.next_page,
        prev_page: @tasks.prev_page
      }
    }
  end

  def create
    @task = Task.new(task_params)

    if @task.save
      render json: @task, status: :created
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  def update
    if @task.update(task_params)
      render json: @task
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @task.destroy
    head :no_content
  end

  private

  def set_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:title, :description, :completed, :priority)
  end
end
