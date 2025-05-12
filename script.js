const { lastDayOfMonth, getDate, getDay } = dateFns;

const questions = [
  "What is your date of birth?",
  "When did/will you graduate university?",
  "When did you last attend a live event?",
  "When did you last travel somewhere far?",
];

let qNo = 0;
let startTime; // Time when survey starts
let questionStartTime; // Time when current question starts
let questionTimes = []; // Array to store time spent on each question

const input = document.querySelector("input[type='date']");
const button = document.querySelector(".enter-btn");
const questionDisplay = document.getElementById("question");
const scrollPicker = document.getElementById("scroll-picker");
const calenderPicker = document.getElementById("calendar-picker")
const qheader = document.getElementById("head");

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthsDisplay = document.getElementById("months");
const yearsDisplay = document.getElementById("years");
const daysDisplay = document.getElementById("days");

const calDays = document.getElementById("dates");

const pattern = [];

let selectedMonth;
let selectedYear;
let selectedDay;

const today = new Date();
let cSelectedDate = today;

// Hide all survey elements initially
scrollPicker.classList.add("hidden");
calenderPicker.classList.add("hidden");
button.classList.add("hidden");
questionDisplay.classList.add("hidden");
qheader.classList.add("hidden");

document.getElementById("question").innerHTML = questions[qNo];

for (let i = 0; i < questions.length/2; i++) {
  pattern[i] = true;
}


for (let i = questions.length/2; i < questions.length; i++) {
  pattern[i] = false;
}

for (let i = pattern.length - 1; i > 0; i--) { 
  const j = Math.floor(Math.random() * (i + 1)); 
  [pattern[i], pattern[j]] = [pattern[j], pattern[i]]; 
} 

function showPicker() {
  if (pattern[qNo] === true) {
    scrollPicker.classList.remove("hidden");
    calenderPicker.classList.add("hidden");
  } else {
    scrollPicker.classList.add("hidden");
    calenderPicker.classList.remove("hidden");
  }
}

// Create a results container to display timing information
function createResultsContainer() {
  const resultsContainer = document.createElement('div');
  resultsContainer.id = 'results-container';
  resultsContainer.className = 'results-container';
  document.querySelector('.test').appendChild(resultsContainer);
  return resultsContainer;
}

// Display results at the end of the survey
function displayResults() {
  const resultsContainer = createResultsContainer();
  
  // Calculate total time
  const totalTime = questionTimes.reduce((sum, time) => sum + time, 0);
  
  // Create header
  const header = document.createElement('h2');
  header.textContent = 'Survey Timing Results';
  resultsContainer.appendChild(header);
  
  // Create table
  const table = document.createElement('table');
  table.className = 'results-table';
  
  // Add table header
  const tableHeader = document.createElement('thead');
  tableHeader.innerHTML = `
    <tr>
      <th>Question</th>
      <th>Input Type</th>
      <th>Time (seconds)</th>
    </tr>
  `;
  table.appendChild(tableHeader);
  
  // Add table body
  const tableBody = document.createElement('tbody');
  
  // Add rows for each question
  questions.forEach((question, index) => {
    const row = document.createElement('tr');
    const timeInSeconds = (questionTimes[index] / 1000).toFixed(2);
    const inputType = pattern[index] ? "Scroll Picker" : "Calendar Picker";
    
    row.innerHTML = `
      <td>${question}</td>
      <td>${inputType}</td>
      <td>${timeInSeconds}s</td>
    `;
    
    tableBody.appendChild(row);
  });
  
  // Add total time row
  const totalRow = document.createElement('tr');
  totalRow.className = 'total-row';
  totalRow.innerHTML = `
    <td><strong>Total Time</strong></td>
    <td><strong>${(totalTime / 1000).toFixed(2)}s</strong></td>
  `;
  tableBody.appendChild(totalRow);
  
  table.appendChild(tableBody);
  resultsContainer.appendChild(table);
}

// Function to start the survey
function startSurvey() {
  document.getElementById("start-screen").classList.add("hidden");
  questionDisplay.classList.remove("hidden");
  button.classList.remove("hidden");
  qheader.classList.remove("hidden");
  setCalToday();
  setDateToday();
  showPicker();
  
  // Start timing
  startTime = new Date();
  questionStartTime = new Date();
}

// Add event listener to start button
document.getElementById("start-btn").addEventListener('click', startSurvey);

