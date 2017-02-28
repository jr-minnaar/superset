/* eslint-disable no-shadow, no-param-reassign, no-underscore-dangle, no-use-before-define*/
import d3 from 'd3';
import { tpColors } from '../javascripts/modules/colors';

require('./mekko.css');

function mekko(slice, payload) {

  // console.log(payload.data.form_data);
  // console.log(payload.data.data);

  const div = d3.select(slice.selector);
  const _draw = function (data, eltWidth, eltHeight, formData) {

    const margin = {top: 25, right: 325, bottom: 105, left: 50};
    const width = eltWidth - margin.left - margin.right;
    const height = (eltHeight - margin.top - margin.bottom);

    const x = d3.scale.linear()
        .range([0, width]);

    const y = d3.scale.linear()
        .range([0, height]);

    let z = d3.scale.ordinal().range(tpColors);

    // const formatNumber = d3.format(formData.number_format);

    let n = d3.format(',.0f'),
      p = d3.format(".0%");

    let svg = div
      .append("svg")
      .attr("width", eltWidth)
      .attr("height", eltHeight)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // console.log(formData);
    // console.log(formData['x_axis']);

    // Nest values by segment. We assume each segment+market is unique.
    let segments = d3.nest()
      .key(function (d) {
        return d[formData['x_axis']];
      })
      .entries(data);

    // console.log(segments);

    // Compute the total sum, the per-segment sum, and the per-market offset.
    // You can use reduce rather than reduceRight to reverse the ordering.
    // We also record a reference to the parent segment for each market.
    let sum = segments.reduce(function(v, p) {
      return (p.offset = v) + (p.sum = p.values.reduceRight(function(v, d) {
        d.parent = p;
        return (d.offset = v) + d[formData.metric];
      }, 0));
    }, 0);

    // console.log(sum);

    // Add y-axis ticks.
    let ytick = svg.selectAll(".y")
      .data(y.ticks(10))
      .enter().append("g")
      .attr("class", "y")
      .attr("transform", function (d) {
        return "translate(0," + y(1 - d) + ")";
      });

    ytick.append("line")
      .attr("x1", -6)
      .style("stroke", "#000");

    ytick.append("text")
      .attr("x", -8)
      .attr("text-anchor", "end")
      .attr("dy", ".35em")
      .style('font-size', '12px')
      .text(p);

    // Add a group for each segment.
    let segments_selection = svg.selectAll(".segment")
      .data(segments)
      .enter().append("g")
      .attr("class", "segment")
      .attr("xlink:title", function (d) {
        return d.key;
      })
      .attr("transform", function (d) {
        return "translate(" + x(d.offset / sum) + ")";
      });

    // Add a rect for each market.
    let markets = segments_selection.selectAll(".market")
      .data(function (d) {
        return d.values;
      })
      .enter().append("a")
      .attr("class", "market")
      .attr("id", function (d) {
        return d[formData.y_axis].replace(" ", "").replace(",", "");
      })
      .attr("xlink:title", function (d) {
        return d[formData.y_axis] + " " + d.parent.key + ": " + n(d[formData.metric]);
      })
      .append("rect")
      .attr("y", function (d) {
        if (d.parent.sum > 0) {
             return y(d.offset / d.parent.sum);
          } else {
              return 0
          }
      })
      .attr("height", function (d) {
          if (d.parent.sum > 0) {
             return y(d[formData.metric] / d.parent.sum);
          } else {
              return 0
          }
      })
      .attr("width", function (d) {
        return x(d.parent.sum / sum);
      })
      .style("fill", function (d) {
        return z(d[formData['y_axis']]);
      });

    // console.log(segments);

    let legend = svg
      .append("g")
      .attr("class", "legend")
      .selectAll(".legend_market")
      .data(segments[0].values)
      .enter().append("g")
      .attr("id", function (d) {
        return d[formData['y_axis']].replace(" ", "").replace(",", "")
      })
      .attr("transform", function (d, i) {
        return "translate(" + (margin.left + width + 5) + ", " + i * 20 + ")"
      });


    legend.each(function (d) {
      let id = this.id;

      d3.select(this)
        .append("a")
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", function (d) {
          return z(d[formData['y_axis']]);
        });

      d3.select(this)
        .append("text")
        .style("font-size", "14px")
        .text(function (d) {
          return d[formData['y_axis']];
        })
        .attr("transform", function (d) {
          return "translate(" + 25 + "," + 15 + ")";
        });

      d3.select(this)
        .on("mouseover", function (d) {
          d3.selectAll(".market")
            .filter(function (d) {
              return id != this.id;
            })
            .style("opacity", 0.2);
        })
        .on("mouseout", function (d) {
          d3.selectAll(".market")
            .style("opacity", 1)
            .selectAll("rect")
            .style("stroke", "#000");
        });
    });

    // Bar descriptions
    d3.selectAll(".segment").each(function () {
      let box_width = this.getBBox().width;
      d3.select(this)
        .append("text")
        .attr("text-anchor", "end")
        .attr("transform", function (d) {
          return "translate(" + (box_width / 2) + ", " + (height + 10) + ") rotate(-45)";
        })
        .append("tspan")
        .text(d3.select(this)
          .attr("title"))
        .attr("font-size", "12px")
    });
  };

  // Prevents duplicating svg graphs
  div.selectAll('*').remove();
  const width = slice.width();
  const height = slice.height();

  _draw(payload.data.data, width, height, payload.data.form_data);

}

module.exports = mekko;

