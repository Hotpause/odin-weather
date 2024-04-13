import './style.css';
import project from './project';
import todo from './todo';

console.log("Hello Worlddd");




let currentproject;
const projectsarr = [];
const projectdiv = document.querySelector(".projects");
const inputfield = document.querySelector(".projectinput");
const submitbutton = document.querySelector(".submitbutton");
const todoButton = document.querySelector(".todo_buttons");
const todosContainer = document.querySelector(".todos");

function saveToLocalStorage() {
    localStorage.setItem('projects', JSON.stringify(projectsarr));
}

// Function to load projects (and todos) from localStorage
function loadFromLocalStorage() {
    try {
        const storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
            const parsedProjects = JSON.parse(storedProjects);
            // Iterate over stored projects and recreate them
            parsedProjects.forEach(storedProject => {
                const newProject = new project(storedProject.name);
                storedProject.todos.forEach(storedTodo => {
                    const newTodo = new todo(storedTodo.title, storedTodo.description, storedTodo.duedate, storedTodo.priority);
                    newProject.addtodo(newTodo);
                });
                projectsarr.push(newProject);
            });
        } else {
            createprojectfromname("test");
            const testProject = projectsarr.find(proj => proj.name === "test");
            if (testProject) {
                const dummyTodo1 = new todo("Dummy Todo 1", "Description for Dummy Todo 1", "2024-04-15", 1);
                const dummyTodo2 = new todo("Dummy Todo 2", "Description for Dummy Todo 2", "2024-04-16", 2);
                testProject.addtodo(dummyTodo1);
                testProject.addtodo(dummyTodo2);
            }
        }
    } catch (error) {
        console.error('Error loading projects from localStorage:', error);
        // Handle the error here, e.g., show a message to the user or fallback to default behavior
    }
}

loadFromLocalStorage();
renderProjects();



function renderProjects() {
    // Clear existing project list
    projectdiv.innerHTML = "";

    // Render each project from the stored data
    projectsarr.forEach(project => {
        const projecttab = document.createElement("div");
        projecttab.classList.add("projecttab");

        const projectnametab = document.createElement("h2");
        projectnametab.classList.add("projectclick");
        projectnametab.textContent = project.name;

        projectnametab.addEventListener("click", () => {
            // Remove highlight from previously selected project
            const previousSelectedProject = document.querySelector(".selected");
            if (previousSelectedProject) {
                previousSelectedProject.classList.remove("selected");
            }
            // Highlight the clicked project
            projectnametab.classList.add("selected");
        });

        const deletebuttonpj = document.createElement("button");
        deletebuttonpj.textContent = "DELETE";
        deletebuttonpj.addEventListener("click", () => {
            deleteproject(project); // Call a function to handle delete operation
        });

        projecttab.appendChild(projectnametab);
        projecttab.appendChild(deletebuttonpj);
        projectdiv.appendChild(projecttab);
    });

    selectproject(); // Reinitialize event listeners for project clicks
}


function updateLocalStorage() {
    saveToLocalStorage();
}


function createprojectfromname(nameofproject) {
    if (nameofproject) {
        const existingProject = projectsarr.find(project => project.name === nameofproject);
        if (existingProject) {
            alert("A project with this name already exists. Please choose a different name.");
            return; // Exit the function early if the project already exists
        }

        const projecttab = document.createElement("div");
        projecttab.classList.add("projecttab");

        projectdiv.appendChild(projecttab);

        const newproject = new project(nameofproject);
        projectsarr.push(newproject);
        console.log("New Project:", newproject); // Log the new project

        const projectnametab = document.createElement("h2");
        projectnametab.classList.add("projectclick", "selected"); // Add the "selected" class
        projectnametab.textContent = nameofproject;

        const deletebuttonpj = document.createElement("button");
        deletebuttonpj.textContent = "DELETE"
        deletebuttonpj.addEventListener("click", () => {
            deleteproject(project); // Call a function to handle delete operation
        });

        projecttab.appendChild(projectnametab);
        projecttab.appendChild(deletebuttonpj);

        const allProjectTabs = document.querySelectorAll('.projectclick');
        allProjectTabs.forEach(tab => tab.classList.remove('selected'));

        // Add "selected" class to the newly created project tab
        projectnametab.classList.add('selected');

        // Update the current project
        currentproject = newproject;
        console.log("Current Project:", currentproject); // Log the current project

        selectproject();
        updateLocalStorage();
        renderProjects();
    }
}

