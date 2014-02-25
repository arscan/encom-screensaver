var Canvas = require('canvas') , 
    canvas = new Canvas(600,100) , 
    canvas2 = new Canvas(600,100) , 
    canvas3 = new Canvas(600,100) , 
    ctx = canvas.getContext('2d'),
    ctx2 = canvas2.getContext('2d'),
    ctx3 = canvas3.getContext('2d'),
    fs = require('fs'), 
    out = fs.createWriteStream(__dirname + '/text.png')
    GIFEncoder = require('gifencoder'),
    encoder = new GIFEncoder(600,100);

var text = "GITHUB";

var drawText = function(ctx, text, offset, color, shadow){

    ctx.beginPath();
    ctx.font = "bold 40px Terminator";
    var textWidth = ctx.measureText(text).width;
    var left = canvas.width/2 - textWidth/2;

    var startPos = left + ctx.measureText(text.split("").splice(0,2).join("")).width - ctx.measureText(text.split("")[1]).width/2 -1;
 
    ctx.fillStyle = color;
    ctx.fillText(text, left + offset, 70 + offset);
    if(shadow != undefined){
        ctx.shadowColor = shadow;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

    } else {
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    ctx.fill();

    ctx.strokeStyle=color;
    ctx.beginPath();
    ctx.moveTo(startPos + offset, canvas.height/2 + offset);
    ctx.lineTo(startPos + offset, 40 + offset);
    ctx.quadraticCurveTo(startPos + offset, 25 + offset, startPos + 15 + offset, 25 + offset);
    ctx.lineTo(left + textWidth -10 + offset, 25 + offset);
    ctx.quadraticCurveTo(left + textWidth + 10 + offset, 25 + offset, left + textWidth + 10 + offset, 40 + offset);
    ctx.lineTo(left + textWidth + 10 + offset, 70 + offset);
    ctx.quadraticCurveTo(left + textWidth + 10 + offset, 85 + offset, left + textWidth - 10 + offset, 85 + offset);
    ctx.lineTo(left + 5 +  offset, 85 + offset);
    ctx.lineWidth = 10;
    ctx.stroke();

};
encoder.createReadStream().pipe(fs.createWriteStream('myanimated.gif'));

encoder.start();
encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
encoder.setDelay(125);  // frame delay in ms
encoder.setQuality(5); // image quality. 10 is default.

drawText(ctx, text, 0, "#6992bd");

var lines =[];
    for(var i = 0; i< 50; i++){
        var start = Math.floor(Math.random() * canvas.height);
        var thickness = Math.floor(Math.random() * 5);
        var amp = Math.floor(Math.random() * canvas.height/5);
        var startPos = 2 * Math.PI * Math.random();
        var opacityStart = 2 * Math.PI * Math.random();

        lines[i] = {
            start: start,
            thickness: thickness,
            amp: amp,
            startPos: amp,
            opacityStart: opacityStart
        };
        // ctx2.fillRect(0, Math.random() * canvas.height, canvas.width, Math.floor(Math.random()*5));
    }

ctx2.fillStyle = "#bbb";
for(var x = 0; x < 25; x++){
    ctx2.globalCompositeOperation = "source-over";
    ctx2.globalAlpha = 1;
    ctx2.clearRect(0,0,canvas.width, canvas.height);
    ctx2.drawImage(canvas,0,0);
    ctx2.globalCompositeOperation = "source-atop";

    for(var i = 0; i< lines.length; i++){
        ctx2.globalAlpha = (Math.sin(lines[i].opacityStart + Math.PI * 2 * x / 25) + 1) * .2;
        ctx2.fillRect(0, lines[i].start + Math.sin(lines[i].startPos + Math.PI * 2 * x / 25) * lines[i].amp, canvas.width, lines[i].thickness);
    }

    ctx2.globalAlpha = .2;
    ctx2.shadowColor = "#bbb";
    ctx2.shadowBlur = 10;
    ctx2.shadowOffsetX = 0;
    ctx2.shadowOffsetY = 0;
    ctx2.beginPath();
    ctx2.arc(canvas.width/ 2 + Math.sin(2*Math.PI * x / 25) * 5, canvas.height / 5, 50, 0, Math.PI * 2)
    ctx2.fill();
    ctx3.fillStyle = "#000";
    ctx3.fillRect(0,0, canvas.width, canvas.height);
    drawText(ctx3, text, -2, "#fff", "#6992bd");
    drawText(ctx3, text, -1, "#fff");
    drawText(ctx3, text, 2, "#333");
    drawText(ctx3, text, 1, "#333");
    ctx3.drawImage(canvas2,0,0);
    encoder.addFrame(ctx3);
}

encoder.finish();

// stream = canvas3.pngStream();
// 
// stream.on('data', function(chunk){
//     out.write(chunk);
// });
// 
// stream.on('end', function(){
//     console.log('saved png');
// });
