$(document).ready(function(){
    var canvasContext = $("#gameArea")[0].getContext('2d');
    canvasContext.beginPath();
    canvasContext.arc(240, 160, 20, 0, Math.PI*2, false);
    canvasContext.strokeStyle = "rgba(0, 0, 255, 0.5)";
    canvasContext.stroke();
    canvasContext.closePath();
});