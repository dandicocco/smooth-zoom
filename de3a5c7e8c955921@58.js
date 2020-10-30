export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Smooth Zooming

This notebook demonstrates using [d3.interpolateZoom](/@d3/d3-interpolatezoom) to implement smooth pan-and-zoom transitions between two views. See also [d3.zoom’s transitions](/@d3/programmatic-zoom), which also allows freeform zooming.`
)});
  main.variable(observer("chart")).define("chart", ["width","height","d3","data","radius"], function(width,height,d3,data,radius)
{
  let currentTransform = [width / 2, height / 2, height];

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])

  const g = svg.append("g");

  g.selectAll("circle")
    .data(data)
    .join("circle")
      .attr("cx", ([x]) => x)
      .attr("cy", ([, y]) => y)
      .attr("r", radius)
      .attr("fill", (d, i) => d3.interpolateRainbow(i / 360))

  function transition() {
    const d = data[Math.floor(Math.random() * data.length)];
    const i = d3.interpolateZoom(currentTransform, [...d, radius * 2 + 1]);

    g.transition()
        .delay(250)
        .duration(i.duration)
        .attrTween("transform", () => t => transform(currentTransform = i(t)))
        .on("end", transition);
  }

  function transform([x, y, r]) {
    return `
      translate(${width / 2}, ${height / 2})
      scale(${height / r})
      translate(${-x}, ${-y})
    `;
  }

  return svg.call(transition).node();
}
);
  main.variable(observer("height")).define("height", function(){return(
500
)});
  main.variable(observer("radius")).define("radius", function(){return(
6
)});
  main.variable(observer("step")).define("step", ["radius"], function(radius){return(
radius * 2
)});
  main.variable(observer("data")).define("data", ["step","theta","width","height"], function(step,theta,width,height){return(
Array.from({length: 2000}, (_, i) => {
  const r = step * Math.sqrt(i += 0.5), a = theta * i;
  return [
    width / 2 + r * Math.cos(a),
    height / 2 + r * Math.sin(a)
  ];
})
)});
  main.variable(observer("theta")).define("theta", function(){return(
Math.PI * (3 - Math.sqrt(5))
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  return main;
}
