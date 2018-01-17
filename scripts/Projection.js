
//This code has been ported from c# to javascript from the following project:
//https://www.codeproject.com/Articles/17715/WebControls/

function PointF(x, y)
{
    this.x = x;
    this.y = y;
}

function Point3D(x, y, z)
{
    this.x = x;
    this.y = y;
    this.z = z;
}

function Projection() {
    this.Source = new dipImage();
    //this.GrayScale = new dipImage();
    this.Destination = new dipImage();
    this.width = 0;
    this.height = 0;
    //*************new vars***************
    this.screenDistance;
    this.sf; 
    this.cf; 
    this.st; 
    this.ct; 
    this.R; 
    this.A; 
    this.B; 
    this.C; 
    this.D;
    this.density = 0.5;
    penColor = "black";
    this.startPoint = new PointF(-20, -20);
    this.endPoint = new PointF(20, 20);

    this.ColorSchema = { "Autumn": [[0, 0, 255], [0, 4, 255], [0, 8, 255],
        [0, 12, 255], [0, 16, 255], [0, 20, 255], [0, 24, 255], [0, 28, 255],
        [0, 32, 255], [0, 36, 255], [0, 40, 255], [0, 45, 255], [0, 49, 255],
        [0, 53, 255], [0, 57, 255], [0, 61, 255], [0, 65, 255], [0, 69, 255],
        [0, 73, 255], [0, 77, 255], [0, 81, 255], [0, 85, 255], [0, 89, 255],
        [0, 93, 255], [0, 97, 255], [0, 101, 255], [0, 105, 255], [0, 109, 255],
        [0, 113, 255], [0, 117, 255], [0, 121, 255], [0, 125, 255], [0, 130, 255],
        [0, 134, 255], [0, 138, 255], [0, 142, 255], [0, 146, 255], [0, 150, 255],
        [0, 154, 255], [0, 158, 255], [0, 162, 255], [0, 166, 255], [0, 170, 255],
        [0, 174, 255], [0, 178, 255], [0, 182, 255], [0, 186, 255], [0, 190, 255],
        [0, 194, 255], [0, 198, 255], [0, 202, 255], [0, 206, 255], [0, 210, 255],
        [0, 215, 255], [0, 219, 255], [0, 223, 255], [0, 227, 255], [0, 231, 255],
        [0, 235, 255], [0, 239, 255], [0, 243, 255], [0, 247, 255], [0, 251, 255],
        [0, 255, 255]]
    };
        
    //RendererFunction function = defaultFunction;
    //ColorSchema colorSchema = ColorSchema.Autumn;
    //*************new vars***************

    //***************orig source vars*******************
    //double screenDistance, sf, cf, st, ct, R, A, B, C, D; //transformations coeficients
    //double density = 0.5f;
    //Color penColor = Color.Black;
    //PointF startPoint = new PointF(-20, -20);
    //PointF endPoint = new PointF(20, 20);
    //RendererFunction function = defaultFunction;
    //ColorSchema colorSchema = ColorSchema.Autumn;
    //***************orig source vars*******************
}

