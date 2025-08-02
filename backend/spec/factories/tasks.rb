FactoryBot.define do
  factory :task do
    title { Faker::Lorem.sentence(word_count: 3) }
    description { Faker::Lorem.paragraph(sentence_count: 2) }
    completed { false }
    priority { Task.priorities.keys.sample }

    trait :completed do
      completed { true }
    end

    trait :high_priority do
      priority { :high }
    end

    trait :medium_priority do
      priority { :medium }
    end

    trait :low_priority do
      priority { :low }
    end
  end
end