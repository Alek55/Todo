import {createElement, EventEmitter} from './helpers';

class View extends EventEmitter{
    constructor() {
        super(); //потому что наследуемся от EventEmitter. В классе EventEmitter все this со свойствами и метоами инициализировадисб и this внутри EventEmiiter будут отнаситься к нему. а все последюущие this к текущему классу View.

        this.desc = '#desc-';
        this.form  = '.todo-form';
        this.input = '.add-input';
        this.list = '.todo-list';
        this.createLink = document.getElementById('create-desc-link');
        this.deskWrap = document.getElementById('desk-wrap');

        this.createLink.addEventListener('click', this.handleAddDesc.bind(this));
    }

    createElement(todo) {
        const checkbox = createElement('input', {type: 'checkbox', className: 'checkbox', 'data-hash': todo.hash, checked: todo.completed ? 'checked' : ''});
        const label = createElement('label', {className: 'title'}, todo.title);
        const editInput = createElement('input', {type: 'text', className: 'textfield'});
        const editButton = createElement('button', {className: 'edit', 'data-hash': todo.hash}, 'Изменить');
        const deleteButton = createElement('button', {className: 'remove'}, 'Удалить');
        const item = createElement('li', {className: `todo-item${todo.completed ? ' completed' : ''}`, 'data-id': todo.id}, checkbox, label, editInput, editButton, deleteButton);

        return item;
        //return this.addEventListeners(item);
    }

    getUniqueID() {
        const d = +new Date();
        return `dqw${d}`;
    }

    createDesk(param) {
        const id = this.getUniqueID();

        const h1 = createElement('h1', {}, param.title);
        const header = createElement('header', {className: `header ${param.color}`, 'data-hash': id}, h1);
        const ul = createElement('ul', {className: 'todo-list'});
        const input = createElement('input', {className: 'add-input', type: 'text'});
        const button = createElement('button', {className: 'add-button', type: 'submit', 'data-hash': id}, 'Добавить');
        const form = createElement('form', {className: 'todo-form'}, input, button);
        const desc = createElement('div', {className: 'desc', id: `desc-${id}`}, header, ul, form);

        return {
            desc, id
        };
    }
    addDesc(param) {
        const descItem = this.createDesk(param);
        this.deskWrap.appendChild(descItem.desc);
        this.addEventHandler(descItem.id,'click', this.handleAdd);
    }

    addEventHandler(hash, ev, callback) {
        document.querySelector(`button[data-hash=${hash}]`).addEventListener(ev, callback.bind(this));
    }

    addEventListeners(listItem) {
        const checkbox = listItem.querySelector('.checkbox');
        const editButton = listItem.querySelector('button.edit');
        const removeButton = listItem.querySelector('button.remove');

        checkbox.addEventListener('change', this.handleToggle.bind(this));
        editButton.addEventListener('click', this.handleEdit.bind(this));
        removeButton.addEventListener('click', this.handleRemove.bind(this));

        return listItem;
    }

    handleAddDesc(event) {
        event.preventDefault();
        this.emit('create-desc', {title: 'Новая карточка', color: '#2399D5'});
    }

    handleAdd(event) {
        event.preventDefault();
        const hash = event.target.getAttribute('data-hash');
        const input_val = document.querySelector(`${this.desc+hash} ${this.input}`).value;
        if(!input_val) return alert('Введите название задачи');
        this.emit('add', {hash, title: input_val});
    }

    handleToggle({target}) {
        const listItem = target.parentNode;
        const id = listItem.getAttribute('data-id');
        const completed = target.checked;

        this.emit('toggle', {id, completed});
    }

    handleEdit({target}) {
        const listItem = target.parentNode;
        const id = listItem.getAttribute('data-id');
        const label = listItem.querySelector('.title');
        const input = listItem.querySelector('.textfield');
        const editButton = listItem.querySelector('button.edit');
        const title = input.value;
        const isEditing = listItem.classList.contains('editing');
        if(isEditing) {
            this.emit('edit', {id, title});
        }
        else {
            input.value = label.textContent;
            editButton.textContent = 'Сохранить';
            listItem.classList.add('editing');
        }
    }

    handleRemove({target}) {
        const listItem = target.parentNode;
        const id = listItem.getAttribute('data-id');

        this.emit('remove', id);
    }

    addItem(todo) {
        const listItem = this.createElement(todo);
        document.querySelector(`${this.desc+todo.hash} ${this.input}`).value = '';
        document.querySelector(`${this.desc+todo.hash} ${this.list}`).appendChild(listItem);
    }

    findListItem(id) {
        return this.list.querySelector(`[data-id="${id}"]`);
    }

    toggleItem(todo) {
        const listItem = this.findListItem(todo.id);
        const checkbox = listItem.querySelector('.checkbox');

        checkbox.checked = todo.completed;

        if(todo.completed) listItem.classList.add('completed');
        else listItem.classList.remove('completed');
    }

    editItem(todo) {
        const listItem = this.findListItem(todo.id);
        const label = listItem.querySelector('.title');
        const input = listItem.querySelector('.textfield');
        const editButton = listItem.querySelector('button.edit');

        label.textContent = todo.title;
        editButton.textContent = 'Изменить';
        listItem.classList.remove('editing');
    }

    removeItem(id) {
        const listItem = this.findListItem(id);
        this.list.removeChild(listItem);
    }

    show(todos) {
        // todos.forEach(todo => {
        //     const listItem = this.createElement(todo);
        //
        //     this.list.appendChild(listItem);
        // });
    }
}

export default View;