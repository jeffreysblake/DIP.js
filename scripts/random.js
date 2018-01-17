var c2 = canvas.getContext('2d');
c2.fillStyle = '#f00';
c2.beginPath();
c2.moveTo(0, 0);
c2.lineTo(100,50);
c2.lineTo(50, 100);
c2.lineTo(0, 90);
c2.closePath();
c2.fill();

//public void DrawPolygonPoint(PaintEventArgs e)
//{

//    // Create pen.
//    Pen blackPen = new Pen(Color.Black, 3);

//    // Create points that define polygon.
//    Point point1 = new Point(50,  50);
//    Point point2 = new Point(100,  25);
//    Point point3 = new Point(200,   5);
//    Point point4 = new Point(250,  50);
//    Point point5 = new Point(300, 100);
//    Point point6 = new Point(350, 200);
//    Point point7 = new Point(250, 250);
//    Point[] curvePoints =
//             {
//                 point1,
//                 point2,
//                 point3,
//                 point4,
//                 point5,
//                 point6,
//                 point7
//             };

//    // Draw polygon to screen.
//    e.Graphics.DrawPolygon(blackPen, curvePoints);
//}



        //        GetFunctionHandle: function (formula) //RendererFunction 
        //        {
        //            CompiledFunction fn = FunctionCompiler.Compile(2, formula);
        //            return new RendererFunction(delegate(double x, double y)
        //            {
        //                return fn(x, y);
        //            });
        //        },

        //        SetFunction: function (formula)
        //        {
        //            function = GetFunctionHandle(formula);
        //        },

        //        defaultFunction: function (a, b) //double 
        //        {
        //            var an = a, bn = b, anPlus1;
        //            var iter = 0;
        //            do
        //            {
        //                anPlus1 = (an + bn) / 2.0;
        //                bn = Math.Sqrt(an * bn);
        //                an = anPlus1;
        //                if (iter++ > 1000) return an;
        //            } while (Math.Abs(an - bn)<0.1);
        //            return an;
        //        }
        //}
    //public delegate double RendererFunction(double x, double y);





//var test_canvas = document.createElement("canvas") //try and create sample canvas element
//var canvascheck=(test_canvas.getContext)? true : false //check if object supports getContext() method, a method of the canvas element

//var test_canvas = document.createElement("canvas"); //try and create sample canvas element
        //var canvascheck = (test_canvas.getContext) ? true : false;
        //check if object supports getContext() method, a method of the canvas element
//        DisplayMsg: function (lbl, str, br) {
//        var outputStr = lbl + " : " + str;
//        if (br) outputStr += "<br />";
//        console.log(outputStr);
//    },
//using set time out with context
//setTimeout(function () { that.tip.destroy() }, 1000);


//old test code for flipping images
//function flipImage(image) {
//    var myCanvas = document.createElement("canvas");
//    var myCanvasContext = myCanvas.getContext("2d");

//    var imgWidth = image.width;
//    var imgHeight = image.height;
//    // You'll get some string error if you fail to specify the dimensions
//    myCanvas.width = imgWidth;
//    myCanvas.height = imgHeight;
//    //  alert(imgWidth);
//    myCanvasContext.drawImage(image, 0, 0);
//    // this function cannot be called if the image is not rom the same domain.  You'll get security error
//    var imageData = myCanvasContext.getImageData(0, 0, imgWidth, imgHeight);

//    // Traverse every row and flip the pixels
//    for (i = 0; i < imageData.height; i++) {
//        // We only need to do half of every row since we're flipping the halves
//        for (j = 0; j < imageData.width / 2; j++) {
//            var index = (i * 4) * imageData.width + (j * 4);
//            var mirrorIndex = ((i + 1) * 4) * imageData.width - ((j + 1) * 4);
//            for (p = 0; p < 4; p++) {
//                var temp = imageData.data[index + p];
//                imageData.data[index + p] = imageData.data[mirrorIndex + p];
//                imageData.data[mirrorIndex + p] = temp;
//            }
//        }
//    }
//    myCanvasContext.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
//    return myCanvas.toDataURL();
//}

//        var foo = document.getElementById("targetElementID");
//        var canvas = document.createElement('canvas');
//        canvas.setAttribute("width", 620);
//        canvas.setAttribute("height", 310);
//        canvas.setAttribute("class", "mapping");
//        foo.appendChild(canvas);
//        canvas = G_vmlCanvasManager.initElement(canvas);

// Loop over each pixel and invert the color.
//        for (var i = 0, n = pix.length; i < n; i += 4) {
//            pix[i] = 255 - pix[i]; // red
//            pix[i + 1] = 255 - pix[i + 1]; // green
//            pix[i + 2] = 255 - pix[i + 2]; // blue
//            // i+3 is alpha (the fourth element)
//        }

