<template>
  <div class="root container-fluid">
    <div class="row main">
      <div class="card">
        <div class="card-header">
          Pattern Decision Tree
        </div>
        <div class="card-block">
          <div id="decision-tree">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'mc1-decision-tree',
  data() {
    return {
      treeData: {
        "name": "All routes",
        "children": [
          {
            "name": "Passing ranger-base -> Ranger",
          },
          {
            "name": "Not pass ranger-base",
            "children":[
              {
                "name": "Found some pass 'gate's but not 2P -> Special"
              },
              {
                "name": "Not Pass any of 'gate's",
                "children": [
                  {
                    "name": "Has only one record at 'entrance's",
                    "children": [
                      {
                        "name": "Enter the Preserve in the last month -> Incomplete"
                      },
                      {
                        "name": "Found an entry staying for almost one year -> Special"
                      }
                    ]
                  },
                  {
                    "name": "Has two records at 'entrance's",
                    "children": [
                      {
                        "name": "Not pass any of 'camping's",
                        "children": [
                          {
                            "name":"Enter and exit at the same 'entrance' -> Same Exntrance"
                          },
                          {
                            "name": "Found some special activity -> Special"
                          },
                          {
                            "name": "Other normal entries -> Passing By"
                          }
                        ]
                      },
                      {
                        "name": "Has 2 records at 'camping's -> Camping"
                      },
                      {
                        "name": "Has 4 records at 'camping's -> Twice Camping"
                      },
                      {
                        "name": "Has more then 4 records at 'camping's -> Special"
                      }
                    ]
                  },
                  {
                    "name": "Has more than two records at 'entrance's",
                    "children":[
                      {
                        "name": "Only 4 axles truck -> 4 Axles Truck Activity",
                      },
                      {
                        "name": "Others -> Bug"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  mounted() {
    var treeData = this.treeData

    // Set the dimensions and margins of the diagram
    var margin = {top: 20, right: 90, bottom: 30, left: 90},
        width = 1900 - margin.left - margin.right,
        height = 950 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#decision-tree").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate("
              + margin.left + "," + margin.top + ")");

    var i = 0,
        duration = 750,
        root;

    // declares a tree layout and assigns the size
    var treemap = d3.tree().size([height, width]);

    // Assigns parent, children, height, depth
    root = d3.hierarchy(treeData, function(d) { return d.children; });
    root.x0 = height / 2;
    root.y0 = 0;

    // Collapse after the second level
    root.children.forEach(collapse);

    update(root);

    // Collapse the node and all it's children
    function collapse(d) {
      if(d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
      }
    }

    function update(source) {

      // Assigns the x and y position for the nodes
      var treeData = treemap(root);

      // Compute the new tree layout.
      var nodes = treeData.descendants(),
          links = treeData.descendants().slice(1);

      // Normalize for fixed-depth.
      nodes.forEach(function(d){ d.y = d.depth * 300});

      // ****************** Nodes section ***************************

      // Update the nodes...
      var node = svg.selectAll('g.node')
          .data(nodes, function(d) {return d.id || (d.id = ++i); });

      // Enter any new modes at the parent's previous position.
      var nodeEnter = node.enter().append('g')
          .attr('class', 'node')
          .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on('click', click);

      // Add Circle for the nodes
      nodeEnter.append('circle')
          .attr('class', 'node')
          .attr('r', 1e-6)
          .style("fill", function(d) {
              return d._children ? "lightsteelblue" : "#fff";
          });

      // Add labels for the nodes
      nodeEnter.append('text')
          .attr("dy", (d, i) => {
            //return Math.random().toString() + "em"
            return (((Math.random()+1) * 0.75) * (Math.random() > 0.5? 1: -1)).toString() + "em"
            //return "1em"
          })
          .attr("x", function(d) {
              return d.children || d._children ? -13 : 13;
          })
          .attr("text-anchor", function(d) {
              //return d.children || d._children ? "end" : "start";
              return "middle"
          })
          .style("font-size", 20)
          .text(function(d) { return d.data.name; });

      // UPDATE
      var nodeUpdate = nodeEnter.merge(node);

      // Transition to the proper position for the node
      nodeUpdate.transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
         });

      // Update the node attributes and style
      nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        })
        .attr('cursor', 'pointer');


      // Remove any exiting nodes
      var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) {
              return "translate(" + source.y + "," + source.x + ")";
          })
          .remove();

      // On exit reduce the node circles size to 0
      nodeExit.select('circle')
        .attr('r', 1e-6);

      // On exit reduce the opacity of text labels
      nodeExit.select('text')
        .style('fill-opacity', 1e-6);

      // ****************** links section ***************************

      // Update the links...
      var link = svg.selectAll('path.link')
          .data(links, function(d) { return d.id; });

      // Enter any new links at the parent's previous position.
      var linkEnter = link.enter().insert('path', "g")
          .attr("class", "link")
          .attr('d', function(d){
            var o = {x: source.x0, y: source.y0}
            return diagonal(o, o)
          });

      // UPDATE
      var linkUpdate = linkEnter.merge(link);

      // Transition back to the parent element position
      linkUpdate.transition()
          .duration(duration)
          .attr('d', function(d){ return diagonal(d, d.parent) });

      // Remove any exiting links
      var linkExit = link.exit().transition()
          .duration(duration)
          .attr('d', function(d) {
            var o = {x: source.x, y: source.y}
            return diagonal(o, o)
          })
          .remove();

      // Store the old positions for transition.
      nodes.forEach(function(d){
        d.x0 = d.x;
        d.y0 = d.y;
      });

      // Creates a curved (diagonal) path from parent to the child nodes
      function diagonal(s, d) {

        var path = `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`

        return path
      }

      // Toggle children on click.
      function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          }
        update(d);
      }
    }
  }
}
</script>


<style>
.main, .card {
  height: 100%;
  width: 100%;
}

.node circle {
  fill: #fff;
  stroke: steelblue;
  stroke-width: 3px;
}

.node text {
  font: 12px sans-serif;
}

.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 2px;
}

</style>
