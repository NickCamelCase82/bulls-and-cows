class Guess < ApplicationRecord
  belongs_to :game

  validates :number, presence: true, format: { with: /\A[1-9]{4}\z/, message: 'must be 4 unique digits between 1-9' }
  validates :bulls, :cows, presence: true, numericality: { greater_than_or_equal_to: 0 }
end