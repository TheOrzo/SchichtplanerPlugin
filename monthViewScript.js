var missingColor = "#ff000070";
var neededColor = "#f8ac5970";

// init stuff
initPlugin();
removeUnnecessaryInfo();


function initPlugin() {
	let optionBar = document.getElementsByClassName("options")[0];
	
	// create EXPORT ICAL Button
	let icalOption = document.createElement("li");
	icalOption.setAttribute("role", "presentation");
	icalOption.innerHTML = "<a class=\"option_bar_dd_li_a\" role=\"menuitem\">EXPORT ICAL</a>";
	icalOption.addEventListener("click", function() {exportIcal();});

	document.querySelector(".dropdown-menu").appendChild(icalOption);
	
	// create setup default button
	let defaultOption = document.createElement("li");
	defaultOption.setAttribute("role", "presentation");
	defaultOption.innerHTML = "<a class=\"option_bar_dd_li_a\" role=\"menuitem\">ADD DEFAULTS</a>";
	defaultOption.addEventListener("click", function() {createDefaultShifts();});

	document.querySelector(".dropdown-menu").appendChild(defaultOption);
	
	
	// create mark empty button
	let markButton = document.createElement("div");
	markButton.classList.add("pull-right");
	markButton.style.marginLeft = "5px";
	markButton.style.marginBottom = "5px";
	markButton.innerHTML = "<div class=\"dropdown\">&nbsp;<button class=\"btn btn-default btn-md\" type=\"button\"><span><a style=\"color:white;\">MARKIEREN</a></span></button></div>";
	markButton.addEventListener("click", function(e) {
			let bttn = e.currentTarget.firstElementChild.firstElementChild;
			if (bttn.style.backgroundColor != "") {unmarkMissing();bttn.style.backgroundColor = "";}
			else {markMissing();bttn.style.backgroundColor = missingColor;}
		});
	optionBar.insertBefore(markButton, optionBar.children[4]);
	
	// create print view button
	let printButton = document.createElement("div");
	printButton.classList.add("pull-right");
	printButton.style.marginLeft = "5px";
	printButton.style.marginBottom = "5px";
	//printButton.innerHTML = "<div class=\"dropdown\">&nbsp;<button class=\"btn btn-default btn-md\" type=\"button\"><span><a style=\"color:white;\">DRUCKANSICHT </a></span></button></div>";
	printButton.innerHTML = '<div class=\"dropdown\">&nbsp;<button class="btn btn-default btn-md dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="false"><span class="optionsSpan">DRUCKANSICHT</span><span class="caret"></span></button></div>';
	
	let list = document.createElement('ul');
	list.classList.add("dropdown-menu");
	list.setAttribute("role", "menu");
	list.setAttribute("aria-labelledby", "dropdownMenu1");
	
	let weekPrint = document.createElement('li');
	weekPrint.setAttribute("role", "presentation");
	console.log(weekPrint);
	weekPrint.innerHTML ='<a class="option_bar_dd_li_a" role="menuitem"">WOCHENANSICHT</a>';
	list.appendChild(weekPrint);
	
	let monthPrint = document.createElement('li');
	monthPrint.setAttribute("role", "presentation");
	monthPrint.innerHTML ='<a class="option_bar_dd_li_a" role="menuitem"">MONATSANSICHT</a>';
	list.appendChild(monthPrint);
	
	printButton.firstElementChild.appendChild(list);
	optionBar.insertBefore(printButton, optionBar.children[4]);
	
	weekPrint.addEventListener("click", function(e) {
		enterWeeklyPrintView();
	});
	
	monthPrint.addEventListener("click", function(e) {
		enterPrintView();
	});
	
}

function removeUnnecessaryInfo() {
	// remove shift division title
	let shiftDivisionTitles = document.querySelectorAll('*[id^="shiftDivisionTitle"]');
	for (let shift of shiftDivisionTitles) {
		shift.nextElementSibling.remove();
		shift.remove();
	}
	
	// remove nur bereich
	document.getElementsByClassName("choosenDivOuput")[0].parentNode.parentNode.remove();
	
	// remove unsichtbar
	document.querySelector("[value=UNSICHTBAR]").parentNode.remove();
	
	// remove Stunden
	document.querySelector('[title="Pro Version benötigt"]').parentNode.parentNode.remove();
	
	// move add shift button to shift header
	let shiftAddButtons = document.querySelectorAll("[class^=createShiftLink]");
	for (let bttn of shiftAddButtons) {
		let header =bttn.parentNode.parentNode.firstElementChild;
		header.style.display = "flex";
		header.style.justifyContent = "space-between";
		header.style.marginRight = "8px";
		header.appendChild(bttn);
	}
	
	// space table evenly
	let table = document.getElementsByClassName("table-responsive")[0].firstElementChild;
	table.style.tableLayout = "fixed";
}

