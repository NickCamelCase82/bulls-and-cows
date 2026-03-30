class CreateGames < ActiveRecord::Migration[7.0]
  def change
    create_table :games do |t|
      t.references :user, null: false, foreign_key: true
      t.string :mode
      t.string :result
      t.integer :attempts_count
      t.string :secret_number

      t.timestamps
    end
  end
end