function dateEnter() {
  // Record time spent on current question
  const currentTime = new Date();
  const timeSpent = currentTime - questionStartTime;
  questionTimes.push(timeSpent);
  
  qNo++
  setDateToday()
  setCalToday()
  
  // Reset timer for next question
  questionStartTime = new Date();
  
  showPicker()

  if (qNo < questions.length) {
    questionDisplay.innerHTML = questions[qNo];
  } else {
    questionDisplay.innerHTML = "Thank you for participating in this test";
    scrollPicker.classList.add("hidden");
    calenderPicker.classList.add("hidden");
    button.classList.add("hidden");
    
    // Display timing results
    displayResults();
  }
}

function selectCenter(column) {
  const columnRect = column.getBoundingClientRect();
  const centerY = columnRect.top + columnRect.height / 2;

  let closestItem = null;
  let closestDistance = Infinity;

  const itemList = column.querySelectorAll(".scroll-item");

  for (let i = 0; i < itemList.length; i++) {

    const rect = itemList[i].getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const distance = Math.abs(itemCenter - centerY);

    itemList[i].classList.remove("selected");

    if (distance < closestDistance) {
      closestDistance = distance;
      closestItem = itemList[i];
    }
  }

  closestItem.classList.add("selected")

  if (column.id === "month-column") {
    return months.indexOf(closestItem.textContent.trim()) + 1;
  } else {
    return parseInt(closestItem.textContent.trim(), 10);
  }
}



function addPadding(targetDiv) {

  const paddingTop = document.createElement('div');

  paddingTop.className = 'scroll-item';
  paddingTop.style.visibility = 'hidden'; // Invisible

  targetDiv.prepend(paddingTop);

  const paddingBottom = document.createElement('div');

  paddingBottom.className = 'scroll-item';
  paddingBottom.style.visibility = 'hidden'; // Invisible

  targetDiv.append(paddingBottom);
}

for (let i = 0; i < months.length; i++) {

  const monthItem = document.createElement('div');

  monthItem.className = 'scroll-item'
  monthItem.textContent = months[i];
  monthsDisplay.appendChild(monthItem);
}

addPadding(monthsDisplay)

for (let i = 1900; i < 2050 + 1; i++) {

  const yearItem = document.createElement('div')

  yearItem.className = 'scroll-item';
  yearItem.textContent = i;
  yearsDisplay.appendChild(yearItem);
}

addPadding(yearsDisplay)

const defaultMonth = today.getMonth();
const defaultYear = today.getFullYear();

updateDays(defaultYear, defaultMonth + 1);

