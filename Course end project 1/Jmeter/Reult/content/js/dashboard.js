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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8184855233853007, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.20987654320987653, 500, 1500, "https://blazedemo.com/"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.9674418604651163, 500, 1500, "https://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [0.9948979591836735, 500, 1500, "https://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [0.9948979591836735, 500, 1500, "https://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/home-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/home-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [0.7285714285714285, 500, 1500, "https://blazedemo.com/home-0"], "isController": false}, {"data": [0.917910447761194, 500, 1500, "https://blazedemo.com/login-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://blazedemo.com/home-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/login-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/login-2"], "isController": false}, {"data": [0.9976744186046511, 500, 1500, "https://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [0.9948979591836735, 500, 1500, "https://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [0.9897959183673469, 500, 1500, "https://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.7908163265306123, 500, 1500, "https://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.9475308641975309, 500, 1500, "https://blazedemo.com/-5"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/-4"], "isController": false}, {"data": [0.5740740740740741, 500, 1500, "https://blazedemo.com/-3"], "isController": false}, {"data": [0.6728395061728395, 500, 1500, "https://blazedemo.com/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/-1"], "isController": false}, {"data": [0.5154320987654321, 500, 1500, "https://blazedemo.com/-0"], "isController": false}, {"data": [0.993006993006993, 500, 1500, "https://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [0.0, 500, 1500, "Demo Flight Test"], "isController": true}, {"data": [0.9965034965034965, 500, 1500, "https://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [0.9895104895104895, 500, 1500, "https://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [0.9965034965034965, 500, 1500, "https://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.8706293706293706, 500, 1500, "https://blazedemo.com/confirmation.php-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://blazedemo.com/home"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/login"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5770, 0, 0.0, 484.10069324090034, 31, 3249, 391.0, 930.9000000000005, 1152.4499999999998, 1967.29, 47.461976951740134, 1370.2535291876763, 75.47034950255406], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/", 162, 0, 0.0, 1576.2654320987647, 1115, 3249, 1532.0, 1817.2000000000003, 2126.25, 3187.26, 1.3515091852568704, 380.1666255182871, 6.955520904593462], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 196, 0, 0.0, 862.2142857142858, 686, 1435, 797.5, 1069.6, 1127.1499999999996, 1287.5600000000002, 2.8311425682507587, 21.232765216488517, 14.784109580384225], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-0", 215, 0, 0.0, 444.4511627906977, 378, 945, 428.0, 487.80000000000007, 551.5999999999999, 904.3200000000008, 2.268698294783049, 16.281939430372066, 1.875251848593407], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 196, 0, 0.0, 343.5561224489795, 282, 844, 301.0, 426.6, 448.15, 679.1000000000001, 2.8473473182636995, 0.4866072077110814, 2.4906344427334535], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 196, 0, 0.0, 338.469387755102, 286, 827, 302.0, 421.3, 438.29999999999995, 679.5600000000002, 2.8485059876758516, 0.49236871076037664, 2.49164795517963], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 215, 0, 0.0, 298.65581395348846, 285, 392, 297.0, 309.0, 314.4, 382.6800000000002, 2.2717906993945416, 0.3905053017255043, 1.9887352366624753], "isController": false}, {"data": ["https://blazedemo.com/home-2", 70, 0, 0.0, 1054.1714285714286, 744, 1391, 1074.0, 1156.3, 1226.0000000000002, 1391.0, 1.1534025374855825, 137.67165873702422, 2.7903716633712308], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 215, 0, 0.0, 300.4279069767441, 284, 391, 299.0, 312.0, 316.2, 379.9200000000002, 2.2719107297588605, 0.3927033194993343, 1.9888403117537037], "isController": false}, {"data": ["https://blazedemo.com/home-3", 70, 0, 0.0, 1074.628571428572, 617, 1264, 1135.5, 1174.9, 1186.65, 1264.0, 1.1516188470650173, 331.29172690387276, 1.7727668362562516], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-1", 215, 0, 0.0, 45.12093023255814, 35, 83, 42.0, 55.400000000000006, 58.19999999999999, 69.88000000000002, 2.2779525973957173, 0.5809110221120329, 1.9496381267018426], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 143, 0, 0.0, 798.8461538461539, 675, 1484, 741.0, 990.6, 1016.1999999999999, 1429.8800000000003, 2.3027375201288245, 15.167493835547504, 12.348294711151368], "isController": false}, {"data": ["https://blazedemo.com/home-0", 140, 0, 0.0, 630.157142857143, 380, 1000, 563.0, 886.7, 891.95, 977.0400000000002, 2.280315986643864, 131.3546311283492, 2.72158639750794], "isController": false}, {"data": ["https://blazedemo.com/login-0", 67, 0, 0.0, 453.2388059701492, 389, 714, 430.0, 533.8000000000002, 628.1999999999999, 714.0, 1.1984831139095593, 6.72347489669791, 1.8399287170864338], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 215, 0, 0.0, 301.2232558139533, 281, 400, 297.0, 316.0, 323.2, 391.0, 2.269320892529185, 0.3900395284034536, 1.9821408898640518], "isController": false}, {"data": ["https://blazedemo.com/home-1", 140, 0, 0.0, 333.9428571428573, 182, 731, 398.5, 473.1, 533.4499999999998, 681.8000000000004, 2.2892649824217153, 12.86181756397678, 2.762511752922901], "isController": false}, {"data": ["https://blazedemo.com/login-1", 67, 0, 0.0, 306.8059701492538, 289, 456, 303.0, 318.2, 320.6, 456.0, 1.20421294798519, 0.20815008964197132, 1.9599352061540674], "isController": false}, {"data": ["https://blazedemo.com/login-2", 67, 0, 0.0, 312.99999999999994, 288, 456, 307.0, 326.2, 398.5999999999997, 456.0, 1.2040398231678826, 0.2081201647467922, 1.9573017939294828], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 215, 0, 0.0, 300.29767441860446, 284, 717, 297.0, 307.4, 313.2, 392.0, 2.2719827540657924, 0.3882783026967907, 1.9889033621382], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 196, 0, 0.0, 332.515306122449, 284, 812, 302.0, 419.0, 440.7499999999999, 793.57, 2.8485887858616983, 0.4896579695084731, 2.4917203804900736], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 196, 0, 0.0, 335.03571428571433, 282, 838, 302.0, 420.3, 442.4999999999998, 823.45, 2.8537316909816255, 0.4904851343874669, 2.4906452927986953], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-1", 196, 0, 0.0, 61.85204081632654, 36, 484, 46.0, 88.0, 110.0, 314.2500000000002, 2.8626093560589467, 0.7287598904248639, 2.4480741284376872], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-0", 196, 0, 0.0, 500.86734693877554, 387, 798, 479.0, 618.2, 679.4499999999999, 796.06, 2.8496656004652516, 18.68701612023844, 2.478747910002908], "isController": false}, {"data": ["https://blazedemo.com/reserve.php", 215, 0, 0.0, 756.3395348837216, 669, 1346, 740.0, 802.8, 864.5999999999999, 1231.5200000000004, 2.2591152674162025, 18.342454210229064, 11.706990615477567], "isController": false}, {"data": ["https://blazedemo.com/-5", 162, 0, 0.0, 454.0864197530864, 316, 725, 437.0, 501.70000000000005, 603.5999999999999, 693.5000000000002, 1.3773870457598585, 5.470540151470063, 1.1850370969867532], "isController": false}, {"data": ["https://blazedemo.com/-4", 162, 0, 0.0, 953.8209876543211, 561, 1301, 983.5, 1056.7, 1176.6499999999996, 1297.22, 1.373766154472372, 170.0666153359367, 1.1792387204894677], "isController": false}, {"data": ["https://blazedemo.com/-3", 162, 0, 0.0, 607.4382716049381, 340, 933, 587.0, 723.3000000000002, 783.1499999999999, 931.11, 1.3764040170606129, 53.07757990789988, 1.1828472021614642], "isController": false}, {"data": ["https://blazedemo.com/-2", 162, 0, 0.0, 529.358024691358, 324, 831, 520.5, 658.5000000000001, 671.0, 825.33, 1.3750488057446484, 38.9162982805524, 1.1789969252380872], "isController": false}, {"data": ["https://blazedemo.com/-1", 162, 0, 0.0, 231.0925925925926, 158, 487, 198.0, 352.70000000000005, 441.44999999999993, 477.55000000000007, 1.3805563130624487, 113.2237101758505, 1.209334973454118], "isController": false}, {"data": ["https://blazedemo.com/-0", 162, 0, 0.0, 614.1172839506173, 480, 2166, 544.5, 742.7000000000002, 1038.6, 1966.9200000000014, 1.3603385731559856, 6.319463469241233, 1.135829570359734], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-5", 143, 0, 0.0, 324.1678321678322, 283, 669, 298.0, 415.6, 444.4, 655.3600000000001, 2.3207127671659715, 0.3966061857949658, 2.026899297497525], "isController": false}, {"data": ["Demo Flight Test", 67, 0, 0.0, 9206.044776119401, 8618, 10925, 9095.0, 9752.2, 9983.8, 10925.0, 1.2473238387787398, 930.2265683177417, 59.697357436237546], "isController": true}, {"data": ["https://blazedemo.com/confirmation.php-4", 143, 0, 0.0, 315.9999999999999, 283, 670, 297.0, 413.19999999999993, 442.79999999999995, 587.2800000000004, 2.3208257595429758, 0.40115835882725265, 2.0269979844926644], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 143, 0, 0.0, 317.2517482517481, 286, 673, 300.0, 410.2, 418.59999999999997, 658.0400000000001, 2.3207127671659715, 0.39893590045278243, 2.026899297497525], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 143, 0, 0.0, 316.3706293706294, 286, 641, 301.0, 407.6, 416.59999999999997, 555.2000000000005, 2.3205621277769666, 0.39884661571166613, 2.0222353818785193], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-1", 143, 0, 0.0, 55.44055944055945, 31, 311, 46.0, 81.6, 87.0, 304.40000000000003, 2.3301287273912337, 0.5934005570718592, 1.9896128248737168], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-0", 143, 0, 0.0, 462.25174825174815, 377, 981, 429.0, 567.6, 603.1999999999998, 905.3200000000004, 2.313728662729553, 13.05991374079767, 2.3529460096270527], "isController": false}, {"data": ["https://blazedemo.com/home", 70, 0, 0.0, 2012.985714285714, 1822, 2283, 1997.0, 2155.0, 2214.9500000000003, 2283.0, 1.134926554038717, 469.99446089975356, 7.195257020331399], "isController": false}, {"data": ["https://blazedemo.com/login", 67, 0, 0.0, 772.0149253731342, 689, 1050, 743.0, 937.0, 992.9999999999999, 1050.0, 1.191725511819427, 7.097548069226802, 5.70644893589584], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5770, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