function enterPrintView() {
	if (document.querySelector("[onclick^=toggleShifts]").firstElementChild.classList.contains("fa-angle-down")) {
		document.querySelector("[onclick^=toggleShifts]").click();
	}
	
	document.getElementsByClassName("navbar")[0].style.display = "none";
	document.getElementsByClassName("container-fluid")[0].firstElementChild.style.display = "none";
	
	let table = document.getElementsByClassName("table-responsive")[0].firstElementChild;
	table.style.tableLayout = "fixed";
	
	let days = document.getElementsByClassName("tableHeadDay");
	for (let day of days) {
		let date = document.createElement("span");
		date.style.fontSize = "30px";
		date.textContent = day.firstElementChild.textContent;
		day.replaceChild(date, day.firstElementChild);
		day.children[1].remove();
	}
	
	let shifts = document.getElementsByClassName("shiftItem");
	for (let shift of shifts) {
		shift.firstElementChild.firstElementChild.remove();
		shift.firstElementChild.firstElementChild.remove();
		shift.firstElementChild.firstElementChild.style.fontSize = "45px";
		shift.firstElementChild.firstElementChild.style.textDecoration = "underline";
		shift.children[1].firstElementChild.remove();
		shift.children[1].lastElementChild.remove();
		shift.children[1].lastElementChild.remove();
	}
	
	let emplyees = document.getElementsByClassName("employeeBooked");
	for (let empl of emplyees) {
		empl.style.marginTop = "-20px";
		empl.style.marginBottom = "-20px";
		
		let nameTag = empl.firstElementChild.firstElementChild;
		nameTag.style.fontSize = "46px";
		nameTag.firstElementChild.remove();
	}
	
	let headfoot = document.getElementsByClassName("scheduleTrHeadFoot");
	for (let hf of headfoot) {
		for (let wday of hf.children) {
			wday.firstElementChild.style.fontSize = "40px";
		}
	}
	
	window.print();
	location.reload();
}

function enterWeeklyPrintView() {
	let view = document.createElement('div');
	
	let month = document.title.split(' ')[0];
	let dayNames = ["MO", "DI", "MI", "DO", "FR", "SA", "SO"]
	
	// create Table
	var css = `
		html {
			background-color: white;
		}
	
		.myTable{
			width:100%;
			font-size: 26pt;
			color: black;
			border-collapse: collapse;
			table-layout: fixed;
		}
		
		.myTable tr:nth-child(even) {
			background: #eee
		}
		.myTable tr:nth-child(odd) {
			background: #fff
		}
		.myTable tr:first-child {
			background: #ccc
		}
		
		.myTable th:first-child, .myTable td:first-child {
			width: 150px;
			min-width: 150px;
			max-width: 150px;
		}
		
		.myTable th:last-child, .myTable td:last-child {
			width: 50%
		}
		
		.myTable td, .myTable th {
			padding:5px;
			border:1px solid #000;
		}
		
		@media print {
			.pagebreak {page-break-after:always;}
		}
	`;
	var style = document.createElement('style');
	style.type = 'text/css';
	style.appendChild(document.createTextNode(css));
	
	let rows = document.querySelector(".scheduleTrHeadFoot").parentElement.children;
	for (let row of rows) {
		// going through weeks
		if (row.classList.contains("scheduleTrHeadFoot") || row.innerHTML == '') {
			console.log("tr found");
			continue;
		}
		 
		
		const table = document.createElement('table');
		table.classList.add("myTable");
		let head = table.createTHead().insertRow(0);
		//let head = table.insertRow();
		
		let dateHead = head.insertCell();
		let lunchHead = head.insertCell();
		let eveningHead = head.insertCell();
		
		dateHead.appendChild(document.createTextNode(month));
		lunchHead.appendChild(document.createTextNode('Mittag'));
		eveningHead.appendChild(document.createTextNode('Abend'));

		let days = row.children;
		let dayIndex = 0;
		for (let day of days) {
			// going through days
			let tr = table.insertRow();
			
			// check if empty
			if (day.innerHTML.trim() == "") {
				tr.insertCell().appendChild(document.createTextNode(dayNames[dayIndex++]));
				continue;
			}
			
			let dateDiv = day.children[0].firstElementChild;
			let shiftDiv = day.children[1];
			
			let dayStr = dateDiv.textContent;
			tr.insertCell().appendChild(document.createTextNode(dayNames[dayIndex++] + ' ' + dayStr));
			
			let lunchCell = tr.insertCell();
			let eveningCell = tr.insertCell();
			
			let shifts = shiftDiv.firstElementChild.children;
			for (let shift of shifts) {
				// going through shifts
				let workerList = [];
				let shiftName = shift.querySelector('[title^="Schicht Titel:"]').textContent;
				let shiftEntry = shift.querySelector("[class^=bookedShiftEmployees]");
				let shiftId = shiftEntry.classList[0].split("bookedShiftEmployees")[1];
				let workers = shiftEntry.children;
				for (let worker of workers) {
					let workerName = worker.firstElementChild.firstElementChild.textContent.replace(/\s+/g, "");
					if (shiftName == "Abend") {
						if (eveningCell.textContent != "") {
							workerName = ', ' + workerName;
						}
						eveningCell.appendChild(document.createTextNode(workerName));
					} else {
						if (lunchCell.textContent != "") {
							workerName = ', ' + workerName;
						}
						lunchCell.appendChild(document.createTextNode(workerName));
					}
				}
			}
		}
		view.appendChild(table);
		let pagebreak = document.createElement('div');
		pagebreak.classList.add("pagebreak")
		view.appendChild(pagebreak);
	}
	
	var win = window.open("", month, "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes");
	win.document.head.appendChild(style);
	win.document.body.appendChild(view);
	win.print();
	win.close();
}

