// (i should probably use jquery but it has hideous syntax)
//  TODO use setTimeout loop to add default tasks every midnight

if (localStorage.getItem("tasks") == null) {
    const defaultTasks = ["eat a fruit", "do 30 minutes of good work"];
    localStorage.setItem("tasks", JSON.stringify(defaultTasks));
}
const tasks = JSON.parse(localStorage.getItem("tasks"));

const tasksDiv = document.getElementById("tasks-div");
const inputTextarea = document.getElementById("input-textarea");

function renderTask(asString) {
    const child = document.createElement('div');
    child.classList.add("task");
    child.innerHTML = "<p>"+asString+"</p><button class='exit-button'>x</button>";
    tasksDiv.appendChild(child);
}


const len = tasks.length;
for (let i = 0; i < len; i++) {
    renderTask(tasks[i]);
}

// allow for addition of tasks: put to local storage & re-render
inputTextarea.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
	renderTask(inputTextarea.value);
	tasks.push(inputTextarea.value);
	localStorage.setItem("tasks", JSON.stringify(tasks));
	inputTextarea.value = "";
    }
});

// listen for clicks on exit buttons
const exits = document.getElementsByClassName("exit-button");
for (let i = 0; i < exits.length; i++) {
    exits[i].addEventListener('click', function () {
	exits[i].parentElement.remove();
	tasks.splice(i, 1);
	localStorage.setItem("tasks", JSON.stringify(tasks));
    });
};

