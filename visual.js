// Imitating the project "Historical-ranking-data-visualization-based-on-d3.js"
// Thanks for the original author and the project!
//
// @original author:        Jannchie
// @original project url:   https://github.com/Jannchie/Historical-ranking-data-visualization-based-on-d3.js
// @imitators:              19-group
// @last modified:          2018-7-27 14:31


function compare(property){
    return function(obj1,obj2){
        var value1 = obj1[property];
        var value2 = obj2[property];
        return value2 - value1;
    }
}

function fprovince() {
    for(var c = 0; c < 9999; c++) {
        clearInterval(c);
    }
    d3.select('#mainsvg').selectAll('*').remove();
    var options=$("#province").find("option:selected");
    var seltext = options.text();
    var data=[];
    for (var i=0; i<yearList.length; i++){
        let yeardata = [];
        for (var j=0; j<typeList.length; j++){
            var tem = {};
            tem['name'] = typeList[j];
            tem['value'] = valueData[seltext][typeList[j]][yearList[i]];
            tem['date'] = yearList[i];
            yeardata.push(tem);
        }
        data.push(yeardata);
    }
    let sortdata = [];
    for (var k = 0; k < data.length; k++){
        var sortObj = data[k].sort(compare("value"));
        sortdata.push(sortObj);
    }
    draw(sortdata);
}

function ftype() {
    for(var c = 0; c < 9999; c++) {
        clearInterval(c);
    }
    d3.select('#mainsvg').selectAll('*').remove();
    var options=$("#type").find("option:selected");
    var seltext = options.text();
    var data = [];
    for (var i=0; i<yearList.length; i++){
        let yeardata = [];
        for (var j=0; j<provienceList.length; j++){
            tem = {};
            tem['name'] = provienceList[j];
            tem['value'] = valueData[provienceList[j]][seltext][yearList[i]];
            tem['date'] = yearList[i];
            yeardata.push(tem);
        }
        data.push(yeardata);
    }
    let sortdata = [];
    for (var k = 0; k < data.length; k++){
        var sortObj = data[k].sort(compare("value"));
        sortdata.push(sortObj);
    }
    draw(sortdata);
}


// General Config
const svg=d3.select('body').append('svg')
    .attr('width', config.SVGWidth)
    .attr('height', config.SVGHeight);
const innerWidth = config.SVGWidth - config.Padding.left - config.Padding.right;
const innerHeight = config.SVGHeight - config.Padding.top - config.Padding.bottom - 50;
const intervalTime=config.IntervalTime;

var timeCounter={"value": 0};

// Drawing Config
const xValue = d => Number(d.value);
const yValue = d => d.name;

const g = svg.append('g')
    .attr('transform', `translate(${config.Padding.left},${config.Padding.top})`);
const xAxisG = g.append('g')
    .attr('transform', `translate(0, ${innerHeight})`);
const yAxisG = g.append('g');

xAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('x', innerWidth / 2)
    .attr('y', 100);
    
const xScale = d3.scaleLinear()
const yScale = d3.scaleBand()
    .paddingInner(0.3)
    .paddingOuter(0);

const xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(config.XTicks)
    .tickPadding(20)
    .tickFormat(d => d)
    .tickSize(-innerHeight);

const yAxis = d3.axisLeft()
    .scale(yScale)
    .tickPadding(5)
    .tickSize(-innerWidth);

const timer = g.append("text")
    .attr('class', 'timer')
    .attr('font-size', config.TimerFontSize)
    .attr('fill-opacity', 0)
    .attr('x', innerWidth-100)
    .attr('y', innerHeight);


function getColorClass(d) {
    var tmp=0;
    for (let index = 0; index < d.name.length; index++)
        tmp = tmp + d.name.charCodeAt(index);
    return config.ColorClass[tmp%config.ColorClass.length];
}

