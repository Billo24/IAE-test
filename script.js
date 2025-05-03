const { lastDayOfMonth, getDate } = dateFns;

getDate
const questions = [
  "What is your date of birth?",
  "When did/will you graduate university?",
  "When did you last attend a live event?",
  "When did you last travel somewhere far?"
];

let qNo = 0;
const input = document.querySelector("input[type='date']");
const button = document.querySelector("button");
const questionDisplay = document.getElementById("question");


const months = ["Jan", "Feb", "Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const monthsDisplay = document.getElementById("months");
const yearsDisplay = document.getElementById("years");
const daysDisplay = document.getElementById("days");

let selectedMonth;
let selectedYear;
let selectedDay;

document.getElementById("question").innerHTML = questions[qNo];

function dateEnter() {
  if (input.value === "") {
    alert("Please pick a valid date before continuing!");
    return;
  }

  qNo++;

  if (qNo < questions.length) {
    questionDisplay.innerHTML = questions[qNo];
    input.value = "";
  } else {
    questionDisplay.innerHTML = "Thank you for participating in this quiz!";
    input.classList.add("hidden");
    button.classList.add("hidden");
    input.disabled = true;
  }
}

function selectCenter(column){
  const columnRect = column.getBoundingClientRect();
  const centerY = columnRect.top + columnRect.height / 2;

  let closestItem = null;
  let closestDistance = Infinity; 

  const itemList = column.querySelectorAll(".scroll-item");
  for(let i = 0; i < itemList.length; i++){
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
    }else{
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

for (let i =0; i < months.length; i++){
  const monthItem = document.createElement('div');
  monthItem.className = 'scroll-item'
  monthItem.textContent = months[i];
  monthsDisplay.appendChild(monthItem);
}

addPadding(monthsDisplay)

for (let i = 1900; i < 2025 + 1; i++){
  const yearItem = document.createElement('div')
  yearItem.className = 'scroll-item';
  yearItem.textContent = i;
  yearsDisplay.appendChild(yearItem);
}

addPadding(yearsDisplay)

const today = new Date();
const defaultMonth = today.getMonth();
const defaultYear = today.getFullYear();
updateDays(defaultYear, defaultMonth + 1);

function updateDays(year, month) {
  const lastDay = getDate(lastDayOfMonth(new Date(year, month - 1)));

  // Fallback to 1 if no day is selected
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
      // Scroll this item into center view
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

function scrollToValue(container, value) {
  const items = container.querySelectorAll(".scroll-item");
  for (const item of items) {
    item.classList.remove("selected");
    if (item.textContent.trim() == value) {
      item.classList.add("selected");
      item.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
  }
}

scrollToValue(yearsColumn, today.getFullYear());
scrollToValue(monthsColumn, months[today.getMonth()]);
requestAnimationFrame(() => {
  scrollToValue(daysDisplay, 10);
});
console.log(today)
console.log(today.getDate())
console.log(daysColumn)
console.log(daysDisplay)