function createNewProject() {
    submitbutton.addEventListener("click", () => {

        const projectname = inputfield.value.trim();
        createprojectfromname(projectname);
    });
}

function deleteproject(projectToDelete) {
    const index = projectsarr.indexOf(projectToDelete);
    if (index !== -1) {
        projectsarr.splice(index, 1);
        todosContainer.innerHTML = "";
        // Update the UI to reflect changes
        renderProjects();
        updateLocalStorage();
    }
}

function selectproject() {

    const projectclicks = document.querySelectorAll(".projectclick");
    projectclicks.forEach(projectclick => {
        projectclick.addEventListener("click", () => {
            const projectname = projectclick.textContent; // Store the name of the clicked project
            currentproject = projectsarr.find(proj => proj.name === projectname);
            console.log("Current Project:", currentproject); // For debugging purposes
            displayTodoOfProject(currentproject);
        });
    });





}

function displayTodoOfProject(projectToBeShown) {

    todosContainer.innerHTML = "";

    projectToBeShown.todos.forEach(todo => {
        // Create HTML elements for each todo and append them to the todosContainer
        createtodoelement(todo);
    });


    // input = project object
    // empty the todos div
    // then append the divs in project there

    // 1.loop through todos of currnt project
    // 2. createtodoelement(for each todo)
}

function createtodoform() {
    console.log("Function createtodoform is called.");
    const existingform = document.querySelector(".todo-form")
    if (!existingform) {
        console.log("Function entes the if barrier");
        const form1 = document.createElement("form");
        form1.classList.add("todo-form");
        todosContainer.insertBefore(form1, todosContainer.firstChild);

        form1.style.border = "2px solid red"; // Add a red border to the form
        form1.style.margin = "20px"; // Add some margin to the form

        const titleinput = document.createElement("input");
        titleinput.type = "text";
        titleinput.placeholder = "todo title"
        form1.appendChild(titleinput);

        const descriptioninput = document.createElement("input");
        descriptioninput.type = "text";
        descriptioninput.placeholder = "todo desc"
        form1.appendChild(descriptioninput);

        const dateinput = document.createElement("input");
        dateinput.type = "date";
        form1.appendChild(dateinput);

        const priorityinput = document.createElement("input");
        priorityinput.type = "number";
        priorityinput.placeholder = "todo priority"
        form1.appendChild(priorityinput);

        const submitbuttonform = document.createElement("button");
        submitbuttonform.type = "submit"
        submitbuttonform.textContent = "SUBMIT todo";
        form1.appendChild(submitbuttonform);

        form1.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent the default form submission behavior

            const title = titleinput.value.trim();
            const desc = descriptioninput.value.trim();
            const date = dateinput.value.trim();
            const priority = priorityinput.value.trim();

            if (title && desc && date && priority) {
                const newtodo = new todo(title, desc, date, priority);
                currentproject.addtodo(newtodo);
                createtodoelement(newtodo);
                form1.remove();
                updateLocalStorage();
            } else {
                alert("Please fill all fields");
            }
        });

    }
}

