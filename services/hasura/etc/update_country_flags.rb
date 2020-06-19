# frozen_string_literal: true

require 'open-uri'
require 'json'

url = 'https://raw.githubusercontent.com/mledoze/countries/master/countries.json'
countries = JSON.parse(open(url).read)

sql = ''
countries.each do |country|
  name = country['demonyms']['eng']['m']
  flag = country['flag']
  sql += "update tag set icon = '#{flag}' where name = '#{name}' and type = 'country';"
end

puts sql
