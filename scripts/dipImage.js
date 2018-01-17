function dipImage() {
    this.dipcan = new dipCanvas();
    this.width = 0;
    this.height = 0;
    this.RedChannel = new ImageData();
    this.GreenChannel = new ImageData();
    this.BlueChannel = new ImageData();
    this.AlphaChannel = new ImageData();
    this.HistogramId;
    //this.OrigHistogramCanvas;
    //this.History = [];
    //maybe move this to a class for source and dest?
    //this.ImageData;
    //this.savedImage = new Image();
    //add various canvas imagedata vars to share
    //this.Magnitude = new canElement();
    //this.Phase = new canElement();
    //this.Real = new canElement();
    //this.Imaginary = new canElement();
    //this.Source = new canElement();
    //this.Dest = new canElement();
    //this.srcHistogram = new canElement();
    //this.destHistogram = new canElement();         
}

dipImage.prototype = {
    Load: function (imgsrc) {
        if (imgsrc !== undefined) {
            var that = this;
            this.dipcan.Init(imgsrc, 'default', function () { that.PopulateMembers(); });
        }
        else {
            this.dipcan.Init(imgsrc, 'default', function () { that.PopulateMembers(); });
            //var newObject = jQuery.extend(true, {}, oldObject);

        }
        //this.Context = this.Canvas.getContext('2d');
        //if (this.Canvas.getContext) {
        //this.DisplayMsg('width  ', this.Canvas.width, true);
        //this.DisplayMsg('height  ', this.Canvas.height, true);
        //this.Magnitude = this.Context.createImageData(this.Canvas.width, this.Canvas.height).data;
        //this.Phase = this.Context.createImageData(this.Canvas.width, this.Canvas.height).data;
        //this.Real = this.Context.createImageData(this.Canvas.width, this.Canvas.height).data;
        //this.Imaginary = this.Context.createImageData(this.Canvas.width, this.Canvas.height).data;
        //this.Dest = this.Context.createImageData(this.Canvas.width, this.Canvas.height).data;
        //this.Histogram = this.Context.createImageData(256, 400).data;
        //this.Context.drawImage(this.image, 0, 0);
        //this.Source = this.Context.getImageData(0, 0, this.Canvas.width, this.Canvas.height).data;
        //}
    },

    LoadWithoutImage: function () {

    },

    CreateHistogram: function (HistogramId, ContainerId) {
        var hist = new histogram(ContainerId);
            hist.GetHistoGramFromDipImage(this, HistogramId);
    },

    PopulateMembers: function () {
        this.width = this.dipcan.WorkingCanvas.width;
        this.height = this.dipcan.WorkingCanvas.height;
        this.RedChannel.Init(this.width, this.height);
        this.GreenChannel.Init(this.width, this.height);
        this.BlueChannel.Init(this.width, this.height);
        this.AlphaChannel.Init(this.width, this.height);

        var ImageData = this.dipcan.Context.getImageData(0, 0, this.dipcan.WorkingCanvas.width,
        this.dipcan.WorkingCanvas.height).data;

        var i = 0;
        for (var y = 0; y < this.dipcan.WorkingCanvas.height; y++) {
            for (var x = 0; x < this.dipcan.WorkingCanvas.width; x++) {
                //if (i < 1200) console.log('popchannel x ' + x + ' popchannel y ' + y);
                this.RedChannel.Data[y][x] = ImageData[i];     //r
                this.GreenChannel.Data[y][x] = ImageData[i + 1]; //g
                this.BlueChannel.Data[y][x] = ImageData[i + 2]; //b
                this.AlphaChannel.Data[y][x] = ImageData[i + 3]; //a
                i += 4;
            }
        }
        //        if (this.ShowHistogram == true) {
        //            var hist = new histogram();
        //            hist.GetHistoGramFromDipImage(this);
        //        }
        //this.CreateHistogram();
    },

    PopulateImageData: function (ImageData) {

        this.RedChannel.Init(this.width, this.height);
        this.GreenChannel.Init(this.width, this.height);
        this.BlueChannel.Init(this.width, this.height);
        this.AlphaChannel.Init(this.width, this.height);

        var i = 0;
        for (var y = 0; y < this.dipcan.WorkingCanvas.height; y++) {
            for (var x = 0; x < this.dipcan.WorkingCanvas.width; x++) {
                this.RedChannel.Data[y][x] = ImageData[i];     //r
                this.GreenChannel.Data[y][x] = ImageData[i + 1]; //g
                this.BlueChannel.Data[y][x] = ImageData[i + 2]; //b
                this.AlphaChannel.Data[y][x] = ImageData[i + 3]; //a
                i += 4;
            }
        }
        //        if (this.ShowHistogram == true) {
        //            var hist = new histogram();
        //            hist.GetHistoGramFromDipImage(this);
        //        }
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

    getGrayScaleImageData: function () {
        var gscale = new ImageData();
        gscale.Init(this.width, this.height);
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var grayscale =
                (this.RedChannel.Data[y][x] + this.GreenChannel.Data[y][x] + this.BlueChannel.Data[y][x]) / 3;
                gscale.setPixel(x, y, grayscale);
            }
        }
        return gscale;
    },

    getGrayScale: function () {
        var gscale = jQuery.extend(true, {}, this);

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var grayscale =
                (this.RedChannel.Data[y][x] + this.GreenChannel.Data[y][x] + this.BlueChannel.Data[y][x]) / 3;
                gscale.RedChannel.Data[y][x] = grayscale;     //r
                gscale.source.GreenChannel.Data[y][x] = grayscale; //g
                gscale.BlueChannel.Data[y][x] = grayscale; //b
                gscale.AlphaChannel.Data[y][x] = 255; //a                
            }
        }
        return gscale;
    },

    setImageDataFromGrayScale: function (grayScalImgData) {
        this.RedChannel.Init(this.width, this.height);
        this.GreenChannel.Init(this.width, this.height);
        this.BlueChannel.Init(this.width, this.height);
        this.AlphaChannel.Init(this.width, this.height);

        //console.log('arr len ' + grayScalImgData.Data[0].length);
        //console.log('arr len ' + grayScalImgData.Data[0]);
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                //console.log('x ' + x + ' y ' + y);
                this.RedChannel.Data[y][x] = grayScalImgData.Data[y][x];     //r
                this.GreenChannel.Data[y][x] = grayScalImgData.Data[y][x]; //g
                this.BlueChannel.Data[y][x] = grayScalImgData.Data[y][x]; //b
                this.AlphaChannel.Data[y][x] = 255; //a                
            }
        }
    },

    CopyRotatedImage: function (DestinationCanvas, dStartX, dStartY, dEndX, dEndY, drawDest) {
        var img = this.Context.createImageData(this.dipcan.WorkingCanvas.width, this.dipcan.WorkingCanvas.height);
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
        this.savedImage.src = this.dipcan.WorkingCanvas.toDataURL("image/png");
        this.savedImage.onload = this.testDraw(DestinationCanvas, dStartX, dStartY,
        dEndX, dEndY, false, drawDest);
    },

    getPixelColumnRGBA: function (x) {
        var PixelColumnRGBA = [];
        var PixelColumnR = [];
        var PixelColumnG = [];
        var PixelColumnB = [];
        var PixelColumnA = [];

        for (var y = 0; y < this.dipcan.WorkingCanvas.height; y++) {
            //var PixelPosition = ((y * (this.Canvas.width * 4)) + (x * 4));
            //var grayscale = (this.ImageData[PixelPosition] + this.ImageData[PixelPosition + 1] + this.ImageData[PixelPosition + 2]) / 3;
            //PixelColumnR[y] = grayscale; //this.ImageData[PixelPosition];     //r
            PixelColumnR[y] = this.RedChannel.Data[y][x];     //r
            PixelColumnG[y] = this.GreenChannel.Data[y][x]; //g
            PixelColumnB[y] = this.BlueChannel.Data[y][x]; //b
            PixelColumnA[y] = this.AlphaChannel.Data[y][x]; //a
        }

        PixelColumnRGBA[0] = PixelColumnR;
        PixelColumnRGBA[1] = PixelColumnG;
        PixelColumnRGBA[2] = PixelColumnB;
        PixelColumnRGBA[3] = PixelColumnA;
        return PixelColumnRGBA;
    },

    getPixelRowRGBA: function (y) {
        var PixelRowRGBA = [];
        var PixelRowR = [];
        var PixelRowG = [];
        var PixelRowB = [];
        var PixelRowA = [];

        for (var x = 0; x < this.dipcan.WorkingCanvas.width; x++) {
            //var PixelPosition = ((y * (this.dipcan.WorkingCanvas.width * 4)) + (x * 4));
            //var grayscale = (this.ImageData[PixelPosition] + this.ImageData[PixelPosition + 1] 
            //+ this.ImageData[PixelPosition + 2]) / 3;
            PixelRowR[x] = this.RedChannel.Data[y][x]; //grayscale; //this.ImageData[PixelPosition];     //r
            PixelRowG[x] = this.GreenChannel.Data[y][x]; //grayscale; //this.ImageData[PixelPosition + 1]; //g
            PixelRowB[x] = this.BlueChannel.Data[y][x]; //grayscale; //this.ImageData[PixelPosition + 2]; //b
            PixelRowA[x] = this.AlphaChannel.Data[y][x]; //this.ImageData[PixelPosition + 3]; //a            
        }

        PixelRowRGBA[0] = PixelRowR;
        PixelRowRGBA[1] = PixelRowG;
        PixelRowRGBA[2] = PixelRowB;
        PixelRowRGBA[3] = PixelRowA;
        return PixelRowRGBA;
    },

    setPixelColumnRGBA: function (x, r, g, b, a) {
        for (var y = 0; y < this.dipcan.WorkingCanvas.height; y++) {
            //var PixelPosition = ((y * (this.Canvas.width * 4)) + (x * 4));
            this.RedChannel.Data[y][x] = r[y];
            this.GreenChannel.Data[y][x] = g[y];
            this.BlueChannel.Data[y][x] = b[y];
            this.AlphaChannel.Data[y][x] = a[y];
        }
    },

    setPixelRowRGBA: function (y, r, g, b, a) {
        for (var x = 0; x < this.dipcan.WorkingCanvas.width; x++) {
            //var PixelPosition = ((y * (this.dipcan.WorkingCanvas.width * 4)) + (x * 4));
            this.RedChannel.Data[y][x] = r[x];
            this.GreenChannel.Data[y][x] = g[x];
            this.BlueChannel.Data[y][x] = b[x];
            this.AlphaChannel.Data[y][x] = a[x];
        }
    },

    setPixelRGBA: function (x, y, r, g, b, a) {
        //var PixelPosition = ((y * (this.dipcan.WorkingCanvas.width * 4)) + (x * 4));
        //if(this.OutputData[PixelPosition]) possible check to see if the pixel position actually exists.
        this.RedChannel.Data[y][x] = r;
        this.GreenChannel.Data[y][x] = g;
        this.BlueChannel.Data[y][x] = b;
        this.AlphaChannel.Data[y][x] = a;
    },

    getPixelRGBA: function (x, y) {
        var PixelRGBA = [];
        //var PixelPosition = ((y * (this.dipcan.WorkingCanvas.width * 4)) + (x * 4));
        PixelRGBA[0] = this.RedChannel.Data[y][x];     //r
        PixelRGBA[1] = this.GreenChannel.Data[y][x]; //g
        PixelRGBA[2] = this.BlueChannel.Data[y][x]; //b
        PixelRGBA[3] = this.AlphaChannel.Data[y][x]; //a
        return PixelRGBA;
    },

    RotateAndDraw: function (DestinationCanvas, dStartX, dStartY, dEndX, dEndY, drawDest) {
        if (this.savedImage.complete) {
            var w = this.dipcan.WorkingCanvas.width * (-1);
            var h = this.dipcan.WorkingCanvas.height * (-1);
            this.Context.rotate(180 * Math.PI / 180);
            this.Context.drawImage(this.savedImage, w, h);
            this.ImageData = this.Context.getImageData(0, 0, this.dipcan.WorkingCanvas.width,
            this.dipcan.WorkingCanvas.height).data;
            this.CopyCanvasSection(DestinationCanvas, 0, 0, 128, 128, dStartX, dStartY, dEndX, dEndY);
            this.dipcan.WorkingCanvas.width = this.dipcan.WorkingCanvas.width;
            this.Load();
            if (this.ProcessCount < 4) {
                this.ProcessCount += 1;
                this.Createfft(DestinationCanvas, this.ProcessCount);
            }
            if (drawDest == true) {
                DestinationCanvas.dipcan.WorkingCanvas.width = DestinationCanvas.dipcan.WorkingCanvas.width;
                DestinationCanvas.Draw();
            }
        }
        else {
            var that = this;
            setTimeout(function () {
                that.testDraw(DestinationCanvas, dStartX, dStartY,
            dEndX, dEndY, true, drawDest)
            }, 300);
        }
    }
}