function leavePrintView() {
	document.getElementsByClassName("navbar")[0].style.display = "";
	document.getElementsByClassName("container-fluid")[0].firstElementChild.style.display = "";
}

function printSchedule2(){
    var printContent = document.getElementsByClassName("table-responsive")[0]
    var WinPrint = window.open('', '', 'width=1200,height=800');
    WinPrint.document.write("<html><head>");
    WinPrint.document.write(document.head.innerHTML);
    WinPrint.document.write("</head><body>");
    WinPrint.document.write(printContent.innerHTML);
    WinPrint.document.write("</body></html>");
    WinPrint.focus();
    WinPrint.print();
    WinPrint.document.close();
    WinPrint.close();
}

// create and export ical for selected worker
function exportIcal() {
	let workerName = document.querySelector(".choosenEmployeeOuput").textContent;
	let ical = "BEGIN:VCALENDAR\nX-LOTUS-CHARSET:UTF-8\nVERSION:2.0\nPRODID:ZMS-Berlin\nBEGIN:VTIMEZONE\nTZID:Europe/Berlin\nX-LIC-LOCATION:Europe/Berlin\nBEGIN:DAYLIGHT\nTZOFFSETFROM:+0100\nTZOFFSETTO:+0200\nTZNAME:CEST\nDTSTART:19700329T020000\nRRULE:FREQ=YEARLY;INTERVAL=1;BYDAY=-1SU;BYMONTH=3\nEND:DAYLIGHT\nBEGIN:STANDARD\nTZOFFSETFROM:+0200\nTZOFFSETTO:+0100\nTZNAME:CET\nDTSTART:19701025T030000\nRRULE:FREQ=YEARLY;INTERVAL=1;BYDAY=-1SU;BYMONTH=10\nEND:STANDARD\nEND:VTIMEZONE\n";
	
	let year = window.location.href.split('_')[1];
	let month = window.location.href.split('index/')[1].split('_')[0];
	
	let rows = document.querySelector(".scheduleTrHeadFoot").parentElement.children;
	for (let row of rows) {
		if (row.classList.contains("scheduleTrHeadFoot")) {
			continue;
		}
		
		let days = row.querySelectorAll(".tableHeadDay");
		for (let day of days) {
			let dayStr = day.firstElementChild.textContent;
			let date = year + month + (("00" + dayStr.split('.')[0]).slice(-2));
			
			let shifts = day.nextElementSibling.firstElementChild.children;
			for (let shift of shifts) {
				let workerList = [];
				let isSelected = false;
				let shiftEntry = shift.querySelector("[class^=bookedShiftEmployees]");
				let shiftId = shiftEntry.classList[0].split("bookedShiftEmployees")[1];
				let workers = shiftEntry.children;
				for (let worker of workers) {
					workerList.push(worker.firstElementChild.firstElementChild.textContent.replace(/\s+/g, ""));
					
					if (worker.classList.contains("selectedEmployeeItem")) {
						isSelected = true;
					}
				}
				
				if (isSelected) {
					let timeStr = shift.firstElementChild.firstElementChild.nextElementSibling.textContent.replace(/\s+/g, "");
					let name = shift.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.children[0].textContent;
					
					let start = timeStr.split("-")[0].replace(":", "") + "00";
					let end = timeStr.split("-")[1].replace(":", "") + "00";
					let today = new Date();
					let timestamp = today.getFullYear() + "" + ("00" + (today.getMonth()+1)).slice(-2) + ("00" + today.getDate()).slice(-2) + "T" + ("00" + today.getHours()).slice(-2) + ("00" + today.getMinutes()).slice(-2) + "00";
				
					let entry = "BEGIN:VEVENT\nUID:" + shiftId + "@schichtplaner-online.de\nSUMMARY:" + name + "\n";
					entry += "DESCRIPTION:" + (workerList.length == 1 ? "Niemand weiteres ist dieser Schicht zugeteilt." : "Es waren zum Zeitpunkt des Exports " + workerList + " eingetragen.") + "\nCLASS:PUBLIC\n";
					entry += "DTSTART;TZID=Europe/Berlin:" + date + "T" + start + "\n";
					entry += "DTEND;TZID=Europe/Berlin:" + (end > start ? date : ++date) + "T" + end + "\n";
					entry += "DTSTAMP:" + timestamp + "\nEND:VEVENT\n";
					ical += entry;
				}
			}
		}
	}
	
	ical += "END:VCALENDAR";
	download(workerName + ".ics", ical);
}

