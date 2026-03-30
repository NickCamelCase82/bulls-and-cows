Rails.application.routes.draw do
  post '/auth/register', to: 'auth#register'
  post '/auth/login', to: 'auth#login'

  resources :games, only: [:create] do
    member do
      post :guess
    end
  end

  get '/leaderboard', to: 'leaderboard#index'
  get '/profile', to: 'users#profile'
end
