function topwidget(apikey, divid, limit)
 {
    this.apikey = apikey;
    this.divid = divid;
    this.limit = limit;

    var thisobj = this;

    var jsonp = 'topwidget.cback' + Math.round(Math.random() * 10000000);
    eval(jsonp + "= function(data) { thisobj.draw(data); }");

    //    this.host = location.host;
    this.host = "chicagobreakingnews.com";

    var dataurl = 'http://api.chartbeat.com/toppages/?host=chicagobreakingnews.com' + '&jsonp=' + jsonp + '&apikey=' + apikey + "&limit=" + this.limit;

    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = dataurl;
    headID.appendChild(newScript);

}

topwidget.prototype.draw_graph = function() {
    $('li.graph').each(function(i, val) {
        // Find id for each li and extract total number of people viewing
        var id_str = $('li.graph').eq(i).attr("id");
        var pattern = /([0-9]+)/;
        var viewers = id_str.match(pattern);

        // Take the total people viewing the first story and base our graph's "100%" on that number
        var id_first = $('li.graph').eq(0).attr("id");
        var scale = id_first.match(pattern)[0];
        var div_width = (Math.round(parseFloat(viewers)) / Math.round(parseFloat(scale))) * 100;

        // Set width for div
        $('div.bar').eq(i).attr("style", "width:" + div_width + "%;");

        $('.viewers').fadeIn('1000');
    });

}

topwidget.sort = function(a, b)
 {
    if (a["count"] > b["count"])
    return - 1;
    if (a["count"] < b["count"])
    return 1;

    return 0;
}

topwidget.prototype.draw = function(data)
 {

    var html = '<div><div id="chartBeatList"><ul>';

    if (!data.length)
    html += '<span>currently no pages listed</span>';

    for (var x = 0; x < data.length && x < this.limit; ++x)
    {
        var title = data[x]["i"];
        title = title.replace(/\- Chicago Breaking News/,'');
        if (!title)
        title = data[x]["path"];

        var people = (data[x]["visitors"] == 1) ? '1 person': data[x]["visitors"];

        if (title !== "Page not found - ChicagoNow" && title !== "Nothing found for Cbb-flash") {
            html += '<li id="' + people + '-viewers" class="pkg graph">';
            html += '<div id="graph-'+x+'" class="pkg bar"></div><a class="viewers viewers-'+x+'" href="http://www.' + this.clean_domain(this.host) + data[x]["path"] + '"><span>' + people + '</span> <span>viewing</span></a> <div class="link"><a class="link" href="http://www.' + this.clean_domain(this.host) + data[x]["path"] + '">' + this.truncate(title, 100) + '</a></div>';
            html += '</li>';
        }
    }

    html += '</ul></div></div><div id="chartBeatLink"><a href="http://chartbeat.com" target="_blank">powered by chartbeat</a></div>';

    if (this.divid)
    document.getElementById(this.divid).innerHTML = html;
    else
    document.write(html);

    this.draw_graph();
}

topwidget.prototype.truncate = function(str, len)
 {
    if (str.length <= len)
    return str;

    return str.substr(str, len - 3) + "...";
}

topwidget.prototype.clean_domain = function(domain)
 {
    domain = domain.replace(/^https?:\/\//i, '');
    domain = domain.replace(/\s*/g, '');
    domain = domain.replace(/^(www.)/i, '');
    domain = domain.replace(/\/.*/g, '');
    domain = domain.replace(/[^0-9A-Za-z.-]*/g, '');

    return domain;
}