function markMissing() {
	let badges = document.querySelectorAll(".badge");
	for (let badge of badges) {
		let booked = badge.firstElementChild.textContent;
		let needed = badge.firstElementChild.nextElementSibling.textContent;
		if (booked != needed) {
			if (booked == 0) {
				badge.parentNode.parentNode.parentNode.style.backgroundColor = missingColor;
			} else {
				badge.parentNode.parentNode.parentNode.style.backgroundColor = neededColor;
			}
		}
	}
}

function unmarkMissing() {
	let shifts = document.querySelectorAll("[class^=bookedShiftEmployees]");
	for (let shift of shifts) {
		shift.parentNode.parentNode.style.backgroundColor = "";
		
	}
}

function createDefaultShifts() {
	let monthStart = document.getElementById("monthStartStamp").value;
	let division = document.getElementById("divisionid").firstElementChild.value
	let schedule = document.getElementById("toggleSetPublic").querySelector('input[name="schedule_id"]').value
	
	let lunch = [];
	let singleEvening = [];
	let doubleEvening = [];
	
	// sort dates to lists
	let tableRows = document.getElementsByClassName("table-bordered")[0].firstElementChild.children
	for (let row of tableRows) {
		if (row.innerHTML.trim() == '' || row.classList.contains('scheduleTrHeadFoot')) continue;
		
		let week = row.children;
		for (let i = 0; i < 7; i++) {
			if (week[i].innerHTML.trim() == '') continue;
			
			let date = week[i].querySelector("a").textContent.split('.')[0];
			switch (i) {
				case 0:
					lunch.push(date);
					singleEvening.push(date);
					break;
				case 5:
					doubleEvening.push(date);
					break;
				case 6:
					singleEvening.push(date);
					break;
				default:
					lunch.push(date);
					doubleEvening.push(date);
					break;
			}
		}
	}
	// send lunch shifts
	requestCreateShift(monthStart, "12%3A00", "14%3A00", "Mittag", division, schedule, 1, String(lunch));
	// send single shifts
	requestCreateShift(monthStart, "17%3A00", "00%3A00", "Abend", division, schedule, 1, String(singleEvening));
	// send double shifts
	requestCreateShift(monthStart, "17%3A00", "00%3A00", "Abend", division, schedule, 2, String(doubleEvening));
	
	location.reload();
}

function requestCreateShift(month, start, end, title, division, schedule, num, repeat) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", 'https://schichtplaner-online.de/schedule/month/shift_create', false);
	
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	
	xhr.onreadystatechange = function() {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			console.log(this.responseText);
		}
	}
	
	xhr.send("day_start_stamp=" + month + "&shiftFrom=" + start + "&shiftTo=" + end + "&shiftTitle=" + title + "&division_id=" + division + "&schedule_id=" + schedule + "&pauseType=perShift&pauseValue=0&maxNeededEmployees=" + num + "&repeatDays=" + repeat);
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}