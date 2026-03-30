class LeaderboardController < ApplicationController
  def index
    leaderboard = Game.where(result: 'win')
                      .select('user_id, COUNT(*) as wins, MIN(attempts_count) as best_score')
                      .group(:user_id)
                      .order('wins DESC')
                      .limit(10)
                      .map do |entry|
      user = User.find(entry.user_id)
      {
        username: user.username,
        wins: entry.wins,
        best_score: entry.best_score
      }
    end

    render json: leaderboard
  end
end