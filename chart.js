var LineWithLineBar = {
  chart: null,
  lock: true,
  config: {
    type: 'LineWithLineBar',
    data: null,
    options: {
      responsive: false,
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      legend: { display: false },
      elements: {
        point: { radius: 0 },
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: false,
            labelString: '',
          },
          ticks: {
            minRotation: 0,
            maxRotation: 0,
          },
        }],
        yAxes: [{
          display: true,
          scaleLabel: { display: false },
          ticks: { min: 0 },
        }],
      },
      onClick: function() {
        LineWithLineBar.lock = !LineWithLineBar.lock;
      },
    },
  }
};

var LineBar = {
  xPos: 0,
  topY: 0,
  bottomY: 0,
  width: 1.5,
  color: 'rgb(54, 162, 235)',
  rect: { left: 0, top: 0, right: 0, bottom: 0 },
};

function draw(ctx, labels, data, color, lineColor) {
  Chart.controllers.LineWithLineBar = Chart.controllers.line.extend({
    draw: function(ease) {
      Chart.controllers.line.prototype.draw.call(this, ease);

      if (this.chart.tooltip._active && this.chart.tooltip._active.length && LineWithLineBar.lock) {
         var activePoint = this.chart.tooltip._active[0];
         LineBar.xPos = activePoint.tooltipPosition().x;
         LineBar.topY = this.chart.scales['y-axis-0'].top;
         LineBar.bottomY = this.chart.scales['y-axis-0'].bottom;

         LineBar.rect.left = LineBar.xPos ;
         LineBar.rect.top = LineBar.topY;
         LineBar.rect.right = this.chart.scales['x-axis-0'].right - LineBar.xPos;
         LineBar.rect.bottom = LineBar.bottomY - LineBar.topY;
      }

      // draw line
      var chartCtx = this.chart.chart.ctx;
      chartCtx.save();
      chartCtx.beginPath();
      chartCtx.moveTo(LineBar.xPos, LineBar.topY);
      chartCtx.lineTo(LineBar.xPos, LineBar.bottomY);
      chartCtx.lineWidth = 1.5;
      chartCtx.strokeStyle = lineColor || LineBar.color;
      chartCtx.stroke();
      chartCtx.rect(LineBar.rect.left, LineBar.rect.top, LineBar.rect.right, LineBar.rect.bottom);
      chartCtx.fillStyle = 'rgba(201, 203, 207, .3)';
      chartCtx.fill();
      chartCtx.restore();
    }
  });

  LineWithLineBar.config.data = {
    labels: labels,
    datasets: [{
      backgroundColor: color,
      borderColor: color,
      data: data,
      fill: true,
    }],
  };
  LineWithLineBar.chart = new Chart(ctx, LineWithLineBar.config);
}
