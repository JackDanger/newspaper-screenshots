#!/bin/env ruby
#
# Download a PDF of the print homepage for the NYT every day from Jan 1st, 2020 to Jan 31st, 2021

require 'open-uri'
require 'fileutils'
require 'active_support/all'

output_dir = "#{File.expand_path(__dir__)}/screenshots/nytimes_prints"
FileUtils.mkdir_p(output_dir)

start = Date.parse('2020-01-01')
finish = Date.parse('2021-01-31')

(start..finish).each do |date|

  file_datestamp = date.strftime("%Y-%m-%d")
  web_datestamp = date.strftime("%Y/%m/%d")

  filename = "#{output_dir}/#{file_datestamp}-nytimes_print.pdf"
  File.open(filename, 'wb') do |f|
    f.write URI.open("https://static01.nyt.com/images/#{web_datestamp}/nytfrontpage/scan.pdf").read
    puts "Wrote #{filename}"
  end
end
