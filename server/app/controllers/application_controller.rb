class ApplicationController < ActionController::API
  include ExceptionHandler

  before_action :authenticate_request

  private

  def authenticate_request
    token = request.headers['Authorization']&.split(' ')&.last
    raise ExceptionHandler::MissingToken, 'Missing token' unless token
    @current_user_id = JwtService.decode(token)[:user_id]
  end
end
