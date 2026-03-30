class UsersController < ApplicationController
  def profile
    user = User.find(@current_user_id)
    games = user.games

    render json: {
      username: user.username,
      email: user.email,
      total_games: games.count,
      wins: games.where(result: 'win').count,
      losses: games.where(result: 'loss').count,
      best_score: games.where(result: 'win').minimum(:attempts_count)
    }
  end
end