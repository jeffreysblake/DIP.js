
function DipFreq(img) {
    //this.SourceCanvas = new dspImage();
    //this.DestinationCanvas = new dspImage();
    //this.RealCanvas = new dspImage();
    //this.ImaginaryCanvas = new dspImage();
    this.width = 0;
    this.height = 0;
    //this.image = new Image();

    this.RealData = new ImageData();
    this.ImaginaryData = new ImageData();
    this.MagnitudeData = new ImageData();
    this.PhaseData = new ImageData();
    this.GrayScaleData = new ImageData();
    this.Source = new dipImage();
    //this.SourcePolar = new dipImage();
}

DipFreq.prototype = {

    Init: function (imgSrc) {
        //this.Source.ShowHistogram = true;
        this.Source.Load(imgSrc);
    },

    LoadFromDipImage: function (dImg) {
        if (dImg.getContext) {
            this.Source = dImg;
            this.width = dImg.width;
            this.height = dImg.height;
            this.RealData.Init(this.width, this.height);
            this.ImaginaryData.Init(this.width, this.height);
            this.MagnitudeData.Init(this.width, this.height);
            this.PhaseData.Init(this.width, this.height);
            this.GrayScaleData.Init(this.width, this.height);
            this.GrayScaleData = dImg.getGrayScaleImageData();

            //= this.DestinationCanvas.Canvas.width =
            //this.RealCanvas.Canvas.width = this.ImaginaryCanvas.Canvas.width =
            //this.image.width;

            //////            this.Destination = new dipImage(); // jQuery.extend(true, {}, this.Source);
            //////            this.Destination.width = this.width;
            //////            this.Destination.height = this.height;
            //////            this.Destination.dipcan.CreateNewCanvasElement('dest', this.width, this.height);

            //////            var ImageData = this.Destination.dipcan.Context.getImageData(0, 0, this.width, this.height).data;


            //////            this.Destination.PopulateImageData(ImageData);

            // = this.DestinationCanvas.Canvas.height =
            //this.RealCanvas.Canvas.height = this.ImaginaryCanvas.Canvas.height =
            //this.image.height;

            //this.QuadCanvas.Canvas.height = this.image.height / 2;
            //this.QuadCanvas.Canvas.width = this.image.width / 2;
            //this.SourceCanvas.Load(this.image);
            //this.RealCanvas.Load();
            //this.ImaginaryCanvas.Load();
            //this.DestinationCanvas.Load();
            //this.QuadCanvas.Load();            
        }
    },

    ApplyFFT: function () {

        if (!this.Source.dipcan.image.complete) {
            console.log('image not loaded');
            return;
        }

        var dImg = this.Source.dipcan.image;
        this.width = dImg.width;
        this.height = dImg.height;

        this.RealData.Init(this.width, this.height);
        this.ImaginaryData.Init(this.width, this.height);
        this.MagnitudeData.Init(this.width, this.height);
        this.PhaseData.Init(this.width, this.height);
        this.GrayScaleData.Init(this.width, this.height);

        this.GrayScaleData = this.Source.getGrayScaleImageData();

        var utils = new DIPUtils();
        utils.roundNumber(256, 0);
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var pixelVal = this.GrayScaleData.getPixel(x, y);
                var polar = pixelVal * Math.pow(-1, (x + y));
                this.GrayScaleData.setPixel(x, y, polar);
            }
        }
        //console.log('begin row op');
        var alpha = utils.initArray(this.width, 255);
        for (var y = 0; y < this.height; y++) {
            var rPixelRowR = this.GrayScaleData.getPixelRow(y);
            var iPixelRowR = this.ImaginaryData.getPixelRow(y);
            var N = this.width;
            var n = 0;
            
            this.FFT(N, rPixelRowR, iPixelRowR);
            
            for (var n = 0; n < N; n++) {
                rPixelRowR[n] = utils.roundNumber(rPixelRowR[n] / N, 0);
                iPixelRowR[n] = utils.roundNumber(iPixelRowR[n] / N, 0);
                //if (PixelRowR[n] == 0) PixelRowR[n] = 127;
                //if (PixelRowR[n] < 0) PixelRowR[n] = 0; //*= -1;
            }
            this.RealData.setPixelRow(y, rPixelRowR);
            this.ImaginaryData.setPixelRow(y, iPixelRowR);
            
        }
        //console.log('end row op');

        var MagMax = 0;
        var MagCols = utils.initArray(this.width, 0);
        for (var x = 0; x < this.width; x++) {
            var rPixelColumnR = this.RealData.getPixelColumn(x);

            var iPixelColumnR = this.ImaginaryData.getPixelColumn(x);

            var N = this.height;
            var n = 0;
            var MagCol = utils.initArray(this.width, 0);
            this.FFT(N, rPixelColumnR, iPixelColumnR);
            //console.log('n: ' + N);

            for (var n = 0; n < N; n++) {
                rPixelColumnR[n] = utils.roundNumber(rPixelColumnR[n] / N, 4);
                iPixelColumnR[n] = utils.roundNumber(iPixelColumnR[n] / N, 4);
                var mag = utils.roundNumber(Math.sqrt(
                (rPixelColumnR[n] * rPixelColumnR[n]) + (iPixelColumnR[n] * iPixelColumnR[n])), 4);

                MagCol[n] = mag;
            }
            var MagColMax = Math.max.apply(null, MagCol);
            if (MagMax < MagColMax) MagMax = MagColMax;
            MagCols[x] = MagCol;
        }
        //console.log('end col op');
        var c = 255 / Math.log(1 + Math.abs(MagMax)) + 700;
        //console.log('c: ' + c);
        for (var x = 0; x < this.width; x++) {
            MagCol = MagCols[x];
            for (var n = 0; n < MagCol.length; n++) {
                MagCol[n] = c * Math.log(1 + MagCol[n]);
                //MagCol[n] = MagCol[n] + 127;
                //if (MagCol[n] > 50) console.log('mag: ' + MagCol[n] + '|');
                //if (mag = 0) mag = 127;
                //if (mag < 0) mag = 0;
                //if (mag > 255) mag = 255;
            }

            this.ImaginaryData.getPixelColumn(x);
            this.MagnitudeData.setPixelColumn(x, MagCol);


        }

        //var dcan = new dipCanvas();
        //dcan.CreateNewCanvasElement('magdata', this.width, this.height);

        //this.Destination.dipcan.Draw(this.Destination);

        var destimg = new dipImage(); // jQuery.extend(true, {}, this.Source);
        destimg.width = this.width;
        destimg.height = this.height;
        destimg.dipcan.CreateNewCanvasElement('destmag', this.width, this.height, '#dipCanvas');

        //var ImageData = this.Destination.dipcan.Context.getImageData(0, 0, this.width, this.height).data;
        //console.log('gsd: ' + this.MagnitudeData.Data[0]);
        
        destimg.setImageDataFromGrayScale(this.MagnitudeData);
        //this.Destination.PopulateImageData(ImageData);
        destimg.dipcan.Draw(destimg);
        //console.log('done ');
        //this.DestinationCanvas.width = this.DestinationCanvas.width;
        //this.DestinationCanvas.Draw();
        //        var cumHist = utils.initArray(256, 0);

        //        for (var y = 0; y < this.DestinationCanvas.Canvas.height; y++) {
        //            for (var x = 0; x < this.DestinationCanvas.Canvas.width; x++) {
        //                var pixelRGBA = this.DestinationCanvas.getPixelRGBA(x, y);
        //                cumHist[pixelRGBA[0]] += 1;
        //                //console.log('count: ' + cumHist[pixelRGBA[0]] + ' pix: ' + pixelRGBA[0]);
        //            }
        //        }
        //        var greymax = Math.max.apply(null, cumHist);
        //        var greymin = Math.min.apply(null, cumHist);
        //        for (var y = 0; y < cumHist.length; y++) {
        //            if (cumHist[y] > 0) {
        //                console.log('min: ' + y);
        //                y = cumHist.length;
        //            }
        //        }
        //        for (var y = cumHist.length; y > 0; y--) {
        //            if (cumHist[y] > 0) {
        //                console.log('max: ' + y);
        //                y = 0;
        //            }
        //        }
        //        console.log('max: ' + greymax + ' min: ' + greymin);
        //        //        for (var y = 0; y < this.height; y++) {
        //        //            for (var x = 0; x < this.width; x++) {
        //        //                var pixelRGBA = this.DestinationCanvas.getPixelRGBA(x, y);
        //        //                //if (pixelRGBA[1] > 127)
        //        //                    console.log('x: ' + x + ' y: ' + y + ' pix val: ' + pixelRGBA[1]);
        //        //            }
        //        //        }
        //        this.QuadCanvas.Createfft(this.DestinationCanvas, 1);
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

        for (delta = M; delta > 0.5; delta = delta / 2) {
            x = pi / delta; hi = 0;
            for (k = 0; k < M / delta; k++) {
                lo = hi;
                hi = lo + delta;
                for (m = 0; m < delta; m++) {
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

    ApplyInverseFFT: function () {
        //gotta record the phase --- PHASE(F) = ATAN( IMAGINARY(F)/REAL(F) )
        // f(x,y) = SUM{ F(u,v)*exp(+j*2*pi*(u*x+v*y)/N) }  ---get the inverse from the phase and magnitude? how....

        // aha! check this out!
        //mag =  sqrt(real(F).^2 + imag(F).^2);
        //phase = atan2(imag(F),real(F));

        //re = mag .* cos(phase);
        //im = mag .* sin(phase);
        //F = re + 1i*im;


        //Mag = sqrt(Real(F)^2 + Imaginary(F)^2)
        //Phase = arctan(Imaginary(F)/Real(F))
        //Real = Mag/sqrt(1 + tan(Phase)^2)
        //Imaginary = Real*tan(Phase)
        //F = Real + i * Imaginary
        //image = ifft2(F)
    }
}