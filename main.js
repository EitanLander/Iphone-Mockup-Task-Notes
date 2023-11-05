// Enter the script to a strict mode :

"use strict";

//Display data on load and display all

displayTasks();

// Function For The Validation Error Alert :

function showError(title, elementBox) {
  Swal.fire({
    showClass: {
      popup: "animate__animated animate__shakeX animate__faster",
    },
    hideClass: {
      popup: "animate__animated animate__flipOutX animate__faster",
    },
    title: title,
    showConfirmButton: false,
    showDenyButton: true,
    denyButtonText: "I Got it",
    icon: "error",
  });
  elementBox.style.background = "rgba(255, 0, 0, 0.39)";
  elementBox.focus();
  elementBox.addEventListener("input", function () {
    if (elementBox.value !== "") {
      elementBox.style.background = "";
    }
  });
}

// Function that save data and insert it into Local Storage :

function save() {
  event.preventDefault();

  // Take DOM Elements
  const descriptionBox = document.getElementById("descriptionBox");
  const timeBox = document.getElementById("timeBox");
  const titleBox = document.getElementById("titleBox");

  const description = descriptionBox.value;
  const time = timeBox.value;
  const title = titleBox.value;

  // Get The Current Time :

  const selectedDate = new Date(timeBox.value);
  const currentDate = new Date();

  // Validation

  // Title Validation And Error Message :

  if (titleBox.value === "") {
    showError("Please fill the task title 🙄", titleBox);
    return;
  }


  // Description Validation And Error Message :

  if (descriptionBox.value === "") {
    showError("Please fill the task description 🙄", descriptionBox);
    return;
  }

  // Time Box Validation And Error Message :

  if (timeBox.value === "") {
    showError("Please Fill The Date & Time For Task 🙄", timeBox);
    return;
  }

  // Date Box Validation And Error Message :

  if (selectedDate < currentDate) {
    timeBox.value === "";
    showError("Please select a future date for the task 🙄", timeBox);
    return;
  }

  // All Task Properties
  const task = { title, description, time };

  // Take data from storage:
  let json = localStorage.getItem("tasks");
  const tasks = json ? JSON.parse(json) : [];

  // Add new task:
  tasks.push(task);

  // Save back:

  json = JSON.stringify(tasks);
  localStorage.setItem("tasks", json);

  titleBox.value = "";
  descriptionBox.value = "";
  timeBox.value = "";

  displayTasks();

  // Apply animation to the newly added note only if it's not a refresh or delete

  const noteDisplay = document.getElementById("noteDisplay");
  const newNote = noteDisplay.lastElementChild;

  if (newNote) {
    newNote.style.animation = "fadeIn 1.5s ease-in-out";
  }

  titleBox.focus();
}

function displayTasks() {
  // Take data from storage:

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  let html = "";

  for (const item of tasks) {
    const title = item.title;
    const description = item.description;
    const time = new Date(item.time);

    // Design a nice look for the date in the note area:

    const formattedDate = time.toLocaleDateString("he-IL", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const formattedTime = time.toLocaleTimeString("he-IL", {
      hour: "numeric",
      minute: "numeric",
    });

    // Create notes :
    html += `
        <div class="task">
             <img id="noteImage" src="assets/images/note.png" alt="Note Image">
                 <div ><button class="removeIcon" onclick="deleteTask(${tasks.indexOf(
                   item
                 )})">
<span id="bootIcon" class="bi bi-x"></span></button></div>
                 <div class="title">${title}</div>
                 <div id="noteArea" class="noteArea">${description}</div>
                 <div class="date">${formattedDate}</div>
                 <div class="time">${formattedTime}</div>
        </div>`;
  }

  const noteDisplay = document.getElementById("noteDisplay");
  noteDisplay.innerHTML = html;
}

// Delete notes from the screen and the local storage :

function deleteTask(index) {
  let json = localStorage.getItem("tasks");
  const tasks = JSON.parse(json);

  if (!tasks || index < 0 || index >= tasks.length) return;

  tasks.splice(index, 1);

  json = JSON.stringify(tasks);
  localStorage.setItem("tasks", json);

  displayTasks();
}
