FactoryBot.define do
  factory :game do
    user { nil }
    mode { "MyString" }
    result { "MyString" }
    attempts_count { 1 }
    secret_number { "MyString" }
  end
end
