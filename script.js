let Allfilters = document.querySelectorAll(".filter div");
let grid = document.querySelector(".grid");
let modalVisible = false;
let uid = new ShortUniqueId();
let modal_container_filter = document.querySelectorAll(
  ".modal-container .filter-area div"
);
let writingArea = document.querySelector(".writing-area");
let addBtn = document.querySelector(".add");
let body = document.querySelector("body");
let colors = {
  pink: "#d595aa",
  black: "black",
  green: "#91e6c7",
  blue: "#5ecdde",
};

let colorClasses = ["pink", "blue", "green", "black"];

// Initialization // Local Storage
if (!localStorage.getItem("tasks")) {
  localStorage.setItem("tasks", JSON.stringify([]));
}

// for grid color
for (let i = 0; i < Allfilters.length; i++) {
  Allfilters[i].addEventListener("click", function (e) {

    if(e.currentTarget.parentElement.classList.contains("selected-filter")){
      e.currentTarget.parentElement.classList.remove("selected-filter");
      loadTasks();
    }
    else{
      let color = e.currentTarget.classList[0].split("-")[0];
      e.currentTarget.parentElement.classList.add("selected-filter");
      loadTasks(color);
    }
  });
}

// for ticket color
for (let i = 0; i < modal_container_filter.length; i++) {
  modal_container_filter[i].addEventListener("click", function (e) {
    let color = e.currentTarget.classList[1];
    writingArea.style.backgroundColor = colors[color];
  });
}

let deleteState = false;
let deleteBtn = document.querySelector(".delete");
deleteBtn.addEventListener("click", function (e) {
  if (deleteState) {
    deleteState = false;
    e.currentTarget.classList.remove("deleteState");
  } else {
    deleteState = true;
    e.currentTarget.classList.add("deleteState");
  }
});

// Add button
addBtn.addEventListener("click", function () {
  if (modalVisible) return;

  if (deleteBtn.classList.contains("deleteState")) {
    deleteState = false;
    deleteBtn.classList.remove("deleteState");
  }

  let modal = document.createElement("div");
  modal.classList.add("modal-container");
  modal.setAttribute("click-first", true);
  modal.innerHTML = `<div class="writing-area" contenteditable> Enter your Task</div>
  <div class="filter-area">
  <div class="modal-filter pink"></div>
  <div class="modal-filter blue"></div>
  <div class="modal-filter green"></div>
  <div class="modal-filter black active-modal-filter"></div>
  </div>`;

  let Allmodalfilter = modal.querySelectorAll(".modal-filter");

  for (let i = 0; i < Allmodalfilter.length; i++) {
    Allmodalfilter[i].addEventListener("click", function (e) {
      for (let j = 0; j < Allmodalfilter.length; j++) {
        Allmodalfilter[j].classList.remove("active-modal-filter");
      }
      e.currentTarget.classList.add("active-modal-filter");
    });
  }

  let wa = modal.querySelector(".writing-area");
  wa.addEventListener("click", function () {
    if (modal.getAttribute("click-first") == "true") {
      wa.innerHTML = "";
      modal.setAttribute("click-first", false);
    }
  });

  wa.addEventListener("keypress", function (e) {
    if (e.key == "Enter") {
      let task = e.currentTarget.innerText;
      let selectedmodalfilter = document.querySelector(".active-modal-filter");
      let color = selectedmodalfilter.classList[1];
      let id = uid();
      let ticket = document.createElement("div");
      ticket.classList.add("ticket");
      ticket.innerHTML = `<div class="ticket-color ${color}"></div>
      <div class="ticket-id">#${id}</div>
      <div class="ticket-box" contenteditable>
        ${task}
      </div>
    </div>`;

      SaveTicketInLocalStorage(id, color, task);

      let ticketWritingArea = ticket.querySelector(".ticket-box");
      ticketWritingArea.addEventListener("input", ticketWritingAreaHandler);

      ticket.addEventListener("click", function (e) {
        if (deleteState) {
          let id = e.currentTarget
            .querySelector(".ticket-id")
            .innerText.split("#")[1];
          let taskArr = JSON.parse(localStorage.getItem("tasks"));

          // vo sare object dede bas vo object mat dio jiski
          // id upar jo id nikali h uske barabar ho
          taskArr = taskArr.filter(function (el) {
            return el.id != id;
          });

          localStorage.setItem("tasks", JSON.stringify(taskArr));

          e.currentTarget.remove();
        }
      });

      let ticketColorDiv = ticket.querySelector(".ticket-color");
      ticketColorDiv.addEventListener("click", ticketColorHandler);

      grid.appendChild(ticket);
      modal.remove();
      modalVisible = false;
    }
  });
  body.appendChild(modal);
  modalVisible = true;
});