function createtodoelement(todo) {
    const todotab = document.createElement("div");
    todotab.classList.add("todotab");

    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Title:";
    titleLabel.style.fontWeight = "bold"; // Bold style for the label
    const title = document.createElement("div");
    title.textContent = todo.title;

    const descLabel = document.createElement("label");
    descLabel.textContent = "Description:";
    descLabel.style.fontWeight = "bold"; // Bold style for the label
    const description = document.createElement("div");
    description.textContent = todo.description;

    const dateLabel = document.createElement("label");
    dateLabel.textContent = "Due Date:";
    dateLabel.style.fontWeight = "bold"; // Bold style for the label
    const duedate = document.createElement("div");
    duedate.textContent = todo.duedate;

    const priorityLabel = document.createElement("label");
    priorityLabel.textContent = "Priority:";
    priorityLabel.style.fontWeight = "bold"; // Bold style for the label
    const priority = document.createElement("div");
    priority.textContent = todo.priority;

    const editbutton = document.createElement("button");
    editbutton.textContent = "edit";
    editbutton.addEventListener("click", () => {
        editTodo(todo); // Call a function to handle edit operation
    });

    const deletebutton = document.createElement("button");
    deletebutton.textContent = "delete"
    deletebutton.addEventListener("click", () => {
        deleteTodo(todo); // Call a function to handle delete operation
    });

    todotab.appendChild(titleLabel);
    todotab.appendChild(title);
    todotab.appendChild(descLabel);
    todotab.appendChild(description);
    todotab.appendChild(dateLabel);
    todotab.appendChild(duedate);
    todotab.appendChild(priorityLabel);
    todotab.appendChild(priority);
    todotab.appendChild(editbutton);
    todotab.appendChild(deletebutton);


    todosContainer.insertBefore(todotab, todosContainer.firstChild);

};

function editTodo(todo) {
    const editForm = document.createElement("form");
    editForm.classList.add("edit-form");

    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Title:";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = todo.title;
    editForm.appendChild(titleLabel);
    editForm.appendChild(titleInput);

    const descLabel = document.createElement("label");
    descLabel.textContent = "Description:";
    const descInput = document.createElement("input");
    descInput.type = "text";
    descInput.value = todo.description;
    editForm.appendChild(descLabel);
    editForm.appendChild(descInput);

    const dateLabel = document.createElement("label");
    dateLabel.textContent = "Due Date:";
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.value = todo.duedate;
    editForm.appendChild(dateLabel);
    editForm.appendChild(dateInput);

    const priorityLabel = document.createElement("label");
    priorityLabel.textContent = "Priority:";
    const priorityInput = document.createElement("input");
    priorityInput.type = "number";
    priorityInput.value = todo.priority;
    editForm.appendChild(priorityLabel);
    editForm.appendChild(priorityInput);

    const submitButton = document.createElement("button");
    submitButton.textContent = "Update";
    submitButton.addEventListener("click", (event) => {
        event.preventDefault();
        todo.title = titleInput.value;
        todo.description = descInput.value;
        todo.duedate = dateInput.value;
        todo.priority = priorityInput.value;
        // Update the UI to reflect changes
        displayTodoOfProject(currentproject);
        editForm.remove();
        updateLocalStorage();
    });
    editForm.appendChild(submitButton);

    todosContainer.appendChild(editForm);
}

function deleteTodo(todo) {
    const index = currentproject.todos.indexOf(todo);
    if (index !== -1) {
        currentproject.todos.splice(index, 1);
        // Update the UI to reflect changes
        displayTodoOfProject(currentproject);
        updateLocalStorage();
    }
}

todoButton.addEventListener("click", createtodoform);
console.log(todoButton);





createNewProject();
selectproject();





// Create Template Project with fake todos
// const templateProject = new project('Template Project');

// const todo1 = new todo('Task 1', 'Description for Task 1', '2024-04-10', 1);
// const todo2 = new todo('Task 2', 'Description for Task 2', '2024-04-11', 2);
// const todo3 = new todo('Task 3', 'Description for Task 3', '2024-04-12', 3);
// const todo4 = new todo('Task 4', 'Description for Task 4', '2024-04-13', 4);
// const todo5 = new todo('Task 5', 'Description for Task 5', '2024-04-14', 5);

// templateProject.addtodo(todo1);
// templateProject.addtodo(todo2);
// templateProject.addtodo(todo3);
// templateProject.addtodo(todo4);
// templateProject.addtodo(todo5);

// projectsarr.push(templateProject);





// const project1 = new project('ashu');
// const todo1 = new todo('milk', 'get milk', '', '1');
// project1.addtodo(todo1);

// console.log(project1);




