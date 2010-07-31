require 'yaml'

module Paperboy
  class Distributor  
    class << self
      def get_opts(f)
         opts = File.open(f) { |yf| YAML::load(yf) }
      end
    end   
  end
end