//        function pixelRGBA(red, green, blue, alpha) {
//            this.Red = red;
//            this.Green = green;
//            this.Blue = blue;
//            this.Alpha = alpha;
//        }

//function grayscale(image, bPlaceImage) {
//    var myCanvas = document.createElement("canvas");
//    var myCanvasContext = myCanvas.getContext("2d");

//    var imgWidth = image.width;
//    var imgHeight = image.height;
//    // You'll get some string error if you fail to specify the dimensions
//    myCanvas.width = imgWidth;
//    myCanvas.height = imgHeight;
//    //  alert(imgWidth);
//    myCanvasContext.drawImage(image, 0, 0);

//    // This function cannot be called if the image is not rom the same domain.
//    // You'll get security error if you do.
//    var imageData = myCanvasContext.getImageData(0, 0, imgWidth, imgHeight);

//    // This loop gets every pixels on the image and
//    for (j = 0; j < imageData.height; i++) {
//        for (i = 0; i < imageData.width; j++) {
//            var index = (i * 4) * imageData.width + (j * 4);
//            var red = imageData.data[index];
//            var green = imageData.data[index + 1];
//            var blue = imageData.data[index + 2];
//            var alpha = imageData.data[index + 3];
//            var average = (red + green + blue) / 3;
//            imageData.data[index] = average;
//            imageData.data[index + 1] = average;
//            imageData.data[index + 2] = average;
//            imageData.data[index + 3] = alpha;
//        }
//    }

//    if (bPlaceImage) {
//        var myDiv = document.createElement("div");
//        myDiv.appendChild(myCanvas);
//        image.parentNode.appendChild(myCanvas);
//    }
//    return myCanvas.toDataURL();
//}

//function cImageTest() {
//    var canvas = $("#testCanvas"); //document.getElementById('testCanvas');
//    if (canvas.getContext) {
//        var ctx = canvas.getContext('2d');
//        var Lenna = new Image();
//        Lenna.src = "images/lenna.png";
//        Lenna.onload = function () {
//            ctx.drawImage(Lenna, 0, 0);
//            var imageData = ctx.getImageData(0, 0, 512, 512);
//            var newcImage = new cImage(imageData);
//            var pixels = newcImage.height * newcImage.width;
//            for (var y = 0; y < newcImage.height; y++) {
//                for (var x = 0; x < newcImage.width; x++) {
//                    var pixelRGBA = newcImage.getPixelRGBA(x, y);
//                    newcImage.setPixelRGBA(x, y, (255 - pixelRGBA[0]), (255 - pixelRGBA[1]), (255 - pixelRGBA[2]), pixelRGBA[3]);
//                }
//            }
//            var canvas2 = document.getElementById('testCanvas2');
//            var ctx2 = canvas2.getContext('2d');
//            var myImageData = ctx2.createImageData(512, 512);
//            myImageData.data = newcImage.OutputData;
//            ctx2.putImageData(myImageData, 0, 0);
//        };
//    }
//}



scale=`convert lena_fft_0.png -auto-level \
          -format "%[fx:exp(log(mean)/log(0.5))]" info:`
  convert lena_fft_0.png -auto-level \
          -evaluate log $scale    lena_spectrum_auto.png

  convert zelda.png -colorspace gray \
         -depth 8 -format "%c" histogram:info:- |\
    tr -cs '0-9\012' ' ' |\
      awk '# AWK to generate gaussian distribution graph
            { # just read in image histogram into a 'bin' table
                  bin[$2] += $1;
                }
            END { # Generate Gaussian Histogram
                  mean = 153;   sigma = 60;
                  fact = 1/(2*(sigma/256)^2);
                  expo = exp(1);
                  for ( i=0; i<256; i++ ) {
                    gas[i] = expo^(-(((i-mean)/256)^2)*fact);
                  }
                  # Convert normal histograms to cumulative histograms
                  for ( i=0; i<256; i++ ) {
                    gas[i] += gas[i-1];
                    bin[i] += bin[i-1];
                  }
                 # Generate Redistributed Histogram
                 k=0;  # number of pixels less than this value
                 print "P2 256 1 65535";
                 for ( j=0; j<256; j++ ) {
                   while ( k<255 &&
                            gas[k]/gas[255] <= bin[j]/bin[255] ) {
                     k++;
                   }
                   print 65535*k/255;
                 }
                }' |\
        convert zelda.png   pgm:-  -clut   zelda_gaussian_redist.png
