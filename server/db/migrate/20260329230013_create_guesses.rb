class CreateGuesses < ActiveRecord::Migration[7.0]
  def change
    create_table :guesses do |t|
      t.references :game, null: false, foreign_key: true
      t.string :number
      t.integer :bulls
      t.integer :cows

      t.timestamps
    end
  end
end
