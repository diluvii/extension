// (i should probably use jquery but it has hideous syntax)
//  TODO use setTimeout loop to add default tasks every midnight

const MAX_TASKS = 16;

if (localStorage.getItem("tasks") == null) {
    const defaultTasks = ["eat a fruit", "do 30 minutes of good work"];
    localStorage.setItem("tasks", JSON.stringify(defaultTasks));
}
const tasks = JSON.parse(localStorage.getItem("tasks"));
let num = tasks.length;

const tasksDiv = document.getElementById("tasks-div");
const inputTextarea = document.getElementById("input-textarea");

// render an additional task: create a div containing the task + an exit
// button; add an event listener on the exit button to attend to clicks
// (upon which we delete the task)
function renderTask(asString) {
    const child = document.createElement('div');
    child.classList.add("task");

    const p = document.createElement('p');
    p.innerHTML = asString;

    const button = document.createElement('button');
    button.classList.add("exit-button");
    button.innerHTML = "x";
    button.addEventListener("click", function () {
	const index = Array.from(tasksDiv.children).indexOf(child);
	child.remove();
	tasks.splice(index, 1);
	localStorage.setItem("tasks", JSON.stringify(tasks));
	num--;
	if (num <= MAX_TASKS) {
	    inputTextarea.disabled=false;
 	}
    });

    child.append(p, button);
    tasksDiv.appendChild(child);
};


const len = tasks.length;
for (let i = 0; i < len; i++) {
    renderTask(tasks[i]);
};

// allow for addition of tasks: put to local storage & re-render
inputTextarea.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
	e.preventDefault(); // avoid a stray newline left in the textbox
	const text = inputTextarea.value.trim();
	if (text === "") {
	    inputTextarea.value = "";
	    return;
	};
	renderTask(text);
	tasks.push(text);
	localStorage.setItem("tasks", JSON.stringify(tasks));
	num++;
	if (num > MAX_TASKS) {
	    inputTextarea.disabled=true;
        }
	inputTextarea.value = "";
    }
});
