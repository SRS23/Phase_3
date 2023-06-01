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

    var data = {"OkPercent": 99.02270929838437, "KoPercent": 0.9772907016156367};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7810247429668964, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7090480888577703, 500, 1500, "Api_1"], "isController": false}, {"data": [0.8175590861815443, 500, 1500, "Api_2"], "isController": false}, {"data": [0.8600599949401858, 500, 1500, "Api_2-1"], "isController": false}, {"data": [0.7392029241078586, 500, 1500, "Api_1-1"], "isController": false}, {"data": [0.8451516137193249, 500, 1500, "Api_2-0"], "isController": false}, {"data": [0.7356920709224406, 500, 1500, "Api_1-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 177020, 1730, 0.9772907016156367, 14762.24742402, 0, 156921, 128.0, 281.90000000000146, 378.0, 479.0, 458.5915317817247, 706.9343218558619, 95.40347326026922], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Api_1", 31421, 526, 1.6740396550077974, 28918.54088030271, 0, 156921, 173.0, 560.9000000000015, 82503.8, 147340.96000000002, 81.51707212033634, 189.83599177866694, 19.976160760845033], "isController": false}, {"data": ["Api_2", 27883, 562, 2.015565039629882, 14611.36925725345, 0, 148184, 174.0, 653.9000000000015, 64952.50000000001, 147435.0, 73.1925639316033, 167.51790303914646, 28.122505235212124], "isController": false}, {"data": ["Api_2-1", 27669, 348, 1.2577252520871733, 6694.449672919129, 1, 84269, 88.5, 252.0, 15546.400000000009, 84153.0, 72.65675467020992, 123.06357168565431, 8.407374881176835], "isController": false}, {"data": ["Api_1-1", 31189, 294, 0.9426400333450896, 14920.892590336396, 1, 93185, 88.0, 246.0, 24264.0, 84145.0, 81.15119219841178, 139.99446706395773, 9.969776395310564], "isController": false}, {"data": ["Api_2-0", 27669, 0, 0.0, 7788.458527594012, 41, 78568, 86.0, 280.0, 45992.65000000001, 63359.0, 72.63958751194514, 43.15011402441665, 19.72051301593823], "isController": false}, {"data": ["Api_1-0", 31189, 0, 0.0, 13820.880791304766, 41, 78589, 85.0, 272.0, 45250.05000000002, 63397.990000000005, 80.92652030752545, 48.7480132197411, 10.036785233452862], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: reqres.in:443 failed to respond", 2, 0.11560693641618497, 0.001129815840018077], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 33, 1.907514450867052, 0.018641961360298272], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:443 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:90db:9a77:a03b:41f:9f03:2133] failed: Connection timed out: connect", 30, 1.7341040462427746, 0.016947237600271156], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:80 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:83bb:9a77:a03b:59f:9f03:2133] failed: Connection timed out: connect", 63, 3.6416184971098264, 0.035589198960569425], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:80 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:90db:9a77:a03b:41f:9f03:2133] failed: Connection timed out: connect", 3, 0.17341040462427745, 0.0016947237600271157], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:80 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:976b:9a77:a03b:41f:9f03:2133] failed: Connection timed out: connect", 154, 8.901734104046243, 0.08699581968139193], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:443 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:839b:9a77:a03b:59f:9f03:2133] failed: Connection timed out: connect", 4, 0.23121387283236994, 0.002259631680036154], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:80 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:90db:9a77:a03b:420:9f03:2133] failed: Connection timed out: connect", 1, 0.057803468208092484, 5.649079200090385E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 338, 19.53757225433526, 0.19093887696305503], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:443 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:83bb:9a77:a03b:59f:9f03:2133] failed: Connection timed out: connect", 496, 28.670520231213874, 0.2801943283244831], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:443 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:976b:9a77:a03b:41f:9f03:2133] failed: Connection timed out: connect", 606, 35.028901734104046, 0.34233419952547733], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 177020, 1730, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:443 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:976b:9a77:a03b:41f:9f03:2133] failed: Connection timed out: connect", 606, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:443 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:83bb:9a77:a03b:59f:9f03:2133] failed: Connection timed out: connect", 496, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 338, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:80 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:976b:9a77:a03b:41f:9f03:2133] failed: Connection timed out: connect", 154, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:80 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:83bb:9a77:a03b:59f:9f03:2133] failed: Connection timed out: connect", 63], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Api_1", 31421, 526, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:443 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:976b:9a77:a03b:41f:9f03:2133] failed: Connection timed out: connect", 141, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 119, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:80 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:976b:9a77:a03b:41f:9f03:2133] failed: Connection timed out: connect", 101, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:443 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:83bb:9a77:a03b:59f:9f03:2133] failed: Connection timed out: connect", 91, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:80 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:83bb:9a77:a03b:59f:9f03:2133] failed: Connection timed out: connect", 42], "isController": false}, {"data": ["Api_2", 27883, 562, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:443 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:976b:9a77:a03b:41f:9f03:2133] failed: Connection timed out: connect", 162, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 161, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:443 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:83bb:9a77:a03b:59f:9f03:2133] failed: Connection timed out: connect", 157, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:80 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:976b:9a77:a03b:41f:9f03:2133] failed: Connection timed out: connect", 53, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:80 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:83bb:9a77:a03b:59f:9f03:2133] failed: Connection timed out: connect", 21], "isController": false}, {"data": ["Api_2-1", 27669, 348, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:443 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:976b:9a77:a03b:41f:9f03:2133] failed: Connection timed out: connect", 162, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:443 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:83bb:9a77:a03b:59f:9f03:2133] failed: Connection timed out: connect", 157, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 26, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:443 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:90db:9a77:a03b:41f:9f03:2133] failed: Connection timed out: connect", 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:443 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:839b:9a77:a03b:59f:9f03:2133] failed: Connection timed out: connect", 1], "isController": false}, {"data": ["Api_1-1", 31189, 294, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:443 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:976b:9a77:a03b:41f:9f03:2133] failed: Connection timed out: connect", 141, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:443 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:83bb:9a77:a03b:59f:9f03:2133] failed: Connection timed out: connect", 91, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 32, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to reqres.in:443 [reqres.in/104.26.11.213, reqres.in/172.67.73.173, reqres.in/104.26.10.213, reqres.in/2606:4700:90db:9a77:a03b:41f:9f03:2133] failed: Connection timed out: connect", 13], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
