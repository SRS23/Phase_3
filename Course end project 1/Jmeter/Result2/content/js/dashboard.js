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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7434959725951301, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0903010033444816, 500, 1500, "https://blazedemo.com/"], "isController": false}, {"data": [0.3743654822335025, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.8713235294117647, 500, 1500, "https://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [0.8527918781725888, 500, 1500, "https://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [0.8718274111675127, 500, 1500, "https://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [0.2245762711864407, 500, 1500, "https://blazedemo.com/home-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/home-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.4103585657370518, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [0.6864406779661016, 500, 1500, "https://blazedemo.com/home-0"], "isController": false}, {"data": [0.803921568627451, 500, 1500, "https://blazedemo.com/login-0"], "isController": false}, {"data": [0.9987745098039216, 500, 1500, "https://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [0.7372881355932204, 500, 1500, "https://blazedemo.com/home-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://blazedemo.com/login-1"], "isController": false}, {"data": [0.9656862745098039, 500, 1500, "https://blazedemo.com/login-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [0.8959390862944162, 500, 1500, "https://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [0.9314720812182741, 500, 1500, "https://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [0.9073604060913706, 500, 1500, "https://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.6649746192893401, 500, 1500, "https://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.6755852842809364, 500, 1500, "https://blazedemo.com/-5"], "isController": false}, {"data": [0.45652173913043476, 500, 1500, "https://blazedemo.com/-4"], "isController": false}, {"data": [0.5066889632107023, 500, 1500, "https://blazedemo.com/-3"], "isController": false}, {"data": [0.6003344481605352, 500, 1500, "https://blazedemo.com/-2"], "isController": false}, {"data": [0.8662207357859532, 500, 1500, "https://blazedemo.com/-1"], "isController": false}, {"data": [0.41638795986622074, 500, 1500, "https://blazedemo.com/-0"], "isController": false}, {"data": [0.8764940239043825, 500, 1500, "https://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [0.0, 500, 1500, "Demo Flight Test"], "isController": true}, {"data": [0.9223107569721115, 500, 1500, "https://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [0.9103585657370518, 500, 1500, "https://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [0.9342629482071713, 500, 1500, "https://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [0.9302788844621513, 500, 1500, "https://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.7350597609561753, 500, 1500, "https://blazedemo.com/confirmation.php-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://blazedemo.com/home"], "isController": false}, {"data": [0.47549019607843135, 500, 1500, "https://blazedemo.com/login"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10698, 0, 0.0, 1154.6834922415383, 37, 40855, 422.0, 1562.4000000000015, 3695.0499999999993, 16522.150000000023, 87.76477923441679, 2437.2305708494673, 138.41010491184963], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/", 299, 0, 0.0, 3713.2508361204013, 1189, 40855, 1732.0, 5138.0, 19552.0, 40697.0, 2.4615333953519007, 692.4057655656999, 12.668243157719255], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 394, 0, 0.0, 2770.0786802030443, 699, 32262, 853.0, 5859.5, 16620.75, 25199.750000000036, 4.704758493044361, 35.281175835124486, 24.568234484148306], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-0", 408, 0, 0.0, 471.90196078431364, 381, 743, 454.0, 556.1, 594.4999999999995, 672.91, 4.1335292031811965, 29.665417152119954, 3.4190422217719467], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 394, 0, 0.0, 1333.4111675126903, 295, 24724, 330.0, 717.5, 9447.0, 24534.6, 4.728870112100626, 0.808156513298447, 4.1364720483568975], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 394, 0, 0.0, 1333.368020304568, 290, 24683, 326.0, 700.5, 9491.0, 24532.15, 4.728359355311003, 0.8173043026269997, 4.136025275420932], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 408, 0, 0.0, 314.65196078431376, 288, 420, 312.0, 335.1, 345.0999999999999, 387.7299999999999, 4.141795590205871, 0.7119107712063996, 3.6281158636861983], "isController": false}, {"data": ["https://blazedemo.com/home-2", 118, 0, 0.0, 3251.3474576271196, 799, 22321, 2048.0, 4751.500000000029, 16245.55, 22283.760000000002, 1.6884882306646634, 201.54433399513485, 4.084165056879159], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 408, 0, 0.0, 315.7279411764704, 287, 426, 312.0, 340.0, 352.0, 400.81999999999994, 4.142510483191358, 0.7160394096922561, 3.6287420931861796], "isController": false}, {"data": ["https://blazedemo.com/home-3", 118, 0, 0.0, 1096.7796610169491, 659, 1375, 1153.5, 1237.0, 1281.0, 1364.7400000000002, 1.688391592382206, 485.70772157456827, 2.5983445624490265], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-1", 408, 0, 0.0, 58.754901960784295, 38, 265, 55.0, 75.10000000000002, 82.0, 142.10999999999933, 4.153052187986686, 1.0545256690180271, 3.5568620789690657], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 251, 0, 0.0, 2681.019920318725, 693, 32210, 827.0, 6972.0000000000355, 18005.59999999996, 25316.52, 3.481420863558817, 22.928420218594397, 18.651155842996243], "isController": false}, {"data": ["https://blazedemo.com/home-0", 236, 0, 0.0, 667.1906779661017, 390, 3789, 622.5, 916.3, 953.15, 1052.6999999999996, 3.332391979666761, 191.95776925656597, 3.9765481590652363], "isController": false}, {"data": ["https://blazedemo.com/login-0", 102, 0, 0.0, 704.9019607843138, 413, 15717, 473.0, 628.1000000000001, 671.65, 15357.779999999986, 1.5515431770128232, 8.703395474285454, 2.382188008624755], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 408, 0, 0.0, 314.8308823529412, 287, 581, 312.0, 334.1, 349.54999999999995, 412.1899999999997, 4.141711501370419, 0.7118566642980407, 3.6199529235610597], "isController": false}, {"data": ["https://blazedemo.com/home-1", 236, 0, 0.0, 1429.8898305084747, 187, 21298, 463.0, 3333.4, 4084.599999999914, 21256.63, 3.3525108317352084, 18.838867950493643, 4.045170333475389], "isController": false}, {"data": ["https://blazedemo.com/login-1", 102, 0, 0.0, 532.9705882352938, 292, 15877, 329.5, 427.80000000000007, 494.19999999999993, 15507.879999999986, 1.554498902706657, 0.2686975642373811, 2.5293052094763473], "isController": false}, {"data": ["https://blazedemo.com/login-2", 102, 0, 0.0, 532.019607843137, 295, 15869, 332.0, 429.20000000000005, 502.8499999999999, 15498.769999999986, 1.5545462858536288, 0.26870575448837136, 2.526346082771969], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 408, 0, 0.0, 317.47058823529403, 287, 427, 314.0, 337.0, 352.0, 386.81999999999994, 4.1423001949317735, 0.7079522899407082, 3.6285578855994154], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 394, 0, 0.0, 1050.2817258883254, 288, 24602, 324.0, 599.5, 3480.5, 16279.4000000001, 4.728870112100626, 0.8127745505172952, 4.1364720483568975], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 394, 0, 0.0, 791.7360406091374, 287, 24680, 320.0, 508.5, 744.0, 16289.500000000098, 4.7282458687851765, 0.8126672586974524, 4.126691150439823], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-1", 394, 0, 0.0, 1192.4416243654828, 37, 21181, 72.0, 405.5, 15140.0, 21145.15, 4.742245706101128, 1.2041681022290962, 4.055550059879879], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-0", 394, 0, 0.0, 1152.3553299492391, 388, 15839, 500.0, 3604.0, 3810.0, 8321.500000000087, 4.722578479905069, 30.968861809143103, 4.107909120329861], "isController": false}, {"data": ["https://blazedemo.com/reserve.php", 408, 0, 0.0, 799.8872549019608, 694, 1120, 784.0, 890.1, 935.55, 1048.0099999999998, 4.120046855434826, 33.44741354717858, 21.364696096053642], "isController": false}, {"data": ["https://blazedemo.com/-5", 299, 0, 0.0, 1136.5886287625417, 325, 15598, 513.0, 855.0, 3583.0, 15586.0, 2.501673360107095, 9.935943317540998, 2.1523185842327646], "isController": false}, {"data": ["https://blazedemo.com/-4", 299, 0, 0.0, 1618.0200668896327, 578, 16431, 1053.0, 1350.0, 4117.0, 16145.0, 2.4884109956140716, 308.0551073933479, 2.1360481104929385], "isController": false}, {"data": ["https://blazedemo.com/-3", 299, 0, 0.0, 1275.3745819397996, 366, 16145, 712.0, 1007.0, 3747.0, 15823.0, 2.496826775335694, 96.28391514337966, 2.145710510054112], "isController": false}, {"data": ["https://blazedemo.com/-2", 299, 0, 0.0, 824.5317725752509, 363, 15830, 562.0, 841.0, 3555.0, 3920.0, 2.500815483309775, 70.77747414238338, 2.1442539007284984], "isController": false}, {"data": ["https://blazedemo.com/-1", 299, 0, 0.0, 995.5886287625414, 196, 15437, 334.0, 871.0, 3540.0, 15412.0, 2.5059085804321226, 205.51711078797834, 2.1951171842261856], "isController": false}, {"data": ["https://blazedemo.com/-0", 299, 0, 0.0, 1990.0033444816056, 509, 24730, 647.0, 3671.0, 15639.0, 24692.0, 2.4837187666135034, 11.538134934355895, 2.0738081498579546], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-5", 251, 0, 0.0, 1193.3545816733065, 288, 24509, 329.0, 626.4000000000003, 3628.999999999997, 15748.32, 3.504020549475095, 0.5988316368731851, 3.057415527452814], "isController": false}, {"data": ["Demo Flight Test", 103, 0, 0.0, 15741.485436893206, 8670, 49265, 12959.0, 29186.40000000001, 31724.0, 49246.64, 1.732927301176035, 1292.2708931831182, 82.85695029506032], "isController": true}, {"data": ["https://blazedemo.com/confirmation.php-4", 251, 0, 0.0, 976.0996015936256, 291, 15905, 327.0, 497.6, 3519.6, 15739.8, 3.504069467130153, 0.6056838825019893, 3.05745821030699], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 251, 0, 0.0, 1059.2549800796805, 285, 24695, 326.0, 518.4000000000001, 3485.799999999999, 20027.11999999991, 3.504020549475095, 0.6022535319410319, 3.057415527452814], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 251, 0, 0.0, 943.796812749004, 288, 24773, 321.0, 487.8, 984.9999999999822, 20017.23999999991, 3.504118386151054, 0.6022703476197124, 3.0506569131299734], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-1", 251, 0, 0.0, 778.0318725099607, 38, 15387, 74.0, 186.80000000000007, 3174.5999999999985, 15306.039999999999, 3.518806689938456, 0.893447011117186, 3.0015904068707853], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-0", 251, 0, 0.0, 1196.4462151394428, 384, 24813, 476.0, 1736.4000000000005, 3882.799999999999, 15914.4, 3.498501637744791, 19.74740182242665, 3.5548263380723393], "isController": false}, {"data": ["https://blazedemo.com/home", 118, 0, 0.0, 4222.008474576272, 1833, 23215, 2952.0, 5965.100000000026, 17194.149999999998, 23173.2, 1.6601480064154872, 687.5015937596725, 10.523292852570416], "isController": false}, {"data": ["https://blazedemo.com/login", 102, 0, 0.0, 1431.7843137254897, 725, 19622, 819.5, 1079.9, 3776.1499999999837, 19620.11, 1.5441443623592104, 9.19570728813431, 7.392727146284971], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10698, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
