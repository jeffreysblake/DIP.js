function DIPUtils() {
}

DIPUtils.prototype = {
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

    initArray2d: function (arrayLength, array2dLength, default2dValue) {
        var arr = [];
        for (var i = 0; i < arrayLength; i++) {
            var arr2d = [];
            for (var j = 0; j < array2dLength; j++) {
                arr2d[j] = default2dValue;
            }
            arr[i] = arr2d;
        }
        return arr;
    },

    DoDuff: function (Func, Arr, alertFunc) {
        var iterations = Math.floor(Arr.length / 8);
        var leftover = Arr.length % 8;
        var i = 0;

        if (leftover > 0) {
            do {
                Func(Arr[i++]);
            } while (--leftover > 0);
        }

        do {
            Func(Arr[i++]);
            Func(Arr[i++]);
            Func(Arr[i++]);
            Func(Arr[i++]);
            Func(Arr[i++]);
            Func(Arr[i++]);
            Func(Arr[i++]);
            Func(Arr[i++]);
            alertFunc(i);
        } while (--iterations > 0);
    },

    //μ =(x0 + x1 + x2 + ... + xN-1)/N
    GetMean: function (tempArray) {
        var countIndex = tempArray.length;
        var Sum = 0;
        while (countIndex--) {
            Sum += tempArray[countIndex];
        }
        return Sum / countIndex;
    },
    //sigma = sqrt((x0 -μ)2 + (x1 -μ)2 + ... + (xN-1 -μ)2 / (N-1))
    GetStandardDeviation: function (tempArray, Mean) {
        var countIndex = tempArray.length;
        var Sum = 0;
        while (countIndex--) {
            Sum += Math.pow(tempArray[countIndex] - Mean, 2);
        }
        return Math.sqrt(Sum / (countIndex - 1));
    }
}