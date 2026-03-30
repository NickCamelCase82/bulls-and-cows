class AuthController < ApplicationController
  skip_before_action :authenticate_request, only: [:login, :register]

  def register
    user = User.new(user_params)
    if user.save
      token = JwtService.encode(user_id: user.id)
      render json: { token: token, user: { id: user.id, username: user.username, email: user.email } }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def login
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      token = JwtService.encode(user_id: user.id)
      render json: { token: token, user: { id: user.id, username: user.username, email: user.email } }
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  private

  def user_params
    params.permit(:username, :email, :password, :password_confirmation)
  end
end