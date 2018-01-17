function histogram(ContainerId) {
    this.width;
    this.height;
    this.ContainerId = ContainerId;
    this.Data = [];
}

histogram.prototype = {

    GetHistoGramFromDipImage: function (dimg, HistogramId) {
        var dcan = new dipCanvas();

        dcan.CreateNewCanvasElement(HistogramId, 256, 500, this.ContainerId);

        var utils = new DIPUtils();
        var rHist = utils.initArray(256, 0);
        var gHist = utils.initArray(256, 0);
        var bHist = utils.initArray(256, 0);
        var cumHist = utils.initArray(256, 0);
        //TargetCanvas
        for (var y = 0; y < dimg.height; y++) {
            for (var x = 0; x < dimg.width; x++) {
                var pixelRGBA = dimg.getPixelRGBA(x, y);
                var Grayscale = (pixelRGBA[0] + pixelRGBA[1] + pixelRGBA[2]) / 3;
                rHist[pixelRGBA[0]] += 1;
                gHist[pixelRGBA[1]] += 1;
                bHist[pixelRGBA[2]] += 1;
                cumHist[Grayscale] += 1;
            }
        }
        //for (var y = 0; y < source.Canvas.height; y++) {
        //    for (var x = 0; x < dimg.Canvas.width; x++) {                
        //    }
        //}

        var redmax = Math.max.apply(null, rHist);
        var greenmax = Math.max.apply(null, gHist);
        var bluemax = Math.max.apply(null, bHist);
        var greymax = Math.max.apply(null, cumHist);

        var histmax = Math.max.apply(null, [redmax, greenmax, bluemax, greymax]);

        //dcan.WorkingCanvas.width = dcan.WorkingCanvas.width;

        function colorbars(max, vals, color, y) {
            dcan.Context.fillStyle = color;
            jQuery.each(vals, function (i, x) {
                var pct = (vals[i] / max) * 100;
                dcan.Context.fillRect(i, y, 1, -Math.round(pct));
            });
        }

        colorbars(histmax, rHist, "rgb(256,0,0)", 100);
        colorbars(histmax, gHist, "rgb(0,256,0)", 200);
        colorbars(histmax, bHist, "rgb(0,0,256)", 300);
        colorbars(histmax, cumHist, "rgb(0,0,0)", 400);
    }
}