function SaveTicketInLocalStorage(id, color, task) {
  let requiredObj = { id, color, task };
  let taskArr = JSON.parse(localStorage.getItem("tasks"));
  taskArr.push(requiredObj);
  localStorage.setItem("tasks", JSON.stringify(taskArr));
}

function ticketColorHandler(e) {
  let id = e.currentTarget.parentElement
    .querySelector(".ticket-id")
    .innerText.split("#")[1];
  let taskArr = JSON.parse(localStorage.getItem("tasks"));
  let reqIndex = -1;
  for (let i = 0; i < taskArr.length; i++) {
    if (taskArr[i].id == id) {
      reqIndex = i;
      break;
    }
  }

  let currColor = e.currentTarget.classList[1];
  let index = colorClasses.indexOf(currColor);
  index++;
  index = index % 4;
  e.currentTarget.classList.remove(currColor);
  e.currentTarget.classList.add(colorClasses[index]);

  taskArr[reqIndex].color = colorClasses[index];
  localStorage.setItem("tasks", JSON.stringify(taskArr));
}

function ticketWritingAreaHandler(e) {
  let id = e.currentTarget.parentElement
    .querySelector(".ticket-id")
    .innerText.split("#")[1];
  let taskArr = JSON.parse(localStorage.getItem("tasks"));
  let reqIndex = -1;
  for (let i = 0; i < taskArr.length; i++) {
    if (taskArr[i].id == id) {
      reqIndex = i;
      break;
    }
  }

  taskArr[reqIndex].task = e.currentTarget.innerText;
  localStorage.setItem("tasks", JSON.stringify(taskArr));
}

function loadTasks(passedColor) {

  let allTickets = document.querySelectorAll(".ticket");
  for(let t = 0; t < allTickets.length; t++)  allTickets[t].remove();



  let taskArr = JSON.parse(localStorage.getItem("tasks"));
  for (let i = 0; i < taskArr.length; i++) {
    let id = taskArr[i].id;
    let color = taskArr[i].color;
    let taskValue = taskArr[i].task;

    if(passedColor){
      if(passedColor != color)  continue;
    }

    let ticket = document.createElement("div");
    ticket.classList.add("ticket");
    ticket.innerHTML = `<div class="ticket-color ${color}"></div>
      <div class="ticket-id">#${id}</div>
      <div class="ticket-box" contenteditable>
        ${taskValue}
      </div>
    </div>`;

    let ticketWritingArea = ticket.querySelector(".ticket-box");
    ticketWritingArea.addEventListener("input", ticketWritingAreaHandler);

    let ticketColorDiv = ticket.querySelector(".ticket-color");
    ticketColorDiv.addEventListener("click", ticketColorHandler);

    ticket.addEventListener("click", function (e) {
      if (deleteState) {
        let id = e.currentTarget
          .querySelector(".ticket-id")
          .innerText.split("#")[1];
        let taskArr = JSON.parse(localStorage.getItem("tasks"));

        // vo sare object dede bas vo object mat dio jiski
        // id upar jo id nikali h uske barabar ho
        taskArr = taskArr.filter(function (el) {
          return el.id != id;
        });

        localStorage.setItem("tasks", JSON.stringify(taskArr));

        e.currentTarget.remove();
      }
    });
    grid.appendChild(ticket);
  }
}

loadTasks();