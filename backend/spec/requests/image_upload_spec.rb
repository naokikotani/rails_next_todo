require 'rails_helper'

RSpec.describe 'Image Upload', type: :request do
  let(:json_response) { JSON.parse(response.body) }

  describe 'POST /tasks with images' do
    let(:valid_task_params) do
      {
        task: {
          title: 'Task with Image',
          description: 'A task that includes an image',
          priority: 'high',
          completed: false
        }
      }
    end

    context 'with valid image' do
      let(:image_file) do
        fixture_file_upload(
          Rails.root.join('spec', 'fixtures', 'test_image.jpg'),
          'image/jpeg'
        )
      end

      before do
        # テスト用の画像ファイルを作成
        FileUtils.mkdir_p(Rails.root.join('spec', 'fixtures'))
        unless File.exist?(Rails.root.join('spec', 'fixtures', 'test_image.jpg'))
          # 1x1の最小JPEGファイルを作成
          File.write(
            Rails.root.join('spec', 'fixtures', 'test_image.jpg'),
            "\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xFF\xDB\x00C\x00\b\x06\x06\a\x06\x05\b\a\a\a\t\t\b\n\f\x14\r\f\v\v\f\x19\x12\x13\x0F\x14\x1D\x1A\x1F\x1E\x1D\x1A\x1C\x1C $.' \",#\x1C\x1C(7),01444\x1F'9=82<.342\xFF\xC0\x00\x11\b\x00\x01\x00\x01\x01\x01\x11\x00\x02\x11\x01\x03\x11\x01\xFF\xC4\x00\x1F\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\a\b\t\n\v\xFF\xC4\x00\xB5\x10\x00\x02\x01\x03\x03\x02\x04\x03\x05\x05\x04\x04\x00\x00\x01}\x01\x02\x03\x00\x04\x11\x05\x12!1A\x06\x13Qa\a\"q\x142\x81\x91\xA1\b#B\xB1\xC1\x15R\xD1\xF0$3br\x82\t\n\x16\x17\x18\x19\x1A%&'()*456789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz\x83\x84\x85\x86\x87\x88\x89\x8A\x92\x93\x94\x95\x96\x97\x98\x99\x9A\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9\xAA\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xBA\xC2\xC3\xC4\xC5\xC6\xC7\xC8\xC9\xCA\xD2\xD3\xD4\xD5\xD6\xD7\xD8\xD9\xDA\xE1\xE2\xE3\xE4\xE5\xE6\xE7\xE8\xE9\xEA\xF1\xF2\xF3\xF4\xF5\xF6\xF7\xF8\xF9\xFA\xFF\xDA\x00\b\x01\x01\x00\x00?\x00\xFF\xD9",
            mode: 'wb'
          )
        end
      end

      it 'creates a task with attached image' do
        params = valid_task_params.dup
        params[:task][:images] = [image_file]

        expect {
          post '/tasks', params: params
        }.to change(Task, :count).by(1)

        expect(response).to have_http_status(201)
        expect(json_response['title']).to eq('Task with Image')
        expect(json_response['images']).to be_present
        expect(json_response['images'].length).to eq(1)
        expect(json_response['images'][0]['filename']).to eq('test_image.jpg')
        expect(json_response['images'][0]['content_type']).to eq('image/jpeg')
      end

      it 'creates a task with multiple images' do
        image_file_2 = fixture_file_upload(
          Rails.root.join('spec', 'fixtures', 'test_image.jpg'),
          'image/jpeg'
        )
        
        params = valid_task_params.dup
        params[:task][:images] = [image_file, image_file_2]

        post '/tasks', params: params

        expect(response).to have_http_status(201)
        expect(json_response['images'].length).to eq(2)
      end
    end

    context 'with invalid image' do
      let(:large_file) do
        # 6MBのダミーファイルを作成
        file_content = 'x' * (6 * 1024 * 1024)
        file = Tempfile.new(['large', '.jpg'])
        file.write(file_content)
        file.rewind
        
        Rack::Test::UploadedFile.new(file.path, 'image/jpeg')
      end

      let(:invalid_file) do
        file = Tempfile.new(['invalid', '.txt'])
        file.write('This is not an image')
        file.rewind
        
        Rack::Test::UploadedFile.new(file.path, 'text/plain')
      end

      it 'rejects files larger than 5MB' do
        params = valid_task_params.dup
        params[:task][:images] = [large_file]

        post '/tasks', params: params

        expect(response).to have_http_status(422)
        expect(json_response['images']).to include('は5MB以下である必要があります')
      end

      it 'rejects non-image files' do
        params = valid_task_params.dup
        params[:task][:images] = [invalid_file]

        post '/tasks', params: params

        expect(response).to have_http_status(422)
        expect(json_response['images']).to include('はJPEG、PNG、GIF、WebP形式である必要があります')
      end
    end

    context 'without images' do
      it 'creates a task successfully' do
        post '/tasks', params: valid_task_params

        expect(response).to have_http_status(201)
        expect(json_response['images']).to eq([])
      end
    end
  end

  describe 'GET /tasks with images' do
    let!(:task_with_image) do
      task = create(:task, title: 'Task with image')
      
      # テスト用画像を添付
      image_path = Rails.root.join('spec', 'fixtures', 'test_image.jpg')
      task.images.attach(io: File.open(image_path), filename: 'test_image.jpg', content_type: 'image/jpeg')
      task
    end

    let!(:task_without_image) do
      create(:task, title: 'Task without image')
    end

    it 'returns tasks with image URLs' do
      get '/tasks'

      expect(response).to have_http_status(200)
      tasks = json_response['tasks']

      task_with_image_data = tasks.find { |t| t['id'] == task_with_image.id }
      task_without_image_data = tasks.find { |t| t['id'] == task_without_image.id }

      expect(task_with_image_data['images']).to be_present
      expect(task_with_image_data['images'].length).to eq(1)
      expect(task_with_image_data['images'][0]['url']).to be_present
      expect(task_with_image_data['images'][0]['filename']).to eq('test_image.jpg')

      expect(task_without_image_data['images']).to eq([])
    end
  end
end
