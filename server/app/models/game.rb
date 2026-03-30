class Game < ApplicationRecord
  belongs_to :user
  has_many :guesses, dependent: :destroy

  validates :mode, presence: true, inclusion: { in: %w[vs_ai vs_player] }
  validates :secret_number, presence: true
  validates :result, inclusion: { in: %w[win loss in_progress] }, allow_nil: true
  validates :difficulty, inclusion: { in: %w[easy medium hard] }, allow_nil: true

  def self.generate_secret_number
    digits = (1..9).to_a.sample(4)
    digits.join
  end
end
