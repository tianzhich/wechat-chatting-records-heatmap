(function () {
  "use strict";

  // *****************************************
  // reusable heat-map chart
  // *****************************************

  d3.eesur.heatmap = function module() {
    // input vars for getter setters
    var startYear = 2013,
      endYear = 2016,
      colourRangeStart = "#fae9e9",
      colourRangeEnd = "#d62728",
      width = 950,
      height = 475;

    var dispatch = d3.dispatch("_hover");

    function exports(_selection) {
      _selection.each(function (nestedData) {
        var colour = d3.scale
          .linear()
          .range([colourRangeStart, colourRangeEnd]);

        var margin = { top: 20, right: 30, bottom: 20, left: 20 };
        // update width and height to use margins for axis
        width = width - margin.left - margin.right;
        height = height - margin.top - margin.bottom;

        var years = d3.range(startYear, endYear).reverse(),
          sizeByYear = height / years.length + 1,
          sizeByDay = d3.min([sizeByYear / 8, width / 54]),
          day = function (d) {
            return (d.getDay() + 6) % 7;
          },
          week = d3.time.format("%W"),
          date = d3.time.format("%b %d");

        var svg = d3
          .select(this)
          .append("svg")
          .attr({
            class: "chart",
            width: width + margin.left + margin.right,
            height: height + margin.top + margin.bottom,
          })
          .append("g")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          );

        var year = svg
          .selectAll(".year")
          .data(years)
          .enter()
          .append("g")
          .attr("class", "year")
          .attr("transform", function (d, i) {
            return "translate(30," + i * sizeByYear + ")";
          });

        year
          .append("text")
          .attr({
            class: "year-title",
            transform: "translate(-38," + sizeByDay * 3.5 + ")rotate(-90)",
            "text-anchor": "middle",
            "font-weight": "bold",
          })
          .text(function (d) {
            return d;
          });

        var rect = year
          .selectAll(".day")
          .data(function (d) {
            return d === moment().year()
              ? d3.time.days(
                  new Date(d, 0, 1),
                  new Date(d, moment().month(), moment().date() + 1)
                )
              : d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
          })
          .enter()
          .append("rect")
          .attr({
            class: "day",
            width: sizeByDay,
            height: sizeByDay,
            x: function (d) {
              return week(d) * sizeByDay;
            },
            y: function (d) {
              return day(d) * sizeByDay;
            },
          });

        year
          .selectAll(".month")
          .data(function (d) {
            return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1));
          })
          .enter()
          .append("path")
          .attr({
            class: "month",
            d: monthPath,
          });

        // day and week titles
        var chartTitles = (function () {
          var weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            month = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];

          var titlesDays = svg
            .selectAll(".year")
            .selectAll(".titles-day")
            .data(weekDays)
            .enter()
            .append("g")
            .attr("class", "titles-day")
            .attr("transform", function (d, i) {
              return "translate(-5," + sizeByDay * (i + 1) + ")";
            });

          titlesDays
            .append("text")
            .attr("class", function (d, i) {
              return weekDays[i];
            })
            .style("text-anchor", "end")
            .attr("dy", "-.25em")
            .text(function (d, i) {
              return weekDays[i];
            });

          var titlesMonth = svg
            .selectAll(".year")
            .selectAll(".titles-month")
            .data(month)
            .enter()
            .append("g")
            .attr("class", "titles-month")
            .attr("transform", function (d, i) {
              return "translate(" + ((i + 1) * (width / 12) - 30) + ",-5)";
            });

          titlesMonth
            .append("text")
            .attr("class", function (d, i) {
              return month[i];
            })
            .style("text-anchor", "end")
            .text(function (d, i) {
              return month[i];
            });
        })();

        function monthPath(t0) {
          var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = +day(t0),
            w0 = +week(t0),
            d1 = +day(t1),
            w1 = +week(t1);

          return (
            "M" +
            (w0 + 1) * sizeByDay +
            "," +
            d0 * sizeByDay +
            "H" +
            w0 * sizeByDay +
            "V" +
            7 * sizeByDay +
            "H" +
            w1 * sizeByDay +
            "V" +
            (d1 + 1) * sizeByDay +
            "H" +
            (w1 + 1) * sizeByDay +
            "V" +
            0 +
            "H" +
            (w0 + 1) * sizeByDay +
            "Z"
          );
        }

        // apply the heatmap colours
        colour.domain(d3.extent(d3.values(nestedData)));

        rect
          .filter(function (d) {
            return d in nestedData;
          })
          .style("fill", function (d) {
            return colour(nestedData[d]);
          })
          .on("mouseover", dispatch._hover);
      });
    }

    // overrides getter/setters
    exports.startYear = function (value) {
      if (!arguments.length) return startYear;
      startYear = value;
      return this;
    };
    exports.endYear = function (value) {
      if (!arguments.length) return endYear;
      endYear = value;
      return this;
    };
    exports.colourRangeStart = function (value) {
      if (!arguments.length) return colourRangeStart;
      colourRangeStart = value;
      return this;
    };
    exports.colourRangeEnd = function (value) {
      if (!arguments.length) return colourRangeEnd;
      colourRangeEnd = value;
      return this;
    };
    exports.width = function (value) {
      if (!arguments.length) return width;
      width = value;
      return this;
    };
    exports.height = function (value) {
      if (!arguments.length) return height;
      height = value;
      return this;
    };

    d3.rebind(exports, dispatch, "on");
    return exports;
  };
})();
