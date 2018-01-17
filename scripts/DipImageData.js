function ImageData() {
    this.width;
    this.height;
    this.Data = [];
}

ImageData.prototype = {
    Init: function (w, h) {
        this.width = w;
        this.height = h;
        var utils = new DIPUtils();
        this.Data = utils.initArray2d(this.height, this.width, 0);
    },

    CopyCanvasSection: function (DestCan, sStartX, sStartY, sEndX, sEndY, dStartX, dStartY, dEndX, dEndY) {
        var countX = 0;
        var countY = 0;
        for (var y = sStartY; y < sEndY; y++) {
            for (var x = sStartX; x < sEndX; x++) {
                var pixelRGBA = this.getPixelRGBA(x, y);
                if (dStartX + countX < dEndX && dStartY + countY < dEndY) {
                    DestCan.setPixelRGBA(dStartX + countX, dStartY + countY, pixelRGBA[0],
                pixelRGBA[1], pixelRGBA[2], pixelRGBA[3]);
                }
                countX += 1;
            }
            countX = 0;
            countY += 1;
        }
    },

    CopyRotatedImage: function (DestinationCanvas, dStartX, dStartY, dEndX, dEndY, drawDest) {
        var img = this.Context.createImageData(this.Canvas.width, this.Canvas.height);
        //todo: add history element to go forwards and backwards for applying filters and other
        //transformation effects.
        //this.history[history.length] = this.ImageData;
        for (i = 0; i < img.data.length; i += 4) {
            img.data[i] = this.ImageData[i];
            img.data[i + 1] = this.ImageData[i + 1];
            img.data[i + 2] = this.ImageData[i + 2];
            img.data[i + 3] = 255; // this.ImageData[i + 3];
        }
        this.Context.putImageData(img, 0, 0);
        this.savedImage = new Image()
        this.savedImage.src = this.Canvas.toDataURL("image/png");
        this.savedImage.onload = this.testDraw(DestinationCanvas, dStartX, dStartY,
        dEndX, dEndY, false, drawDest);
    },

    getNormalizedData: function () {
        var utils = new DIPUtils();
        var NormalizedData = utils.initArray2d(this.height, this.width, 0);

        return NormalizedData;
    },

    getPixelColumn: function (x) {
        var utils = new DIPUtils();
        var PixelColumn = utils.initArray(this.height, 0);
        for (var y = 0; y < this.height; y++) {
            //var PixelPosition = ((y * (this.width * 4)) + (x * 4));
            //var grayscale = (this.ImageData[PixelPosition] + this.ImageData[PixelPosition + 1] + this.ImageData[PixelPosition + 2]) / 3;
            //PixelColumnR[y] = grayscale; //this.ImageData[PixelPosition];
            PixelColumn[y] = this.Data[y][x];
        }
        return PixelColumn;
    },

    getPixelRow: function (y) {
        var utils = new DIPUtils();
        var PixelRow = utils.initArray(this.width, 0);
        for (var x = 0; x < this.width; x++) {
            //var PixelPosition = ((y * (this.width * 4)) + (x * 4));
            //var grayscale = (this.ImageData[PixelPosition] + this.ImageData[PixelPosition + 1] + this.ImageData[PixelPosition + 2]) / 3;
            PixelRow[x] = this.Data[y][x]; //this.Data[PixelPosition];     //grayscale;        
        }
        return PixelRow;
    },

    setPixelColumn: function (x, arr) {
        for (var y = 0; y < this.height; y++) {
            //var PixelPosition = ((y * (this.width * 4)) + (x * 4));
            this.Data[y][x] = arr[y];
        }
    },

    setPixelRow: function (y, arr) {
        for (var x = 0; x < this.width; x++) {
            //var PixelPosition = ((y * (this.width * 4)) + (x * 4));
            this.Data[y][x] = arr[x];
        }
    },

    setPixel: function (x, y, val) {
        //var PixelPosition = ((y * (this.width * 4)) + (x * 4));
        //if(this.OutputData[PixelPosition]) possible check to see if the pixel position actually exists.
        this.Data[y][x] = val;
    },

    getPixel: function (x, y) {
        //var PixelPosition = ((y * (this.width * 4)) + (x * 4));
        return this.Data[y][x];
    }
}