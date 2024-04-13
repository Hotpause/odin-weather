class project {

    constructor(name) {
        this.name = name;
        this.todos = []
    }

    addtodo(todo) {
        this.todos.push(todo);

    }
    removetodo(todo) {
        this.todos = this.todos.filter(t => t !== todo);
    }
}


export default project;








//f for cerating todo
//f for creating proeject
//f for adding todo to projet
//f for displaying all projects after adding new one
// f for displying all todo in project x
// f for displaying pop up for enteering to do detailes


// add notes to the current activated project or add project drop down menu and add to that