
function Spatial() {
    this.Filters = {
        "Gaussian Blur": [[1, 2, 1], [2, 4, 2], [1, 2, 1]],
        "Sharpen": [[0, -2, 0], [-2, 11, -2], [0, -2, 0]],
        "Mean Removal": [[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]],
        "Emboss Laplascian": [[-1, 0, -1], [0, 4, 0], [-1, 0, -1]],
        "Sobel": [[-1, -2, -1], [0, 0, 0], [1, 2, 1]],
        "Edge Detect": [[1, 1, 1], [0, 0, 0], [-1, -1, -1]],
        "Identity": [[0, 0, 0], [0, 1, 0], [0, 0, 0]]
    };
    //this.SourceHistogramCanvas = new dspImage();
    //this.DestinationHistogramCanvas = new dspImage();
    this.ActiveFilter;
    this.Source = new dipImage();
    this.GrayScale = new dipImage();
    this.Destination = new dipImage();
    this.width = 0;
    this.height = 0;
}

Spatial.prototype = {
    Init: function (imgSrc) {
        this.Source.ShowHistogram = true;
        this.Source.Load(imgSrc);        
    },

    InitFromExistingDipImage: function (dipImg) {
        var clonedDipImg = jQuery.extend(true, {}, dipImg);
        this.Source = clonedDipImg;
    },

    ApplyFilter: function () {
        if (this.Source.width == undefined) {
            alert('image not yet loaded, please be patient');
            return;
        }

        this.width = this.Source.width;
        this.height = this.Source.height;

        //console.log('pixrgba getting ' + this.Source.RedChannel.Data[50][50]);
        //console.log('pixrgba getting ' + this.Source.RedChannel.Data[100][100]);
        //console.log('pixrgba getting ' + this.Source.RedChannel.Data[200][200]);

        this.Destination = new dipImage(); // jQuery.extend(true, {}, this.Source);
        this.Destination.width = this.width;
        this.Destination.height = this.height;
        this.Destination.dipcan.CreateNewCanvasElement('dest', this.width, this.height, '#dipCanvas');

        var ImageData = this.Destination.dipcan.Context.getImageData(0, 0, this.width, this.height).data;
        this.Destination.PopulateImageData(ImageData);
        
        //console.log('pixrgba getting ' + this.Destination.RedChannel.Data[50][50]);
        //console.log('pixrgba getting ' + this.Destination.RedChannel.Data[100][100]);
        //console.log('pixrgba getting ' + this.Destination.RedChannel.Data[200][200]);

        //alert(this.Source.dipcan);
        //alert(this.Destination.Source.dipcan);
        //var kCenterX = Math.ceil(GaussianFilter[0].length / 2)
        //var kCenterY = Math.ceil(GaussianFilter.length / 2)
        var Filter = this.ActiveFilter;
        var kRows = Filter.length;
        var kCols = Filter[0].length;

        var divisor = offset = 0;
        for (var krow = 0; krow < kRows; krow++)      // kernel rows
        {
            for (kcol = 0; kcol < kCols; kcol++)  // kernel columns
            {
                divisor += Filter[krow][kcol];
            }
        }

        if (divisor == 0) {
            divisor = 1;
            offset = 127;
        }
        if (divisor < 0) divisor *= -1;
        var pixcount = 0;

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {

                var rsum = 0;                            // init to 0 before sum
                var gsum = 0;                            // init to 0 before sum
                var bsum = 0;                            // init to 0 before sum
                var pixelRGBA;

                for (var krow = -1; krow <= 1; krow++)      // kernel rows
                {
                    for (kcol = -1; kcol <= 1; kcol++)  // kernel columns
                    {
                        // ignore input samples which are out of bounds
                        var colIndex = x + kcol;
                        var rowIndex = y + krow;

                        if (rowIndex >= 0 && rowIndex < this.height && colIndex >= 0 && colIndex < this.width) {
                            pixelRGBA = this.Source.getPixelRGBA(colIndex, rowIndex);
                            //if (pixcount < 300) console.log('pixrgba getting ' + RedChannel.Data[y][x]);
                            rsum += pixelRGBA[0] * Filter[krow + 1][kcol + 1];
                            gsum += pixelRGBA[1] * Filter[krow + 1][kcol + 1];
                            bsum += pixelRGBA[2] * Filter[krow + 1][kcol + 1];
                            pixcount += 1;
                        }
                    }
                }

                rsum = (rsum / divisor) + offset;
                gsum = (gsum / divisor) + offset;
                bsum = (bsum / divisor) + offset;
                if (rsum > 255) rsum = 255;
                if (rsum < 0) rsum = 0;
                if (gsum > 255) gsum = 255;
                if (gsum < 0) gsum = 0;
                if (bsum > 255) bsum = 255;
                if (bsum < 0) bsum = 0;

                this.Destination.setPixelRGBA(x, y, (rsum), (gsum), (bsum), pixelRGBA[3]);
            }
        }
        //this.Source.dipcan.WorkingCanvas.width = this.Source.dipcan.WorkingCanvas.width;
        //var npixelRGBA = this.Source.getPixelRGBA(50, 50);
        //console.log('dest ' + npixelRGBA[0]);
        //npixelRGBA = this.Source.getPixelRGBA(100, 100);
        //console.log('dest ' + npixelRGBA[0]);
        //npixelRGBA = this.Source.getPixelRGBA(120, 120);
        //console.log('dest ' + npixelRGBA[0]);
        this.Destination.dipcan.Draw(this.Destination);
        this.Source.CreateHistogram('SourceHist', '#dipHistogram');
        this.Destination.CreateHistogram('DestHist', '#dipHistogram');
    }
}