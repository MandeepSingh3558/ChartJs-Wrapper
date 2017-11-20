function chartmanager(_dataFile, _configFile, _canvasID)
{
	
	 
	//Declaration of global Data variables
	var allDataText =null;
	var configMap = {};
	var allDataLines = [],copyAllDataLines = [], allConfigLines = [], colHeaders=[];
	var _linkedCharts = [];

	//function definitions
	function ReadDataFile()
	{
	  return new Promise(function(resolve, reject) {
		var client = new XMLHttpRequest();
		client.open('GET', _dataFile);

		client.onload = function() {
		  if (client.status == 200) {
			allDataText = client.responseText;
			allDataLines = allDataText.split(/\r\n|\r|\n/);	
			
			copyAllDataLines = allDataLines.slice(0);		
			//supposing first line contains column headers
			colHeaders = allDataLines[0].split(',');
			resolve("Data Loaded!");
		  }
		  else {
			reject(Error(client.statusText));
		  }
		};

		// Handle network errors
		client.onerror = function() {
		  reject(Error("Network Error"));
		};

		// Make the request
		client.send();
	  });
	}
	
	//Sum up the muneric data values to get a single data row for a particular row 
	function CompressDataSet(_origSet)
	{
		var _compressSet = [];
		var _list = {};
		for(var i=0;i<_origSet.length; i++)
		{
			var _record = _origSet[i];
			if(_list[_record[0]] === undefined || _list[_record[0]] == null)
			{
				_compressSet.push(_record);
				_list[_record[0]] = _compressSet.length - 1;
			}
			else
			{
				var _drecord = _compressSet[_list[_record[0]]];
				//for
			}
			
		}
	}

	//get data for a particular column....also adds up the data for the same labels
	function GetColumnData(_colno,_float)
	{
		var _colData = [], labellist = [];
		//index starts from 1 so as to remove the column header row
		for (var i=1; i < allDataLines.length -1; i++)
		{
			var allvals = allDataLines[i].split(',');
			var _indx = labellist.indexOf(allvals[configMap["DisplaylabelColumn"]]);
			if(_float){				
				if( _indx == -1)
				{
					labellist.push(allvals[configMap["DisplaylabelColumn"]]);
					_colData.push(parseFloat(allvals[_colno]));
				}
				else
				{
					
					var _sum = _colData[_indx];
					if(isNaN(parseFloat(allvals[_colno])) == false)
					{
						_sum = _sum + parseFloat(allvals[_colno]);
					}
				
					_colData.splice(_indx,1,_sum);
				}
				
			}
			else{
				if( _indx == -1)
				{
					labellist.push(allvals[configMap["DisplaylabelColumn"]]);
					_colData.push(allvals[_colno]);
				}
			}
			
		}
		return _colData;
	}

	function ReadChartConfig()
	{
		return new Promise(function(resolve, reject) {
		var client = new XMLHttpRequest();
		client.open('GET', _configFile);

		client.onload = function() {
		  if (client.status == 200) {
			configMap = JSON.parse(client.responseText);
			resolve("Configuration Loaded!");
		  }
		  else {
			reject(Error(client.statusText));
		  }
		};

		client.onerror = function() {
		  reject(Error("Network Error"));
		};
		// Make the request
		client.send();
	  });
	}

	//Set the variables for chart using data read from configuration and data file
	function SetChartVars()
	{
		//update title
		myChart.options.title.text = configMap["TitleText"];
		//update x axis labels
		myChart.data.labels = GetColumnData(configMap["DisplaylabelColumn"]);
		//update data sets
		myChart.data.datasets = [];
		var _dataColList = configMap["DisplayDataColumn"];
		for (var i=0; i < _dataColList.length; i++)
		{
			//a template data set variable
			var _dataset  =  {
				label: colHeaders[_dataColList[i]],
				data: GetColumnData(_dataColList[i],true),
				backgroundColor: GetBackGroundColor(i),
				borderWidth: 1
			};
			myChart.data.datasets.push(_dataset);
		}
			
		myChart.update();
	}

	//filter(if any) the dataset and refresh the chart.....filters will be object with key as col no. and value as label value
	this.Refresh = function (_filters)
	{
		if(_filters)
		{
			allDataLines = [];
			allDataLines.push(copyAllDataLines[0]);
			for(var i =1; i < copyAllDataLines.length;i++)
			{
				var _inc = true;
				var _record = copyAllDataLines[i];
				var allvals = _record.split(',');
				for (var key in _filters) {
					if (_filters.hasOwnProperty(key)) {
						if(allvals[key] != _filters[key])
						{
							_inc = false;
							break;
						}
					}
				}
				if(_inc)
				{
					allDataLines.push(_record);
				}
			}
		}
		
		//
		SetChartVars();
	}
	
	
	//call data file read and draw  chart
	ReadDataFile().then(function(response) {
			//call chart config file reading
			ReadChartConfig().then(function(response) {
			  SetChartVars();
			}, function(error) {
			  console.error("Failed to load Configuration!", error);
			});
		}, function(error) {
		  console.error("Failed to load Data File!", error);
	});


	//link a chartmanager instance to this chart 
	//function linkChart(_chartManager,_destLabelCol, _destDataSetCol)
	this.linkChart = function(_chartManager,_destLabelCol)
	{
		_linkedCharts.push({"chartManager" : _chartManager,"destLabelCol":_destLabelCol});
	}
	
	var ctx = document.getElementById(_canvasID);
	ctx.addEventListener("click", clickHandler);
	
	function clickHandler(evt) {
		var activePoints = myChart.getElementsAtEvent(evt);
		//var firstPoint = activePoints[0];
		var firstPoint = myChart.getElementAtEvent(evt)[0];
		if (firstPoint) {
			var label = firstPoint._model.label;
			var dataset = firstPoint._model.datasetLabel;
			var value = myChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
			//loop over linked charts and filter...refresh them
			for(var i=0; i<_linkedCharts.length;i++)
			{
				var _filter = {};
				_filter[_linkedCharts[i].destLabelCol] = label;
				_linkedCharts[i].chartManager.Refresh(_filter)
			}
		}
	}
	
	var myChart = new Chart(ctx, {
		//responsive : true,
		type: 'bar',
		data: {
			labels : null,
			datasets: [{
				label: 'Seis 2D',
				data: null
			}		
			]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:true
					},
					scaleLabel:{
						display:true
					},
					//stacked: true
					}
				],
				xAxes: [{
						type: 'category',
						ticks:{
							autoSkip : false
						}
					}],
				
			},
			legend: {
				display: true,
				labels: {
					fontColor: 'rgb(255, 99, 132)'
				}
			},
			title: {
				display: true,
				text: '2D Seismic over the years'
			},
			annotation: {
				drawTime: 'afterDatasetsDraw',
				events: ['click'],
				annotations: []
			}
		}
		
	});

	


	

}