function draw(seq) {
    function refresh(data) {
        yScale
            .domain(data.map(yValue).reverse())
            .range([innerHeight, 0]).padding(0.1);
        xScale
            .domain([0, d3.max(data, xValue)]).range([0, innerWidth]);
        xAxisG
            .transition(g).duration(3000 * intervalTime).ease(d3.easeLinear).call(xAxis);
        yAxisG
            .transition(g).duration(3000 * intervalTime).ease(d3.easeLinear).call(yAxis);
        yAxisG
            .selectAll('.tick').remove();

        timer.data(data)
            .transition().duration(intervalTime*2000).delay(intervalTime*1000*isFirst).ease(d3.easeLinear)
            .attr('fill-opacity', 1)
            .tween("text", function(d){
                var self = this;
                var i = d3.interpolate(self.textContent, timeCounter.value);
                return function (t) {
                    self.textContent = Math.round(i(t));
                };
            });
        timeCounter.value = data[0].date;

        // start
        var bar = g.selectAll(".bar")
            .data(data, function (d) {
                return d.name;
            });

        // Enter Items
        var barEnter = bar.enter().insert("g", ".axis")
            .attr("class", "bar")
            .attr("transform", function (d) {
                return "translate(0," + yScale(yValue(d)) + ")";
            });
        barEnter.append("g")
            .attr("class", function (d) {
                return getColorClass(d);
            });

        barEnter.append("rect")
            .attr("width", d => xScale(xValue(d)))
            .attr("fill-opacity", 0)
            .attr("height", yScale.bandwidth())
            .attr("y", 50)
            .transition("a")
            .attr("class", d => getColorClass(d))
            .delay(500 * intervalTime)
            .duration(2490 * intervalTime)
            .attr("y", 0)
            .attr("width", d => xScale(xValue(d)))
            .attr("fill-opacity", 1);

        barEnter.append("text")
            .attr("y", 0)
            .attr("fill-opacity", 0)
            .transition("2")
            .delay(500 * intervalTime)
            .duration(2490 * intervalTime)
            .attr("fill-opacity", 1)
            .attr("y", 0)
            .attr("class", function (d) {
                return "label " + getColorClass(d)
            })
            .attr("x", -5)
            .attr("y", 10)
            .attr("text-anchor", "end")
            .text(d => d.name);

        barEnter.append("text")
            .attr("x", d => xScale(xValue(d)))
            .attr("y", 10)
            .attr("fill-opacity", 0)
            .text(d => d.value)
            .transition()
            .delay(500 * intervalTime)
            .duration(2490 * intervalTime)
            .attr("fill-opacity", 1).attr("y", 0)
            .attr("class", function (d) {
                return "value " + getColorClass(d)
            })
            .tween("text", function (d) {
                var self=this;                      // why?
                var i = d3.interpolate(self.textContent, Number(d.value));
                return function (t) {
                    self.textContent = Math.round(i(t));
                };
            })
            .attr("x", d => xScale(xValue(d)) + 10)
            .attr("y", 10);

        // Update Items
        var barUpdate = bar.transition().duration(2990 * intervalTime).ease(d3.easeLinear);

        barUpdate.select("rect")
            .attr("width", d => xScale(xValue(d)))
        barUpdate.select(".barInfo")
            .attr("x", d => xScale(xValue(d)) - 10)
            .attr("fill-opacity", 1)
            .attr("stroke-width",  "1px")

        barUpdate.select(".value")
            .tween("text", function (d) {
                var self=this;
                var i = d3.interpolate(self.textContent, Number(d.value));
                return function (t) {
                    self.textContent = Math.round(i(t));
                };
            })
            .duration(2990 * intervalTime)
            .attr("x", d => xScale(xValue(d)) + 10);

        // Exit Items
        var barExit = bar.exit()
            .attr("fill-opacity", 1)
            .transition().duration(2500 * intervalTime)

        barExit
            .attr("transform", "translate(0," + 780 + ")")
            .remove()
            .attr("fill-opacity", 0);

        barExit.select("rect")
            .attr("fill-opacity", 0);
        barExit.select(".value")
            .attr("fill-opacity", 0);
        barExit.select(".barInfo")
            .attr("fill-opacity", 0)
            .attr("stroke-width", "0px");

        bar.data(data, d => d.name)
            .transition()
            .delay(0 * intervalTime)
            .duration(2490 * intervalTime)
            .attr("transform", function (d) {
                return "translate(0," + yScale(yValue(d)) + ")";
            });
    };

    var iter=0, isFirst=1;

    var inter=setInterval(function next() {
        refresh(seq[iter++]);
        if (iter>=yearList.length)
            window.clearInterval(inter);
    }, 3000 * intervalTime);

};


