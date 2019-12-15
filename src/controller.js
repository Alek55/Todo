class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        view.on('create-desc', this.createDesk.bind(this));

        // view.on('toggle', this.toggleTodo.bind(this));
        // view.on('edit', this.editTodo.bind(this));
        // view.on('remove', this.removeTodo.bind(this));

        view.show(model.state);
    }

    createDesk(param) { // {title, color}
        this.view.addDesc(param);
        this.view.on('add', this.addTodo.bind(this));
    }

    addTodo(param) { // {hash, title}
        // const todo = this.model.addItem({
        //     id: Date.now(),
        //     title,
        //     completed: false
        // });
        param.completed = false;
        this.view.addItem(param);
    }

    toggleTodo({id, completed}) {
        const todo = this.model.updateItem(id, {completed});
        this.view.toggleItem(todo);
    }

    editTodo({id, title}) {
        const todo = this.model.updateItem(id, {title});

        this.view.editItem(todo);
    }

    removeTodo(id) {
        this.model.removeItem(id); //удаляем из модели
        this.view.removeItem(id); //теперь удаляем из представления
    }
}

export default Controller;