var acrChart1 = new chartmanager("Acreages1.csv","Acreages1-config.txt","chart_Acreages_1");
var acrChart2 = new chartmanager("Acreages_STATEWISE.csv","Acreages_STATEWISE-config.txt","chart_Acreages_2");

//var targetsChart1 = new chartmanager("2D_COMPARE_BASINWISE.csv","2D_COMPARE_BASINWISE-config.txt","chart_Targets_Achievements_1");
var targetsChart1 = new chartmanager("3D_COMPARE_BASINWISE.csv","3D_COMPARE_BASINWISE-config.txt","chart_Targets_Achievements_1");
var targetsChart2 = new chartmanager("WELLS_COMPARE_BASINWISE.csv","WELLS_COMPARE_BASINWISE-config.txt","chart_Targets_Achievements_2");
var targetsChart3 = new chartmanager("3D_COMPARE_STATEWISE.csv","3D_COMPARE_STATEWISE-config.txt","chart_Targets_Achievements_3");

var targetsChart4 = new chartmanager("WELLS_COMPARE_STATEWISE.csv","WELLS_COMPARE_STATEWISE-config.txt","chart_Targets_Achievements_4");


var linkedChart1 = new chartmanager("seismic_data.csv","linked1-config.txt","linkedchart1");
var linkedChart2 = new chartmanager("seismic_data.csv","linked2-config.txt","linkedchart2");
linkedChart1.linkChart(linkedChart2,0);
