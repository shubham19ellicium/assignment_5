var ERROR_MESSAGE = document.getElementById("error-message")
// sessionStorage.setItem("page-number",1)

// function markNav() {
//     var linkOne = document.getElementById("link-1")
//     var linkTwo = document.getElementById("link-2")
//     var linkThree = document.getElementById("link-3")

//     linkThree.style.color = "black"
//     linkThree.style.fontWeight = "bolder"
// }
// markNav()

function formatDate(date) {
    let readableDate = new Date(date)
    return readableDate.toDateString()
}

const fetchDataByDueDate = async (date) => {
    const response = await fetch(`http://localhost:3000/data?dueDate=${date}`);
    const jsonData = await response.json();

    return jsonData;
};

const fetchData = async () => {
    const response = await fetch("http://localhost:3000/data");
    const jsonData = await response.json();

    return jsonData;
};

async function getData() {
    let data = await fetchData();
    console.log("Data :: ", data);
    makeChart(data)
}

getData()

function makeChart(data) {
    var taskData = data
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    // root.container.children.clear();
    chart.data = taskData.map(function (task) {
        return {
            "category": task.name,
            "start": new Date(task.createDate),
            "end": new Date(task.dueDate),
            "color": task.status ? am4core.color("#4CAF50") : am4core.color("#F44336"),
            "priority": task.priority,
            "status": task.status ? "Completed" : "Incomplete",
            "completeDate": task.completeDate ? "Completed at - " + formatDate(task.completeDate) : "",
            "dueMessage": task.status ? "" : "Due date - " + formatDate(task.dueDate)
        };
    });

    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 70;
    dateAxis.baseInterval = {
        count: 1,
        timeUnit: "day"
    };

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.openDateX = "start";
    series.dataFields.dateX = "end";
    series.dataFields.categoryY = "category";
    series.columns.template.propertyFields.fill = "color";
    series.columns.template.tooltipText = "{task}: [bold]{status}[/] ({priority}) {completeDate} {dueMessage}";
    series.columns.template.height = am4core.percent(100);
    series.columns.template.maxWidth = 10
    // series.row.template.fill = am4core.color("#104547");

    chart.scrollbarX = new am4core.Scrollbar();
    // chart.cursor.tooltipsEnabled = true;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.disabled = true;
    chart.cursor.lineY.disabled = true;
    chart.cursor.behavior = "none";

    chart.legend = new am4charts.Legend();
}

const fetchDataByDate = async (date) => {
    const response = await fetch(`http://localhost:3000/data?createDate=${date}`);
    const jsonData = await response.json();

    return jsonData;
};

async function getDataByDate(date) {
    let data = await fetchDataByDate(date);
    return data
}

async function makeChartForDate() {

    var selectDate = document.getElementById("selected-date-id")
    var date = new Date(selectDate.value).toLocaleDateString('en-CA')
    var selection = document.getElementById("select-level-id");

    if (date == "Invalid Date") {
        getData()
    } else {
        if (selection.value == 0) {
            let response = await getDataByDate(date)
            if (response.length == 0) {
                ERROR_MESSAGE.innerHTML = "No date to display"
            } else {
                ERROR_MESSAGE.innerHTML = ""
            }
            makeChart(response)
        }else if (selection.value == 1) {
            let response = await getDataByDueDate(date)
            if (response.length == 0) {
                ERROR_MESSAGE.innerHTML = "No date to display"
            } else {
                ERROR_MESSAGE.innerHTML = ""
            }
            makeChart(response)
        }
    }

    // var selectDate = document.getElementById("selected-date-id")
    // var date = new Date(selectDate.value).toLocaleDateString('en-CA')
    // console.log("DATE :: ",date);
    // if(date == "Invalid Date"){
    //     getData()
    // }else{
    //     let response =await getDataByDate(date)
    //     if(response.length == 0){
    //         ERROR_MESSAGE.innerHTML = "No date to display"
    //     }else{
    //         ERROR_MESSAGE.innerHTML = ""
    //     }
    //     makeChart(response)
    // }
}



async function getDataByDueDate(date) {
    let data = await fetchDataByDueDate(date);
    return data
}

async function makeChartForDateDue() {
    var selectDate = document.getElementById("selected-due-date-id")
    var date = new Date(selectDate.value).toLocaleDateString('en-CA')
    console.log("DATE :: ", date);
    if (date == "Invalid Date") {
        getData()
    } else {
        let response = await getDataByDueDate(date)
        if (response.length == 0) {
            ERROR_MESSAGE.innerHTML = "No date to display"
        } else {
            ERROR_MESSAGE.innerHTML = ""
        }
        makeChart(response)
    }
}

async function handleSelectChange() {
    var selection = document.getElementById("select-level-id");
    
    var inputBlock = document.getElementById("selected-date-id");
    var date = new Date(inputBlock.value).toLocaleDateString('en-CA')
    if (selection.value != "none") {
        inputBlock.classList.add("active")
    } else {
        inputBlock.classList.remove("active")
        getData()
    }

    if (inputBlock.value != "Invalid Date") {
        if (selection.value == 0) {
            let response = await getDataByDate(date)
            if (response.length == 0) {
                ERROR_MESSAGE.innerHTML = "No date to display"
            } else {
                ERROR_MESSAGE.innerHTML = ""
            }
            makeChart(response)
        }else if (selection.value == 1) {
            let response = await getDataByDueDate(date)
            if (response.length == 0) {
                ERROR_MESSAGE.innerHTML = "No date to display"
            } else {
                ERROR_MESSAGE.innerHTML = ""
            }
            makeChart(response)
        }else if(selection.value == 2){
            getData()
            inputBlock.classList.remove("active")
        }
    }
}