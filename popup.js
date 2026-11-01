// (i should probably use jquery but it has hideous syntax)
//  TODO use setTimeout loop to add default tasks every midnight
const MAX_TASKS = 16;

if (localStorage.getItem("tasks") == null) {
    const defaultTasks = ["eat a fruit", "do 30 minutes of good work"];
    localStorage.setItem("tasks", JSON.stringify(defaultTasks));
}
let tasks = JSON.parse(localStorage.getItem("tasks"));

const tasksDiv = document.getElementById("tasks-div");
const inputTextarea = document.getElementById("input-textarea");

function renderAll() {
    // render all tasks
    for (let i = 0; i < tasks.length; i++) {
	renderTask(tasks[i]);
    }
}

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
	if (tasks.length <= MAX_TASKS) {
	    inputTextarea.disabled=false;
 	}
    });

    child.append(p, button);
    tasksDiv.appendChild(child);
};


renderAll();

// allow for addition of tasks: put to local storage & re-render
inputTextarea.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
	e.preventDefault(); // avoid a stray newline left in the textbox
	const text = inputTextarea.value.trim();
	if (text === "") {
	    inputTextarea.value = "";
	    return;
	};
	// handle commands
	if (text[0] === '&') {
	    inputTextarea.value = "";
	    parseCmd(text);
	    return;
	};
	inputTextarea.value = "";
	renderTask(text);
	tasks.push(text);
	localStorage.setItem("tasks", JSON.stringify(tasks));
	if (tasks.length > MAX_TASKS) {
	    inputTextarea.disabled=true;
        }
    }
});

// handles commands (strings starting with '&'): if comand executes
// successfully, return true; else return false
//
// TODO messy duplicate logic; fix! also validate parseInt results, etc.
function parseCmd(text) {
    const asArr = text.split(/\s+/);
    const cmd = asArr[0];
    const args = asArr.slice(1, asArr.length);
    switch (cmd) {
	case "&top": {
	    if (args.length <= 0) {
		return false;
	    }
	    let idx = parseInt(args[0]);
	    if (idx < 0 || idx >= tasks.length) {
		return false;
	    }
	    let tasksNew = [tasks[idx], ...tasks.slice(0, idx), ...tasks.slice(idx + 1),];
	    tasks = tasksNew;
	    localStorage.setItem("tasks", JSON.stringify(tasksNew));
	    tasksDiv.innerHTML = "";
	    renderAll();
	    break;
	}
	case "&del": {
	    if (args.length <= 0) {
		return false;
	    }
	    let idx = parseInt(args[0]);
            if (idx < 0 || idx >= tasks.length) {
                return false;
            }
            let tasksNew = [...tasks.slice(0, idx), ...tasks.slice(idx + 1)];
            tasks = tasksNew; 
            localStorage.setItem("tasks", JSON.stringify(tasksNew));
            tasksDiv.innerHTML = "";
            renderAll();
            break;
	}
	case "&count": {
	    let count = (tasks.length).toString();
	    inputTextarea.value = count;
	    console.log(count);
	    break;
	}
	default:
    };
    return true;
};
