class AddAiFieldsToGames < ActiveRecord::Migration[7.0]
  def change
    add_column :games, :difficulty, :string
    add_column :games, :player_secret_number, :string
    add_column :games, :ai_attempts_count, :integer
  end
end
