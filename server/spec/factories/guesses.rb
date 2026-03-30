FactoryBot.define do
  factory :guess do
    game { nil }
    number { "MyString" }
    bulls { 1 }
    cows { 1 }
  end
end
