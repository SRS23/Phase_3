/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.7763042262523, "KoPercent": 0.22369577374770314};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.17624031317408326, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://blazedemo.com/"], "isController": false}, {"data": [0.06930693069306931, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.53, 500, 1500, "https://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [0.18811881188118812, 500, 1500, "https://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [0.2524752475247525, 500, 1500, "https://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [0.6655555555555556, 500, 1500, "https://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://blazedemo.com/home-2"], "isController": false}, {"data": [0.6566666666666666, 500, 1500, "https://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/home-3"], "isController": false}, {"data": [0.6877777777777778, 500, 1500, "https://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/home-0"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [0.25, 500, 1500, "https://blazedemo.com/home-1"], "isController": false}, {"data": [0.6266666666666667, 500, 1500, "https://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [0.25742574257425743, 500, 1500, "https://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [0.35148514851485146, 500, 1500, "https://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [0.24752475247524752, 500, 1500, "https://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.15841584158415842, 500, 1500, "https://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.26600441501103755, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.022375915378356388, 500, 1500, "https://blazedemo.com/-5"], "isController": false}, {"data": [0.008136696501220505, 500, 1500, "https://blazedemo.com/-4"], "isController": false}, {"data": [0.024410089503661515, 500, 1500, "https://blazedemo.com/-3"], "isController": false}, {"data": [0.06997558991049634, 500, 1500, "https://blazedemo.com/-2"], "isController": false}, {"data": [0.005695687550854353, 500, 1500, "https://blazedemo.com/-1"], "isController": false}, {"data": [0.014239218877135883, 500, 1500, "https://blazedemo.com/-0"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://blazedemo.com/confirmation.php-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://blazedemo.com/home"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12517, 28, 0.22369577374770314, 40919.114963649576, 57, 385373, 23716.0, 89534.40000000002, 115351.19999999958, 164013.43999999997, 32.30101855173143, 1813.4807987708734, 46.608694555606164], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/", 1234, 15, 1.2155591572123177, 113575.96272285243, 11609, 385373, 112518.0, 160414.0, 174256.5, 181204.55000000005, 3.184425732430821, 890.5583763872187, 16.300026200869137], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 101, 0, 0.0, 72656.25742574259, 768, 123235, 87428.0, 108840.79999999999, 112469.39999999998, 123223.06, 0.7180639290183142, 5.385146207769309, 3.329953430266039], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-0", 450, 0, 0.0, 13333.097777777775, 393, 94088, 620.0, 66779.5, 79601.24999999999, 89335.31, 2.8089010954714273, 20.15880288146437, 2.1958803759245966], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 101, 0, 0.0, 24343.623762376243, 302, 88787, 17751.0, 65831.4, 84879.3, 88727.66000000002, 0.7226932846767558, 0.12350715314300026, 0.561746169636149], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 101, 0, 0.0, 20948.17821782178, 295, 88793, 8707.0, 62123.19999999997, 80125.99999999997, 88733.92000000001, 0.7227036271135503, 0.12492045117099455, 0.5617542087647492], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 450, 0, 0.0, 7364.266666666666, 296, 86705, 340.5, 25418.4, 51119.34999999999, 85295.39, 2.8090062984163446, 1.9206580565421756, 2.3299390523661194], "isController": false}, {"data": ["https://blazedemo.com/home-2", 1, 0, 0.0, 24936.0, 24936, 24936, 24936.0, 24936.0, 24936.0, 24936.0, 0.04010266281681103, 4.786707095163619, 0.09708447375280718], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 450, 0, 0.0, 7715.57777777778, 296, 86994, 342.5, 26435.8, 50628.45, 86214.43, 2.8090589028440163, 5.115766876981947, 2.329946108985243], "isController": false}, {"data": ["https://blazedemo.com/home-3", 1, 0, 0.0, 975.0, 975, 975, 975.0, 975.0, 975.0, 975.0, 1.0256410256410255, 295.0510817307692, 1.5805288461538463], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-1", 450, 0, 0.0, 4256.72888888889, 57, 24206, 101.0, 21905.2, 22644.45, 23554.49, 2.8144701290903633, 2.249261250453442, 2.281773022365656], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 6, 0, 0.0, 60140.0, 1143, 94162, 86446.5, 94162.0, 94162.0, 94162.0, 0.054078413699864804, 0.3561658545515998, 0.26421318724650744], "isController": false}, {"data": ["https://blazedemo.com/home-0", 2, 0, 0.0, 780.5, 709, 852, 780.5, 852.0, 852.0, 852.0, 0.9191176470588235, 52.94261259191176, 1.097735236672794], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 450, 0, 0.0, 5226.17111111111, 296, 86496, 338.5, 16426.700000000015, 43707.19999999997, 85797.12000000001, 2.8089887640449436, 1.1851884363295881, 2.3254988881086143], "isController": false}, {"data": ["https://blazedemo.com/home-1", 2, 0, 0.0, 11858.5, 597, 23120, 11858.5, 23120.0, 23120.0, 23120.0, 0.07832386919913843, 0.44011283532406503, 0.09434813736048561], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 450, 0, 0.0, 9074.32222222222, 298, 86494, 353.0, 30410.800000000032, 51570.45, 86044.3, 2.8092342651667437, 0.5987302456207159, 2.330689011524103], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 101, 0, 0.0, 19454.386138613867, 297, 85836, 8193.0, 58661.99999999998, 83063.29999999984, 85833.04, 0.7226881135693637, 0.12421201951973439, 0.5617421501581328], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 101, 0, 0.0, 15784.217821782175, 295, 88771, 2691.0, 56175.19999999998, 72137.39999999994, 88716.94000000002, 0.7204508167486982, 0.12382748412868251, 0.558595979117626], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-1", 101, 0, 0.0, 12396.831683168317, 60, 24285, 16609.0, 22935.4, 23657.1, 24279.56, 0.7351549648435795, 0.18703717309260043, 0.5570740809653094], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-0", 101, 0, 0.0, 44246.0495049505, 428, 90352, 46007.0, 86753.8, 88058.1, 90330.38, 0.7411864854551324, 4.860417236163296, 0.5725017749948631], "isController": false}, {"data": ["https://blazedemo.com/reserve.php", 453, 3, 0.6622516556291391, 26236.251655629145, 713, 148255, 1170.0, 85169.0, 88696.59999999998, 112293.81999999989, 2.7683564029700247, 30.624560760228558, 13.499616620069057], "isController": false}, {"data": ["https://blazedemo.com/-5", 1229, 2, 0.16273393002441008, 46826.023596419815, 395, 93479, 47914.0, 85712.0, 87207.0, 88465.6, 6.395212696760765, 25.38695098055158, 5.493177401782229], "isController": false}, {"data": ["https://blazedemo.com/-4", 1229, 4, 0.32546786004882017, 48184.107404393784, 635, 262351, 48365.0, 87667.0, 91594.5, 94795.7, 4.6649332903152345, 575.661025186939, 3.991338505389915], "isController": false}, {"data": ["https://blazedemo.com/-3", 1229, 3, 0.24410089503661514, 44105.77054515868, 443, 104635, 45711.0, 86412.0, 89449.5, 93431.60000000002, 6.38697037256461, 245.74210771971127, 5.475404447493283], "isController": false}, {"data": ["https://blazedemo.com/-2", 1229, 1, 0.08136696501220504, 38311.8974776241, 395, 98389, 29526.0, 85815.0, 89403.0, 94301.90000000001, 6.386937180393298, 180.63173439578742, 5.471843753897643], "isController": false}, {"data": ["https://blazedemo.com/-1", 1229, 0, 0.0, 22218.469487388116, 394, 383216, 21877.0, 23697.0, 24245.5, 126101.50000000001, 3.202272075874827, 262.62925159266786, 2.8051152852145704], "isController": false}, {"data": ["https://blazedemo.com/-0", 1229, 0, 0.0, 58111.240846216395, 785, 88449, 84750.0, 85683.0, 86186.5, 86817.7, 8.981292019877229, 41.72274788302031, 7.499028004877959], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-5", 6, 0, 0.0, 16271.999999999998, 311, 85587, 2976.0, 85587.0, 85587.0, 85587.0, 0.05439709882139619, 0.0092963791931097, 0.04318832162284678], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-4", 6, 0, 0.0, 15654.833333333334, 308, 85646, 1109.5, 85646.0, 85646.0, 85646.0, 0.054407950815212464, 0.009404499310832622, 0.04319693751246849], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 6, 0, 0.0, 30539.833333333336, 368, 85940, 4779.5, 85940.0, 85940.0, 85940.0, 0.05440597740338405, 0.009351027366206634, 0.04319537073139769], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 6, 0, 0.0, 2072.833333333333, 313, 5384, 1068.5, 5384.0, 5384.0, 5384.0, 0.054407950815212464, 0.009351366546364641, 0.04309067198353252], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-1", 6, 0, 0.0, 5105.666666666666, 87, 21503, 2299.0, 21503.0, 21503.0, 21503.0, 0.05496166423919316, 0.013964055644104903, 0.04256308568523455], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-0", 6, 0, 0.0, 29550.833333333336, 546, 88755, 723.0, 88755.0, 88755.0, 88755.0, 0.05684886728631932, 0.3208852079247321, 0.05329581308092436], "isController": false}, {"data": ["https://blazedemo.com/home", 1, 0, 0.0, 26260.0, 26260, 26260, 26260.0, 26260.0, 26260.0, 26260.0, 0.03808073115003808, 15.769848093583397, 0.24138869716298553], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 12, 42.857142857142854, 0.09586961732044419], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 6, 21.428571428571427, 0.047934808660222095], "isController": false}, {"data": ["Assertion failed", 10, 35.714285714285715, 0.07989134776703682], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12517, 28, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 12, "Assertion failed", 10, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 6, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://blazedemo.com/", 1234, 15, "Assertion failed", 10, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 2, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/reserve.php", 453, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/-5", 1229, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/-4", 1229, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/-3", 1229, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/-2", 1229, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
