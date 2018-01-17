function dipCanvas() {
    this.WorkingCanvas;
    //this.History = [];
    this.Context;
    this.image = new Image();
}

dipCanvas.prototype = {
    CreateNewCanvasElement: function (id, w, h, ContainerId) {
        //maybe check if the id exists? if so, remove it and start fresh...
        //console.log('can el exists? ' + $("#" + id).length);
        if ($("#" + id).length > 0) {
            this.WorkingCanvas = $("#" + id)[0];
            this.Context = this.WorkingCanvas.getContext("2d");
            this.WorkingCanvas.width = w;
            this.WorkingCanvas.height = h;
            this.Context.createImageData(w, h);
        }
        else {
            //document.removeChild(myCanvas);
            this.WorkingCanvas = document.createElement("canvas");
            this.Context = this.WorkingCanvas.getContext("2d");
            this.WorkingCanvas.setAttribute('id', id);
            if (ContainerId !== undefined) {
                $(ContainerId).append(this.WorkingCanvas);
            }
            else {
                $("#dipCanvas").append(this.WorkingCanvas);
            }
            //document.body.appendChild(this.WorkingCanvas);
            this.WorkingCanvas.width = w;
            this.WorkingCanvas.height = h;
            this.Context.createImageData(w, h);
            //this.ImageData = this.Context.createImageData(w, h).data;
        }
    },

    Init: function (imgSrc, id, func) {

        this.WorkingCanvas = document.createElement("canvas");
        this.Context = this.WorkingCanvas.getContext("2d");
        this.WorkingCanvas.setAttribute('id', id);
        //document.body.appendChild(this.WorkingCanvas);
        $("#dipCanvas").append(this.WorkingCanvas);
        this.image.src = imgSrc;
        this.image.onload = this.Load(func);
    },

    AssignCanvasElement: function (id) {
        if ($("#" + id).length > 0) {
            this.WorkingCanvas = $("#" + id)[0];
            this.Context = this.WorkingCanvas.getContext("2d");
            this.WorkingCanvas.width = w;
            this.WorkingCanvas.height = h;
            this.Context.createImageData(w, h);
        }
    },
    //remove maybe
    InitBlankCanvas: function (imgSrc, func) {
        this.WorkingCanvas = document.createElement("canvas");
        this.Context = this.WorkingCanvas.getContext("2d");
        document.body.appendChild(this.WorkingCanvas);
        this.image.src = imgSrc;
        this.image.onload = this.Load(func);
        this.ImageData = this.Context.createImageData(this.Canvas.width, this.Canvas.height).data;

    },
    //remove maybe
    InitWithImgData: function (imgSrc, func) {
        this.WorkingCanvas = document.createElement("canvas");
        this.Context = this.WorkingCanvas.getContext("2d");
        document.body.appendChild(this.WorkingCanvas);
        this.image.src = imgSrc;
        this.image.onload = this.Load(func);
        this.ImageData = this.Context.createImageData(this.Canvas.width, this.Canvas.height).data;

    },

    Load: function (func) {
        if (this.image.complete) {
            if (this.WorkingCanvas.getContext) {
                this.WorkingCanvas.width = this.image.width;
                this.WorkingCanvas.height = this.image.height;

                this.Context = this.WorkingCanvas.getContext('2d');
                if (this.WorkingCanvas.getContext) {
                    if (this.image != undefined) {
                        this.Context.drawImage(this.image, 0, 0);
                    }
                }
                func();
            }
        }
        else {
            var that = this;
            setTimeout(function () { that.Load(func) }, 300);
        }
    },

    //    LoadFromImage: function (image) {
    //        this.Context = this.Canvas.getContext('2d');
    //        if (this.Canvas.getContext) {
    //            this.Context.drawImage(image, 0, 0);
    //            this.ImageData = this.Context.getImageData(0, 0, this.Canvas.width, this.Canvas.height).data;
    //        }
    //    },

    DrawPolygon: function (fillStyle, x1, y1, x2, y2, x3, y3, x4, y4, strokeStyle, strokeWidth, lccount) {
        try {
            this.Context.fillStyle = fillStyle; // '#f00';
            this.Context.beginPath();
            this.Context.moveTo(x1, y1);
            this.Context.lineTo(x2, y2);
            this.Context.lineTo(x3, y3);
            this.Context.lineTo(x4, y4);
            this.Context.strokeStyle = strokeStyle; // red
            this.Context.lineWidth = strokeWidth;
            this.Context.stroke();
            this.Context.closePath();
            this.Context.fill();
        }
        catch (err) {
            if (lccount == 0) {
                console.log('x1 ' + x1 + 'y1 ' + y1 + 'x2 ' + x2 + 'y2 ' + y2 +
                'x3 ' + x3 + 'y3 ' + y3 + 'x4 ' + x4 + 'y4 ' + y4 + '  err' + err);
            }
        }
    },

    testDraw: function (DestinationCanvas, dStartX, dStartY, dEndX, dEndY, displaymsg, drawDest) {
        if (this.savedImage.complete) {
            var w = this.Canvas.width * (-1);
            var h = this.Canvas.height * (-1);
            this.Context.rotate(180 * Math.PI / 180);
            this.Context.drawImage(this.savedImage, w, h);
            this.ImageData = this.Context.getImageData(0, 0, this.Canvas.width, this.Canvas.height).data;
            console.log('updated image data  ' + displaymsg);
            this.CopyCanvasSection(DestinationCanvas, 0, 0, 128, 128, dStartX, dStartY, dEndX, dEndY);
            //this.Draw();
            //this.Canvas.height = this.Canvas.height;
            this.Canvas.width = this.Canvas.width;
            this.Load();
            if (this.ProcessCount < 4) {
                this.ProcessCount += 1;
                this.Createfft(DestinationCanvas, this.ProcessCount);
            }
            if (drawDest == true) {
                DestinationCanvas.Canvas.width = DestinationCanvas.Canvas.width;
                DestinationCanvas.Draw();
            }
        }
        else {
            var that = this;
            setTimeout(function () { that.testDraw(DestinationCanvas, dStartX, dStartY, dEndX, dEndY, true, drawDest) }, 300);
        }
    },

    Draw: function (source) {
        var img = this.Context.createImageData(this.WorkingCanvas.width, this.WorkingCanvas.height);
        var i = 0;
        for (var y = 0; y < this.WorkingCanvas.height; y++) {
            for (var x = 0; x < this.WorkingCanvas.width; x++) {
                img.data[i] = source.RedChannel.Data[y][x];     //r
                img.data[i + 1] = source.GreenChannel.Data[y][x]; //g
                img.data[i + 2] = source.BlueChannel.Data[y][x]; //b
                img.data[i + 3] = source.AlphaChannel.Data[y][x]; //a
                i += 4;
            }
        }
        //console.log(img.data);        
        this.WorkingCanvas.width = this.WorkingCanvas.width;
        this.Context.putImageData(img, 0, 0);
        //source = this.Context.getImageData(0, 0, this.WorkingCanvas.width, this.WorkingCanvas.height).data;
    }
}