function updateDays(year, month) {

  const lastDay = getDate(lastDayOfMonth(new Date(year, month - 1)));

  let dayToSelect = selectedDay || 1;

  if (dayToSelect > lastDay) {
    dayToSelect = lastDay;
  }

  daysDisplay.innerHTML = ""; // Clear existing days

  for (let i = 1; i <= lastDay; i++) {
    const dayItem = document.createElement('div');

    dayItem.className = 'scroll-item';
    dayItem.textContent = i;

    if (i === dayToSelect) {

      dayItem.classList.add('selected');

      setTimeout(() => {
        dayItem.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 0);
    }

    daysDisplay.appendChild(dayItem);
  }

  addPadding(daysDisplay);

  selectedDay = dayToSelect;
}

const monthsColumn = document.getElementById("month-column");
const yearsColumn = document.getElementById("year-column");
const daysColumn = document.getElementById("day-column")

monthsColumn.addEventListener('scroll', () => {
  selectedMonth = selectCenter(monthsColumn);
  if (selectedYear) updateDays(selectedYear, selectedMonth);
});

yearsColumn.addEventListener('scroll', () => {
  selectedYear = selectCenter(yearsColumn);
  if (selectedMonth) updateDays(selectedYear, selectedMonth);
});

daysColumn.addEventListener('scroll', () => {
  selectedDay = selectCenter(daysColumn);
});

function scrollToValue(container, value, behavior) {

  const items = container.querySelectorAll(".scroll-item");

  let foundItem = null;

  for (const item of items) {

    item.classList.remove("selected");

    if (item.textContent.trim() == value) {
      foundItem = item;
      item.classList.add("selected");
    }
  }

  if (foundItem) {

    setTimeout(() => {
      foundItem.scrollIntoView({ block: "center", behavior: behavior });
    }, 0);
    return true;
  }

  return false;
}

function setDateToday() {
  
  selectedYear = today.getFullYear();
  selectedMonth = today.getMonth();

  scrollToValue(yearsColumn, selectedYear);
  scrollToValue(monthsColumn, months[selectedMonth]);

  setTimeout(() => {

    selectedDay = today.getDate();

    scrollToValue(daysDisplay, selectedDay);
  }, 10);

  cSelectedDate = today;
}
setDateToday();

function setCalToday() {
  cYear = today.getFullYear();
  cMonth = today.getMonth();
  
  document.getElementById("calYear").innerHTML = cYear;
  document.getElementById("calMonth").innerHTML = months[cMonth];
  
  updateCDays();
}

let cYear = today.getFullYear();
let cMonth = today.getMonth();

document.getElementById("calYear").innerHTML = cYear;
document.getElementById("calMonth").innerHTML = months[cMonth];

function prevYear() {
  cYear --;
  document.getElementById("calYear").innerHTML = cYear;
  updateCDays();
}

function nextYear() {
  cYear ++;
  document.getElementById("calYear").innerHTML = cYear;
  updateCDays();
}

function prevMonth(){
  cMonth --;
  if (cMonth < 0){
    cMonth = 11;
    cYear --;
    document.getElementById("calYear").innerHTML =cYear;
  }
  document.getElementById("calMonth").innerHTML = months[cMonth];
  updateCDays();
}

function nextMonth(){
  cMonth ++;
  if (cMonth > 11){
    cMonth = 0;
    cYear ++;
    document.getElementById("calYear").innerHTML =cYear;
  }
  document.getElementById("calMonth").innerHTML = months[cMonth];
  updateCDays();
}

function updateCDays(){
  let clastDay = getDate(lastDayOfMonth(new Date(cYear, cMonth)));
  calDays.innerHTML = "";

  for (let i = 1; i < clastDay + 1; i++) {
    const calDay = document.createElement('div');
    calDay.textContent = i;
    calDay.className = "date-item";

    if (
      cSelectedDate &&
      cSelectedDate.getFullYear() === cYear &&
      cSelectedDate.getMonth() === cMonth &&
      cSelectedDate.getDate() === i
    ) {
      calDay.classList.add('selected-date');
    }

    calDays.appendChild(calDay);
  

  calDay.addEventListener('click', function() {

    document.querySelectorAll('.date-item').forEach(item => {
      item.classList.remove('selected-date');
    });

    this.classList.add('selected-date');
    
    selectedDay = i;
    selectedMonth = cMonth;
    selectedYear = cYear;

    cSelectedDate = new Date(selectedYear, selectedMonth, selectedDay);
  });

  calDays.appendChild(calDay);
}


  const firstDay = 7 - getDay(new Date(cYear, cMonth, 1))
  for(let i = 0; i < firstDay; i++){
    const padding = document.createElement('div');
    padding.style.visibility = 'hidden';
    calDays.prepend(padding);
  }
}

updateCDays();

function clickScroll(thisDiv) {
  let isDown = false;
  let startY;
  let scrollY;
  let scrollSpeed = 1; // Adjust this value to control scroll sensitivity

  function disableSnap() {
    thisDiv.style.scrollSnapType = 'none';
  }
  
  function enableSnap() {
    thisDiv.style.scrollSnapType = 'y mandatory';
    
    // When snapping is re-enabled, update the selected value
    if (thisDiv.id === "month-column") {
      selectedMonth = selectCenter(thisDiv);
      if (selectedYear) updateDays(selectedYear, selectedMonth);
    } else if (thisDiv.id === "year-column") {
      selectedYear = selectCenter(thisDiv);
      if (selectedMonth) updateDays(selectedYear, selectedMonth);
    } else if (thisDiv.id === "day-column") {
      selectedDay = selectCenter(thisDiv);
    }
  }
  
  // Handle mousedown on the div
  thisDiv.addEventListener('mousedown', (e) => {
    isDown = true;
    thisDiv.classList.add('active');
    startY = e.pageY - thisDiv.offsetTop;
    scrollY = thisDiv.scrollTop;
    disableSnap();
    
    // Add event listeners to document for mouse movement and release
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  });
  
  // Remove the mouseleave handler as we'll handle scrolling globally
  
  // Handle document-wide mouseup
  function handleMouseUp() {
    if (!isDown) return;
    
    isDown = false;
    thisDiv.classList.remove('active');
    enableSnap();
    
    // Clean up global event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }
  
  // Handle document-wide mousemove
  function handleMouseMove(e) {
    if (!isDown) return;
    
    e.preventDefault();
    const y = e.pageY;
    
    // Calculate the distance from the initial click
    const distanceFromStart = y - (thisDiv.getBoundingClientRect().top + startY);
    
    // Apply scrolling with the calculated distance
    thisDiv.scrollTop = scrollY - distanceFromStart * scrollSpeed;
  }
}

// Apply to all scroll columns
clickScroll(monthsColumn);
clickScroll(daysColumn);
clickScroll(yearsColumn);