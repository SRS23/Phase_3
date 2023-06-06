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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4770268976739734, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://blazedemo.com/"], "isController": false}, {"data": [0.22872340425531915, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.7714808043875686, 500, 1500, "https://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [0.526595744680851, 500, 1500, "https://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [0.5514184397163121, 500, 1500, "https://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [0.9451553930530164, 500, 1500, "https://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [0.03225806451612903, 500, 1500, "https://blazedemo.com/home-2"], "isController": false}, {"data": [0.9387568555758684, 500, 1500, "https://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [0.46774193548387094, 500, 1500, "https://blazedemo.com/home-3"], "isController": false}, {"data": [0.9661791590493601, 500, 1500, "https://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.23469387755102042, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [0.6290322580645161, 500, 1500, "https://blazedemo.com/home-0"], "isController": false}, {"data": [0.375, 500, 1500, "https://blazedemo.com/login-0"], "isController": false}, {"data": [0.9606946983546618, 500, 1500, "https://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [0.49193548387096775, 500, 1500, "https://blazedemo.com/home-1"], "isController": false}, {"data": [0.5625, 500, 1500, "https://blazedemo.com/login-1"], "isController": false}, {"data": [0.5625, 500, 1500, "https://blazedemo.com/login-2"], "isController": false}, {"data": [0.9277879341864717, 500, 1500, "https://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [0.6365248226950354, 500, 1500, "https://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [0.6861702127659575, 500, 1500, "https://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [0.5514184397163121, 500, 1500, "https://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.46099290780141844, 500, 1500, "https://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.453382084095064, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.06118546845124283, 500, 1500, "https://blazedemo.com/-5"], "isController": false}, {"data": [0.0124282982791587, 500, 1500, "https://blazedemo.com/-4"], "isController": false}, {"data": [0.055449330783938815, 500, 1500, "https://blazedemo.com/-3"], "isController": false}, {"data": [0.15391969407265774, 500, 1500, "https://blazedemo.com/-2"], "isController": false}, {"data": [0.043021032504780114, 500, 1500, "https://blazedemo.com/-1"], "isController": false}, {"data": [0.07743785850860421, 500, 1500, "https://blazedemo.com/-0"], "isController": false}, {"data": [0.5153061224489796, 500, 1500, "https://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [0.0, 500, 1500, "Demo Flight Test"], "isController": true}, {"data": [0.576530612244898, 500, 1500, "https://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [0.6326530612244898, 500, 1500, "https://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [0.7295918367346939, 500, 1500, "https://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [0.6173469387755102, 500, 1500, "https://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.4744897959183674, 500, 1500, "https://blazedemo.com/confirmation.php-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://blazedemo.com/home"], "isController": false}, {"data": [0.25, 500, 1500, "https://blazedemo.com/login"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10431, 0, 0.0, 10489.406864154946, 37, 116499, 844.0, 36874.400000000016, 63889.2, 87048.84000000003, 80.14783283517868, 2598.5866132383, 118.47913591218008], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/", 523, 0, 0.0, 51130.829827915855, 3364, 116499, 66384.0, 100423.2, 107861.4, 110758.36, 4.01853288973238, 1130.374819254862, 20.68131672743129], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 282, 0, 0.0, 18348.67021276596, 709, 65746, 8652.5, 46822.9, 50832.59999999997, 64363.95000000001, 3.2225625085706446, 24.167187749977145, 15.92432531168579], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-0", 547, 0, 0.0, 995.0383912248625, 396, 25277, 482.0, 687.4, 951.600000000001, 21668.719999999998, 5.162958837909521, 37.05334204543309, 4.2275615254561245], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 282, 0, 0.0, 9864.719858156033, 288, 63766, 521.0, 25044.3, 29083.25, 43979.240000000034, 3.23743484949372, 0.5532725572865245, 2.6805298644754667], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 282, 0, 0.0, 8936.191489361703, 288, 45640, 488.5, 24990.2, 29109.999999999996, 43590.28, 3.2377693835608574, 0.559653496963156, 2.6808068518433474], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 547, 0, 0.0, 622.526508226691, 286, 21465, 313.0, 461.0, 598.6000000000001, 15854.08, 5.037296251956903, 0.8657852933050926, 4.370627546850539], "isController": false}, {"data": ["https://blazedemo.com/home-2", 31, 0, 0.0, 10461.06451612903, 867, 28796, 8427.0, 22753.4, 25578.199999999993, 28796.0, 0.450214941326827, 53.74035237488382, 1.0892155140801092], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 547, 0, 0.0, 756.5594149908594, 286, 24763, 313.0, 467.2, 820.0000000000018, 15901.24, 5.039106042321121, 0.8710173530183969, 4.372197817730836], "isController": false}, {"data": ["https://blazedemo.com/home-3", 31, 0, 0.0, 1225.2903225806454, 796, 2251, 1201.0, 1376.0, 1825.599999999999, 2251.0, 0.5764867779968014, 165.84072126515602, 0.8874671077100458], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-1", 547, 0, 0.0, 403.16270566727604, 37, 21176, 57.0, 174.59999999999997, 373.60000000000025, 15415.04, 5.052557684136631, 1.28307442246587, 4.285186414092664], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 98, 0, 0.0, 17105.989795918365, 716, 64936, 4638.5, 44603.6, 47938.75, 64936.0, 1.2710765239948119, 8.371597863975357, 6.54849120460441], "isController": false}, {"data": ["https://blazedemo.com/home-0", 62, 0, 0.0, 1103.3870967741939, 396, 25527, 658.5, 1057.9000000000003, 1238.85, 25527.0, 1.1419520011787891, 65.78073773322528, 1.3629749691488775], "isController": false}, {"data": ["https://blazedemo.com/login-0", 16, 0, 0.0, 6922.6875, 423, 45798, 850.0, 31309.400000000016, 45798.0, 45798.0, 0.3493602340713568, 1.9597778560199135, 0.5368343049914843], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 547, 0, 0.0, 468.08043875685553, 285, 24731, 312.0, 445.7999999999999, 513.0000000000001, 3824.9199999999987, 5.037249864169222, 0.8658132925380557, 4.360748919684873], "isController": false}, {"data": ["https://blazedemo.com/home-1", 62, 0, 0.0, 4640.1612903225805, 218, 22300, 649.5, 19576.900000000016, 21804.0, 22300.0, 0.8943511626565115, 5.026865470471987, 1.0792984978146096], "isController": false}, {"data": ["https://blazedemo.com/login-1", 16, 0, 0.0, 1576.4375, 385, 15813, 697.0, 5343.80000000001, 15813.0, 15813.0, 0.3890672113607626, 0.06725087540122555, 0.6330891024705767], "isController": false}, {"data": ["https://blazedemo.com/login-2", 16, 0, 0.0, 3674.75, 324, 25055, 693.5, 25041.7, 25055.0, 25055.0, 0.44909759452100934, 0.0776272209279479, 0.7298932340640525], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 547, 0, 0.0, 752.1005484460701, 287, 24767, 316.0, 494.4, 1049.2000000000012, 15870.04, 5.037481811651594, 0.8609337443362864, 4.370788548362588], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 282, 0, 0.0, 6729.265957446809, 288, 45529, 411.0, 24866.7, 28856.8, 43628.04, 3.2378809102808463, 0.5565107814545205, 2.6808991936872806], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 282, 0, 0.0, 5190.379432624116, 286, 45603, 380.0, 24678.5, 24953.7, 38075.200000000106, 3.2375463531680886, 0.5564532794507652, 2.6742988545170663], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-1", 282, 0, 0.0, 7764.804964539006, 40, 21869, 268.0, 21418.4, 21547.4, 21819.760000000002, 3.25105774662501, 0.8265446847511557, 2.6283121231597515], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-0", 282, 0, 0.0, 7614.578014184398, 399, 64220, 679.0, 25196.8, 29346.649999999998, 46235.770000000004, 3.2478002487676787, 21.29787572125351, 2.673253803496568], "isController": false}, {"data": ["https://blazedemo.com/reserve.php", 547, 0, 0.0, 1926.053016453382, 700, 29627, 815.0, 1400.7999999999997, 8308.800000000005, 25322.36, 5.013610991448448, 40.70162090238124, 25.74794216818053], "isController": false}, {"data": ["https://blazedemo.com/-5", 523, 0, 0.0, 16549.336520076464, 577, 64706, 5731.0, 45740.2, 63640.4, 64468.8, 4.0760657781934375, 16.188827656164758, 3.5068495611215025], "isController": false}, {"data": ["https://blazedemo.com/-4", 523, 0, 0.0, 17081.82026768643, 801, 66149, 6887.0, 44274.2, 64902.79999999999, 65966.08, 4.056338902073929, 502.1581187492244, 3.4819549755107264], "isController": false}, {"data": ["https://blazedemo.com/-3", 523, 0, 0.0, 14945.967495219884, 509, 65341, 5070.0, 43765.6, 63985.2, 65171.72, 4.069025612298883, 156.91186095680453, 3.4968188855693523], "isController": false}, {"data": ["https://blazedemo.com/-2", 523, 0, 0.0, 11530.491395793497, 384, 65116, 2658.0, 43092.4, 45814.399999999994, 64447.12, 4.073113556536841, 115.27627341991621, 3.492376662733737], "isController": false}, {"data": ["https://blazedemo.com/-1", 523, 0, 0.0, 10930.892925430207, 354, 22987, 5714.0, 22158.2, 22325.6, 22669.16, 4.262289737905855, 349.5634135933833, 3.733665912989797], "isController": false}, {"data": ["https://blazedemo.com/-0", 523, 0, 0.0, 32384.15296367113, 549, 65356, 45824.0, 64526.0, 64751.6, 65096.56, 4.655551500369418, 21.62743563844702, 3.8872036453279804], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-5", 98, 0, 0.0, 8765.14285714286, 294, 46100, 545.0, 24958.4, 29484.549999999977, 46100.0, 1.2807276624106432, 0.21887435636900637, 1.0736457203439669], "isController": false}, {"data": ["Demo Flight Test", 16, 0, 0.0, 42882.6875, 14569, 77896, 36428.5, 70581.70000000001, 77896.0, 77896.0, 0.20021272602139775, 149.31301519583306, 9.58293577551148], "isController": true}, {"data": ["https://blazedemo.com/confirmation.php-4", 98, 0, 0.0, 7266.602040816329, 294, 42537, 505.0, 24911.9, 25078.8, 42537.0, 1.2802926383173296, 0.2213005829903978, 1.0732810356652949], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 98, 0, 0.0, 6264.58163265306, 289, 46142, 470.0, 24786.0, 25031.0, 46142.0, 1.2807611380477542, 0.22013082060195774, 1.073673783276919], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 98, 0, 0.0, 4363.091836734693, 291, 46124, 383.5, 24601.7, 24942.95, 46124.0, 1.2808280945721642, 0.22014232875459072, 1.0712282961718922], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-1", 98, 0, 0.0, 6796.255102040818, 38, 21781, 170.5, 21421.1, 21523.35, 21781.0, 1.2866295557189371, 0.3270550994183909, 1.053463848007037], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-0", 98, 0, 0.0, 7743.295918367348, 398, 64120, 633.0, 29842.100000000064, 42955.4, 64120.0, 1.2846730638141681, 7.251377254732316, 1.2613740266635205], "isController": false}, {"data": ["https://blazedemo.com/home", 31, 0, 0.0, 11510.709677419354, 2379, 30035, 9525.0, 23713.2, 26632.39999999999, 30035.0, 0.4442088067978277, 183.9573983827575, 2.816340368729133], "isController": false}, {"data": ["https://blazedemo.com/login", 16, 0, 0.0, 11561.0, 1111, 46332, 1519.0, 42539.4, 46332.0, 46332.0, 0.3099573808601317, 1.8458960916311509, 1.4844052692754748], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10431, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
