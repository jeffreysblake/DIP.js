/*
----------Start Test Pbject Notes----------
create test object
define test object members: 
- Div to write results to
- Number Of Times to loop
- display total time or average time
- eventually add john resig's stuff for big o notation analysis of code
----------End Test Pbject Notes----------
*/
//start test object
function Tester() {
    // Global variables Start
    this.ResultsDiv;
    this.NumberOfTimesToRun;
    this.IndividualTimes = [];
    this.TotalRunTime = 0;
    // Global variables End
}

Tester.prototype = {
    testFunc: function TestFunction(callBackFunction) {
        var ReportDivElement;
        this.IndividualTimes = [];
        this.TotalRunTime = 0;
        if (this.ResultsDiv) {
            ReportDivElement = document.getElementById(this.ResultsDiv);
            if (this.NumberOfTimesToRun) {
                for (var counter = 0; counter < this.NumberOfTimesToRun; counter++) {
                    var date1 = new Date();
                    var milliseconds1 = date1.getTime();
                    callBackFunction();
                    var date2 = new Date();
                    var milliseconds2 = date2.getTime();
                    var difference = milliseconds2 - milliseconds1;
                    this.IndividualTimes[this.IndividualTimes.length] = difference;
                    this.TotalRunTime += difference;
                }
                var IndRunTimesCount = this.IndividualTimes.length;
                while (IndRunTimesCount--) {
                    ReportDivElement.innerHTML = 'run time for iteration ' + IndRunTimesCount + ': '
                    + this.IndividualTimes[IndRunTimesCount] + " <br />" + ReportDivElement.innerHTML;
                }
                var AverageTime = this.TotalRunTime / this.NumberOfTimesToRun;
                ReportDivElement.innerHTML = 'Average run time: ' + AverageTime + " <br />" + ReportDivElement.innerHTML;
            }
        }
    }

}
//end test object

//var frag = document.createElement('table');
//frag.innerHTML = tableInnerHtml;
//$("#mydiv").appendChild(frag);

function StringBuffer() {
    this.buffer = [];
    this.teststriing;
}
StringBuffer.prototype.append = function append(string) {
    this.buffer.push(string);
    return this;
};
StringBuffer.prototype.toString = function toString() {
    return this.buffer.join('');
};
StringBuffer.prototype.alertString = function alertString() {
    alert(this.teststriing);
};

function SkynetSearch() {
    // Global variables Start
    this.displayWidth;
    this.targetTextbox;
    this.timer;
    this.JsonObj;
    this.ResultsRowArr = [];
    //side didn't paste these fields in, but I'm guessing they're essential
    this.wordCount;
    this.preparedString;
    this.maxWordLength = 20;
    // Global variables End
}

SkynetSearch.prototype = {
    testFunc: function(value) {
        alert(value);
        alert(this.targetTextbox);
    },

    CaseInsensitiveSearch: function(StringToSearch, searchString) {
        return StringToSearch.toLowerCase().indexOf(searchString);
    },

    indexOfArr: function(tempArray, searchString) {
        var countIndex = tempArray.length;
        while (countIndex--) {
            var StringToSearch = tempArray[countIndex];
            if (this.CaseInsensitiveSearch(StringToSearch, searchString) >= 0) {
                return countIndex;
            }
        }
        return -1;
    },

    testIndexOfArr: function(tempArray, searchString) {
        //var arr2str = tempArray.toString();  //Converting the String content to String
        //var IndexOfToken = arr2str.search(searchString);
        //return IndexOfToken;
        return tempArray.toString().search(searchString);
    },

    //Add delay so that it only searches 3/10ths of a second after the user stops typing
    keyPressed: function(value) {
        window.clearTimeout(this.timer);
        this.matchFields(value);
        //this.timer = window.setTimeout(new function() { this.matchFields(value) }, 300);
    },

    //this is where the magic happens!
    matchFieldsOld: function(searchText) {
        if (typeof this.JsonObj !== 'undefined') {
            if (searchText.length === 0) {
                return;
            }
            var searchArr = searchText.split(" ");
            var keywordCount = 0;

            var SearchIndex = searchArr.length;
            while (SearchIndex--) {
                if (searchArr[SearchIndex].length > 0) {
                    searchArr[SearchIndex] = searchArr[SearchIndex].toLowerCase();
                    keywordCount += 1;
                }
            }

            var rowCount = 0;
            var count = this.JsonObj.rows.length;
            var OverallMatchCount = 0;

            var alertedOnce = false;
            //alert('keywordCount: ' + keywordCount);
            while (count--) {
                var rowObj = this.JsonObj.rows[count];
                var KeywordIndex = keywordCount;
                var RowHitCount = 0;
                while (KeywordIndex--) {
                    //if (this.indexOfArr(rowObj, searchArr[KeywordIndex]) >= 0) {
                    if (this.testIndexOfArr(rowObj, searchArr[KeywordIndex]) >= 0) {
                        RowHitCount += 1;
                        if (RowHitCount == keywordCount) {
                            this.ResultsRowArr[OverallMatchCount] = rowObj;
                            OverallMatchCount += 1;
                            break;
                        }
                    }
                }
            }
            return this.ResultsRowArr; //.length;
        }
    },

    prepareString: function() {
        count = 0;
        var sb = new StringBuffer();
        var stringSampleCount = 0;
        var stringSample = '';
        for (var r = 0; r < this.JsonObj.rows.length; r++) {
            var row = this.JsonObj.rows[r];
            stringSample = '';
            for (var c = 0; c < row.length; c++) {
                sb.append(row[c].toLowerCase() + '                    \n'.substring(0, this.maxWordLength - row[c].length));
                stringSample = stringSample + row[c].toLowerCase() + '                    \n'.substring(0,
                this.maxWordLength - row[c].length);
                count++;
            }
        }
        this.wordCount = count;
        this.preparedString = sb.toString();
    },

    matchFields: function(searchText) {
        if (searchText.length === 0) {
            return 0;
        }
        var searchArr = searchText.split(' ');
        var regArr = [];
        for (var i = 0; i < searchArr.length; i++) {
            if (searchArr[i]) {
                regArr.push(searchArr[i].toLowerCase());
            }
        }
        var count = this.wordCount;
        var s = this.preparedString;
        var index = 0;
        var finds = [];
        var blahcounter = 0;
        while (index < count && index >= 0) {
            for (var i = 0; i < regArr.length; i++) {
                reg = regArr[i];
                var match = s.indexOf(reg, index * this.maxWordLength);
                if (match < 0) {
                    index = -1;
                    break;
                }
                match = parseInt(match / this.maxWordLength);
                if (index != match) {
                    index = match;
                    if (i > 0) break;
                }
                if (i == regArr.length - 1) {
                    finds.push(parseInt(index / 8));
                    index++;
                }
            }
        }
        return finds;
    }
}

//end of object