Projection.prototype = {
    Init: function (imgSrc) {
        this.Source.Load(imgSrc);
        //$('#default').toggle();
    },

    InitFromExistingDipImage: function (dipImg) {
        var clonedDipImg = jQuery.extend(true, {}, dipImg);
        this.Source = clonedDipImg;
    },

    applyProjection: function (obsx, obsy, obsz) {
        if (this.Source.width == undefined) {
            alert('image not yet loaded, please be patient');
            return;
        }

        this.width = this.Source.width;
        this.height = this.Source.height;

        if (this.width == 0) this.width = 256;
        if (this.height == 0) this.height = 256;

        this.Destination = new dipImage();
        this.Destination.width = this.width;
        this.Destination.height = this.height;
        this.Destination.dipcan.CreateNewCanvasElement('dest', this.width, this.height);
        var ImageData = this.Destination.dipcan.Context.getImageData(0, 0, this.width, this.height).data;
        this.Destination.PopulateImageData(ImageData);

        // obsX - Observator's X position, obsY - Observator's Y position, obsZ - Observator's Z position
        // xs0 - X coordinate of screen, ys0 - Y coordinate of screen, screenWidth - Drawing area width in pixels.
        // screenHeight - Drawing area height in pixels., screenDistance - The screen distance.
        // screenWidthPhys - Width of the screen in meters., screenHeightPhys - Height of the screen in meters.
        this.ReCalculateTransformationsCoeficients(obsx, obsy, obsz, 0, 0, this.width, this.height, 0.5, 0.5, 0.5);
        this.RenderSurface();
        //        for (var y = 0; y < this.height; y++) {
        //            for (var x = 0; x < this.width; x++) {
        //                var pixelRGBA;

        //                if (rowIndex >= 0 && rowIndex < this.height && colIndex >= 0 && colIndex < this.width) {
        //                    pixelRGBA = this.Source.getPixelRGBA(colIndex, rowIndex);
        //                    rsum += pixelRGBA[0] * Filter[krow + 1][kcol + 1];
        //                    gsum += pixelRGBA[1] * Filter[krow + 1][kcol + 1];
        //                    bsum += pixelRGBA[2] * Filter[krow + 1][kcol + 1];
        //                    pixcount += 1;
        //                }

        //                this.Destination.setPixelRGBA(x, y, (rsum), (gsum), (bsum), pixelRGBA[3]);
        //            }
        //        }
        //        this.Destination.dipcan.Draw(this.Destination);
    },

    // Initializes a new instance of the <see cref="Surface3DRenderer"/> class. 
    //Calculates transformations coeficients.
    // obsX - Observator's X position
    // obsY - Observator's Y position
    // obsZ - Observator's Z position
    // xs0 - X coordinate of screen
    // ys0 - Y coordinate of screen
    // screenWidth - Drawing area width in pixels.
    // screenHeight - Drawing area height in pixels.
    // screenDistance - The screen distance.
    // screenWidthPhys - Width of the screen in meters.
    // screenHeightPhys - Height of the screen in meters.
    ReCalculateTransformationsCoeficients: function (obsX, obsY, obsZ, xs0, ys0,
         screenWidth, screenHeight, screenDistance, screenWidthPhys, screenHeightPhys) {
        var r1, a;

        if (screenWidthPhys <= 0)//when screen dimensions are not specified
            screenWidthPhys = screenWidth * 0.0257 / 72.0; //0.0257 m = 1 inch. Screen has 72 px/inch
        if (screenHeightPhys <= 0)
            screenHeightPhys = screenHeight * 0.0257 / 72.0;

        r1 = obsX * obsX + obsY * obsY;
        a = Math.sqrt(r1); //distance in XY plane
        this.R = Math.sqrt(r1 + obsZ * obsZ); //distance from observator to center
        if (a != 0) //rotation matrix coeficients calculation
        {
            this.sf = obsY / a; //sin( fi)
            this.cf = obsX / a; //cos( fi)
        }
        else {
            this.sf = 0;
            this.cf = 1;
        }
        this.st = a / this.R; //sin( teta)
        this.ct = obsZ / this.R; //cos( teta)

        //linear tranfrormation coeficients
        this.A = screenWidth / screenWidthPhys;
        this.B = xs0 + this.A * screenWidthPhys / 2.0;
        this.C = -screenHeight / screenHeightPhys;
        this.D = ys0 - this.C * screenHeightPhys / 2.0;

        this.screenDistance = screenDistance;
    },

    /// Performs projection. Calculates screen coordinates for 3D point.
    /// x Point's x coordinate
    /// y Point's y coordinate
    /// z Point's z coordinate
    /// returns Point in 2D space of the screen.
    Project: function (x, y, z) {
        //PointF 
        var xn;
        var yn;
        var zn; //point coordinates in computer's frame of reference

        //transformations
        xn = -this.sf * x + this.cf * y;
        yn = -this.cf * this.ct * x - this.sf * this.ct * y + this.st * z;
        zn = -this.cf * this.st * x - this.sf * this.st * y - this.ct * z + this.R;

        if (zn == 0) zn = 0.01;
        //Tales' theorem
        return new PointF(
            (this.A * xn * this.screenDistance / zn + this.B),
            (this.C * yn * this.screenDistance / zn + this.D));
    },

    RenderSurface: function () //(graphics) //Graphics
    {
        //SolidBrush[] brushes = new SolidBrush[colorSchema.Length];
        //for (int i = 0; i < brushes.Length; i++)
        //    brushes[i] = new SolidBrush(colorSchema[i]);
        var utils = new DIPUtils();
        //this.Data = utils.initArray2d(this.height, this.width, 0);       
        var z1;
        var z2;
        var polygon = [];
        polygon[0] = new PointF(0, 0);
        polygon[1] = new PointF(0, 0);
        polygon[2] = new PointF(0, 0);
        polygon[3] = new PointF(0, 0);

        //PointF[] polygon = new PointF[4];

        var xi = -20.0; //startPoint.X;
        var yi = 0.0;
        var minZ = Number.POSITIVE_INFINITY;
        var maxZ = Number.NEGATIVE_INFINITY;
        //20 -- 20 / 1.5, 20--20 / 1.5
        var mesh = utils.initArray2d(256, 256, 0.0);
        var meshF = utils.initArray2d(256, 256, 0.0);
        this.screenDistance = 0.2;
        this.density = 0.3;
        //new double[((endPoint.X - startPoint.X) / density + 1), 
        //(int)((endPoint.Y - startPoint.Y) / density + 1)];
        //PointF[] meshF = new PointF[mesh.GetLength(0), mesh.GetLength(1)];

        //var kCenterX = Math.ceil(GaussianFilter[0].length / 2)
        //var kCenterY = Math.ceil(GaussianFilter.length / 2)
        var meshRows = mesh.length;
        var meshCols = mesh[0].length;
        //console.log('mr: ' + meshRows);
        //console.log('mc: ' + meshCols);
        var lcount = 0;

        var pixelRGBA;

        for (x = 0; x < meshCols; x++) {
            yi = -20;
            for (y = 0; y < meshRows; y++) {

                pixelRGBA = this.Source.getPixelRGBA(x, y);
                var zz = (pixelRGBA[0] + pixelRGBA[1] + pixelRGBA[2]) / 3;
                zz = (zz - 128) / 25;
                
                //var zz = Math.sin(xi) + Math.cos(yi); //Math.random(); //test function is : Math.sin(xi) + Math.cos(yi)
                //if (x < 5 && y < 5) console.log(zz);

                mesh[y][x] = zz;
                meshF[y][x] = this.Project(xi, yi, zz);

                yi += this.density;

                if (minZ > zz) minZ = zz;
                if (maxZ < zz) maxZ = zz;
            }
            xi += this.density;
        }

        var cc = (maxZ - minZ) / (99);
        var blahcount = 0;

        for (var x = 0; x < meshCols - 1; x++) {
            for (var y = 0; y < meshRows - 1; y++) {
                z1 = mesh[y][x];
                z2 = mesh[y + 1][x];

                polygon[0] = meshF[y][x];
                polygon[1] = meshF[y + 1][x];
                polygon[2] = meshF[y + 1][x + 1];
                polygon[3] = meshF[y][x + 1];

                var colorIndex = Math.round((((z1 + z2) / 2.0 - minZ) / cc));
                //int blahcolorindex = (int)(((z1 + z2) / 2.0 - minZ) / cc);
                //string blahcolor = brushes[(int)(((z1 + z2) / 2.0 - minZ) / cc)].Color.ToString();
                //if (colorIndex < 0) colorIndex = colorIndex * -1;
                if (colorIndex < 0 || isNaN(colorIndex)) colorIndex = 0;
                if (colorIndex > 62) colorIndex = 63;
                //ctx.fillStyle = "rgb(200,0,0)";  

                if (blahcount > 140 && blahcount < 160) {
                    //console.log('z1 : ' + z1 + ' z2' + z2 + ' min z: ' + minZ + ' cc ' + cc);
                    //console.log('cs length : ' + colorIndex);
                    //console.log('mesh f : ' + meshF[y][x].y);
                    //console.log('rgb(' + this.ColorSchema.Autumn[colorIndex][0] + ',' + this.ColorSchema.Autumn[colorIndex][1] + ',' + this.ColorSchema.Autumn[colorIndex][2] + ')');
                }

                var colorblah = 'rgb(' + this.ColorSchema.Autumn[colorIndex][0] + ',' +
                this.ColorSchema.Autumn[colorIndex][1] + ',' +
                this.ColorSchema.Autumn[colorIndex][2] + ')';
                this.Destination.dipcan.DrawPolygon(colorblah, Math.floor(polygon[0].x),
                Math.floor(polygon[0].y),
                Math.floor(polygon[1].x), Math.floor(polygon[1].y),
                Math.floor(polygon[2].x), Math.floor(polygon[2].y),
                Math.floor(polygon[3].x), Math.floor(polygon[3].y),
                "#000000", 0.5,
                blahcount);
                blahcount += 1;
            }
        }
        //console.log('polygon[0]: ' + polygon[0].x);
    }
}