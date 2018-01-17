
function DSP() {
    // Global variables Start
    this.Filters;
    this.SourceCanvas = new dspImage();
    this.DestinationCanvas = new dspImage();
    this.RealCanvas = new dspImage();
    this.ImaginaryCanvas = new dspImage();
    this.QuadCanvas = new dspImage();
    this.ImageUrl;
    this.width;
    this.height;
    this.image = new Image();
    // Global variables End
}

DSP.prototype = {
    Load: function () {
        if (this.SourceCanvas.Canvas.getContext) {
            this.width = this.SourceCanvas.Canvas.width = this.DestinationCanvas.Canvas.width =
            this.RealCanvas.Canvas.width = this.ImaginaryCanvas.Canvas.width =
            this.image.width;

            this.height = this.SourceCanvas.Canvas.height = this.DestinationCanvas.Canvas.height =
            this.RealCanvas.Canvas.height = this.ImaginaryCanvas.Canvas.height =
            this.image.height;

            //this.QuadCanvas.Canvas.height = this.image.height / 2;
            //this.QuadCanvas.Canvas.width = this.image.width / 2;
            this.SourceCanvas.Load(this.image);
            this.RealCanvas.Load();
            this.ImaginaryCanvas.Load();
            this.DestinationCanvas.Load();
            //this.QuadCanvas.Load();            
        }
    },

    FFT: function (N, r, i) {

        var M = N / 2; //long 
        var lo = 0;
        var hi = 0;
        var k = 0;
        var m = 0;
        var delta = 0;
        var t = 0; //double
        var t1 = 0;
        var x = 0;
        var y = 0;
        var twcos = 0;
        var twsin = 0;
        var pi = 3.1415926535897932;

        //$('#outputDiv').append('M: ' + M + '<br/>');

        for (delta = M; delta > 0.5; delta = delta / 2) {
            //$('#outputDiv').append('delta: ' + delta + '<br/>');
            x = pi / delta; hi = 0;
            for (k = 0; k < M / delta; k++) {
                //$('#outputDiv').append('k: ' + k + '<br/>');
                lo = hi;
                hi = lo + delta;
                for (m = 0; m < delta; m++) {
                    //$('#outputDiv').append('m: ' + m + '<br/>');
                    t = r[lo] - r[hi];
                    r[lo] = r[lo] + r[hi];
                    r[hi] = t;
                    t1 = i[lo] - i[hi];
                    i[lo] = i[lo] + i[hi];
                    i[hi] = t1;
                    if (m > 0 && delta > 1) { // do twiddle multiply, but not for twiddles of 0
                        y = m * x;
                        twcos = Math.cos(y);
                        twsin = -1 * Math.sin(y);
                        t = (r[hi] - i[hi]) * twsin;
                        r[hi] = t + r[hi] * (twcos - twsin);
                        i[hi] = t + i[hi] * (twcos + twsin);
                    } // end if
                    lo++;
                    hi++;
                } // end for over m
            } // end for over k
        } // end for over delta
        //******** bit reverse for radix 2 *****
        //$('#outputDiv').append('starting bit reversal' + '<br/>');

        var J = 0; //long ,
        var K = 0;
        var L = 0;
        var N2 = N / 2;
        for (L = 0; L < (N - 2); L++) {
            if (L < J) {
                t = r[L];
                r[L] = r[J];
                r[J] = t;
                t1 = i[L];
                i[L] = i[J];
                i[J] = t1;
            }
            K = N2;
            while (K <= J) {
                J = J - K; K = K / 2;
            } // end while
            J = J + K;
        } // end for ***** bit reverse done ******
        //} // end fft_N_func
    },

    roundNumber: function (num, dec) {
        var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
        return result;
    },

    initArray: function (arrayLength, defaultValue) {
        var arr = [];
        for (var i = 0; i < arrayLength; i++) {
            arr[i] = defaultValue;
        }
        return arr;
    },

    ApplyFFT: function () {

        for (var y = 0; y < this.SourceCanvas.Canvas.height; y++) {
            for (var x = 0; x < this.SourceCanvas.Canvas.width; x++) {
                var pixelRGBA = this.SourceCanvas.getPixelRGBA(x, y);
                var r = pixelRGBA[0] * Math.pow(-1, (x + y));
                var g = pixelRGBA[1] * Math.pow(-1, (x + y));
                var b = pixelRGBA[2] * Math.pow(-1, (x + y));
                this.SourceCanvas.setPixelRGBA(x, y, r, g, b, pixelRGBA[3]);
            }
        }

        //var i = this.initArray(this.width, 0);
        var alpha = this.initArray(this.width, 255);
        for (var y = 0; y < this.height; y++) {
            var rPixelRowRGBA = this.SourceCanvas.getPixelRowRGBA(y);
            var rPixelRowR = rPixelRowRGBA[0];

            var iPixelRowRGBA = this.ImaginaryCanvas.getPixelRowRGBA(y);
            var iPixelRowR = iPixelRowRGBA[0];
            //don't need the ones below if we are performing an fft on the grayscale
            //var PixelRowG = PixelRowRGBA[1];
            //var PixelRowB = PixelRowRGBA[2];
            //var PixelRowA = PixelRowRGBA[3];

            var N = this.width;

            var n = 0;

            this.FFT(N, rPixelRowR, iPixelRowR);

            for (var n = 0; n < N; n++) {
                rPixelRowR[n] = this.roundNumber(rPixelRowR[n] / N, 0);
                iPixelRowR[n] = this.roundNumber(iPixelRowR[n] / N, 0);
                //if (PixelRowR[n] == 0) PixelRowR[n] = 127;
                //if (PixelRowR[n] < 0) PixelRowR[n] = 0; //*= -1;
            }

            this.RealCanvas.setPixelRowRGBA(y, rPixelRowR, rPixelRowR, rPixelRowR, alpha); //alpha will always be 255 here.
            this.ImaginaryCanvas.setPixelRowRGBA(y, iPixelRowR, iPixelRowR, iPixelRowR, alpha); //alpha will always be 255 here.
        }


        var MagMax = 0;
        var MagCols = this.initArray(this.width, 0);

        for (var x = 0; x < this.width; x++) {
            var rPixelColumnRGBA = this.RealCanvas.getPixelColumnRGBA(x);
            var rPixelColumnR = rPixelColumnRGBA[0];

            var iPixelColumnRGBA = this.ImaginaryCanvas.getPixelColumnRGBA(x);
            var iPixelColumnR = iPixelColumnRGBA[0];
            //var PixelColumnG = PixelColumnRGBA[1];
            //var PixelColumnB = PixelColumnRGBA[2];
            //var PixelColumnA = PixelColumnRGBA[3];

            var N = this.height;
            var n = 0;
            var MagCol = this.initArray(this.width, 0);
            this.FFT(N, rPixelColumnR, iPixelColumnR);

            for (var n = 0; n < N; n++) {
                rPixelColumnR[n] = this.roundNumber(rPixelColumnR[n] / N, 4);
                iPixelColumnR[n] = this.roundNumber(iPixelColumnR[n] / N, 4);
                var mag = this.roundNumber(Math.sqrt((rPixelColumnR[n] * rPixelColumnR[n]) + (iPixelColumnR[n] * iPixelColumnR[n])), 4);
                MagCol[n] = mag;
            }
            var MagColMax = Math.max.apply(null, MagCol);
            if (MagMax < MagColMax) MagMax = MagColMax;
            MagCols[x] = MagCol;
        }

        var c = 255 / Math.log(1 + Math.abs(MagMax)) + 700;
        //$('#outputDiv').append('c: ' + c + '<br/>');
        for (var x = 0; x < this.width; x++) {
            MagCol = MagCols[x];
            for (var n = 0; n < MagCol.length; n++) {
                MagCol[n] = c * Math.log(1 + MagCol[n]);
                //MagCol[n] = MagCol[n] + 127;
                //if (MagCol[n] > 50) $('#outputDiv').append('mag: ' + MagCol[n] + '|');
                //if (mag = 0) mag = 127;
                //if (mag < 0) mag = 0;
                //if (mag > 255) mag = 255;
            }
            //$('#outputDiv').append('<br/>');
            this.DestinationCanvas.setPixelColumnRGBA(x, MagCol, MagCol, MagCol, alpha);
        }
        this.DestinationCanvas.width = this.DestinationCanvas.width;
        this.DestinationCanvas.Draw();
        //        var cumHist = this.initArray(256, 0);

        //        for (var y = 0; y < this.DestinationCanvas.Canvas.height; y++) {
        //            for (var x = 0; x < this.DestinationCanvas.Canvas.width; x++) {
        //                var pixelRGBA = this.DestinationCanvas.getPixelRGBA(x, y);
        //                cumHist[pixelRGBA[0]] += 1;
        //                //$('#outputDiv').append('count: ' + cumHist[pixelRGBA[0]] + ' pix: ' + pixelRGBA[0] + '<br/>');
        //            }
        //        }
        //        var greymax = Math.max.apply(null, cumHist);
        //        var greymin = Math.min.apply(null, cumHist);
        //        for (var y = 0; y < cumHist.length; y++) {
        //            if (cumHist[y] > 0) {
        //                $('#outputDiv').append('min: ' + y + '<br/>');
        //                y = cumHist.length;
        //            }
        //        }
        //        for (var y = cumHist.length; y > 0; y--) {
        //            if (cumHist[y] > 0) {
        //                $('#outputDiv').append('max: ' + y + '<br/>');
        //                y = 0;
        //            }
        //        }
        //        $('#outputDiv').append('max: ' + greymax + ' min: ' + greymin + '<br/>');
        //        //        for (var y = 0; y < this.height; y++) {
        //        //            for (var x = 0; x < this.width; x++) {
        //        //                var pixelRGBA = this.DestinationCanvas.getPixelRGBA(x, y);
        //        //                //if (pixelRGBA[1] > 127)
        //        //                    //$('#outputDiv').append('x: ' + x + ' y: ' + y + ' pix val: ' + pixelRGBA[1] + '<br/>');
        //        //            }
        //        //        }
        //        this.QuadCanvas.Createfft(this.DestinationCanvas, 1);
    }
}