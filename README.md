# ChartJs-Wrapper
A Javascript utility that uses ChartJs to help developers create charts in a few lines. 


To Create a Chartjs chart - 2 files are required(as of now...will improve later)
  - Data File - Containing comma separated(csv format) data with the first line being the data headers.
  - Config File - contatins json data which lists some of the details such as title of the chart, data to display and labels for the chart.
  
A single Javascript line is required to create a ChartJs chart :
var sampleChart = new chartmanager("DataFile.csv","configFile.txt","canvasID");
  - Here first argument to the chartmanager function is data file name -which is just a text file containing csv formatted data which will      be displayed.
  - Second argument is the text file containing Json object. Sample as below
     
     {
        "TitleText" : "Sample Chartjs Chart",
        "LabelColumnList" : [0],
        "DataColumnList" : [1,2],
        "DisplaylabelColumn" : 0,
        "DisplayDataColumn" : [1,2]
      }
