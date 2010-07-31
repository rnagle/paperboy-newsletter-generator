require 'rubygems'
require 'lib/paperboy/paperboy.rb'
require 'lib/paperboy_distributor/base.rb'
    
    # to use filters, uncomment 
    # these lines, add filters as needed,
    # and uncomment `e.filters` in `Paperboy::Collector.new` below
    # @e = StatsCombiner::Filterer.new
    # @e.add :title_regex => /\- Chicago Breaking News/, :modify_title => true # Remove site title from headlines
    # @e.add :path_regex => /(\/$|\/index.php$)/, :exclude => true # Exclude homepage
    
    # Get chartbeat credentials and other options
    # from YML file
    y = Paperboy::Distributor.get_opts('opts.yml')
    
    # Time interval to get news for -- past 4 hours, from the current time
    time_new = Time.now.to_i # Now
    time_old = Time.now.to_i - 14400 # 4 hours ago
    
    # create a Paperboy instance, and pass query params
    # for start and end times to it.
    p = Paperboy::Collector.new({
          :apikey => y['apikey'],
          :host => y['host'],
          :start_time => time_old,
          :end_time => time_new,
          :interval => 3600, #four hours
#          :filters => @e.filters,
          :img_xpath => y['img_xpath'],
          :blurb_xpath => y['blurb_xpath']
    })
    
    p.outfile = "public/index.html"
    
    # Run with specified template
    p.run({
          :via => 'erb',
          :template => 'newsletter.erb'
    })

