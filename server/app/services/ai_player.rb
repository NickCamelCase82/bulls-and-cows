class AiPlayer
  def initialize(difficulty)
    @difficulty = difficulty
    @possible_numbers = generate_all_possible_numbers
  end

  def make_guess
    case @difficulty
    when 'easy'
      random_guess
    when 'medium'
      smart_guess
    when 'hard'
      knuth_guess
    end
  end

  def process_result(guess, bulls, cows)
    # eliminate numbers that don't match the feedback
    @possible_numbers.select! do |number|
      calculate_bulls_and_cows(number, guess) == [bulls, cows]
    end
  end

  private

  def random_guess
    digits = (1..9).to_a.sample(4)
    digits.join
  end

  def smart_guess
    @possible_numbers.sample
  end

  def knuth_guess
    return @possible_numbers.sample if @possible_numbers.length <= 2

    # pick the guess that minimizes the worst case remaining candidates
    best_guess = nil
    best_score = Float::INFINITY

    @possible_numbers.each do |candidate|
      # calculate worst case for this candidate
      score = worst_case_remaining(candidate)
      if score < best_score
        best_score = score
        best_guess = candidate
      end
    end

    best_guess
  end

  def worst_case_remaining(candidate)
    groups = Hash.new(0)
    @possible_numbers.each do |number|
      result = calculate_bulls_and_cows(number, candidate)
      groups[result] += 1
    end
    groups.values.max
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

  def generate_all_possible_numbers
    (1..9).to_a.permutation(4).map(&:join)
  end
end