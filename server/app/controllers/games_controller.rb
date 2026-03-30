class GamesController < ApplicationController
  def create
    game = Game.new(
      user_id: @current_user_id,
      mode: params[:mode],
      difficulty: params[:difficulty] || 'easy',
      secret_number: Game.generate_secret_number,
      player_secret_number: params[:player_secret_number],
      result: 'in_progress',
      ai_attempts_count: 0
    )
    if game.save
      render json: {
        id: game.id,
        mode: game.mode,
        difficulty: game.difficulty,
        attempts: 0
      }, status: :created
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

    game.guesses.create!(number: number, bulls: bulls, cows: cows)
    game.update(attempts_count: game.guesses.count)

    response = { bulls: bulls, cows: cows }

    if bulls == 4
      game.update(result: 'win')
      response.merge!(result: 'win', secret_number: game.secret_number)
    elsif game.guesses.count >= 10
      game.update(result: 'loss')
      response.merge!(result: 'loss', secret_number: game.secret_number)
    else
      response.merge!(attempts_left: 10 - game.guesses.count)

      # AI makes a guess if vs_player mode
      if game.mode == 'vs_ai' && game.player_secret_number.present?
        ai_response = make_ai_guess(game)
        response.merge!(ai_guess: ai_response)
      end
    end

    render json: response
  end

  private

  def make_ai_guess(game)
    ai = AiPlayer.new(game.difficulty)

    # replay previous AI guesses to restore state
    game.guesses.where.not(ai_guess: nil).each do |g|
      ai.process_result(g.ai_guess, g.ai_bulls, g.ai_cows)
    end

    ai_guess = ai.make_guess
    ai_bulls, ai_cows = calculate_bulls_and_cows(game.player_secret_number, ai_guess)

    # store AI guess in the last player guess record
    game.guesses.last.update(
      ai_guess: ai_guess,
      ai_bulls: ai_bulls,
      ai_cows: ai_cows
    )

    game.update(ai_attempts_count: game.ai_attempts_count + 1)

    if ai_bulls == 4
      game.update(result: 'loss')
      { guess: ai_guess, bulls: ai_bulls, cows: ai_cows, result: 'loss' }
    else
      { guess: ai_guess, bulls: ai_bulls, cows: ai_cows }
    end
  end

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