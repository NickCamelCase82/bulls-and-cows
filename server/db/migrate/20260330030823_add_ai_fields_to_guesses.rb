class AddAiFieldsToGuesses < ActiveRecord::Migration[7.0]
  def change
    add_column :guesses, :ai_guess, :string
    add_column :guesses, :ai_bulls, :integer
    add_column :guesses, :ai_cows, :integer
  end
end
