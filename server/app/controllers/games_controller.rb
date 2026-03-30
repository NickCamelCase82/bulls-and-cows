class GamesController < ApplicationController
  def create
    game = Game.new(
      user_id: @current_user_id,
      mode: params[:mode],
      secret_number: Game.generate_secret_number,
      result: 'in_progress'
    )
    if game.save
      render json: { id: game.id, mode: game.mode, attempts: 0 }, status: :created
    else
      render json: { errors: game.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def guess
    game = Game.find_by(id: params[:id], user_id: @current_user_id)
    return render json: { error: 'Game not found' }, status: :not_found unless game
    return render json: { error: 'Game already finished' }, status: :unprocessable_entity if game.result != 'in_progress'

    number = params[:number]
    bulls, cows = calculate_bulls_and_cows(game.secret_number, number)

    guess = game.guesses.create!(number: number, bulls: bulls, cows: cows)
    game.update(attempts_count: game.guesses.count)

    if bulls == 4
      game.update(result: 'win')
      render json: { bulls: bulls, cows: cows, result: 'win', secret_number: game.secret_number }
    elsif game.guesses.count >= 10
      game.update(result: 'loss')
      render json: { bulls: bulls, cows: cows, result: 'loss', secret_number: game.secret_number }
    else
      render json: { bulls: bulls, cows: cows, attempts_left: 10 - game.guesses.count }
    end
  end

  private

  def calculate_bulls_and_cows(secret, guess)
    bulls = 0
    cows = 0
    secret_digits = secret.chars
    guess_digits = guess.chars

    secret_digits.each_with_index do |digit, i|
      if digit == guess_digits[i]
        bulls += 1
      elsif secret_digits.include?(guess_digits[i])
        cows += 1
      end
    end

    [bulls, cows]
  end
end