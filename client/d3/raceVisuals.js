var GameScreen = function(){
  this.width = 800;
  this.height = 500;

  this.player = new Racer();
  this.opponent = new Racer();
}

var Racer = function(){
  this.width = 800;
  this.height = 500;
}


Racer.prototype.render = function(){
  var div = d3.select('body')
            .append('div')
            .attr('id', 'competition')
            .append('svg:svg')
            .attr('width', this.width)
            .attr('height', this.height)

  var svg = d3.select('svg')

  svg.selectAll('rect')
    .data([[200, '#000', 0], [400, '#3994B3', 200]])
    .enter()
    .append('rect')
    .attr('width', function(d){
      return d[0];
    })
    .attr('height', 20)
    .attr('fill', function(d){
      return d[1];
    })
    .attr('x', function(d){
      return d[2];
    })

}

var racer = new Racer();
racer.render();