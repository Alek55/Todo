function createElement(tag, props, ...children) {
    const element = document.createElement(tag);

    Object.keys(props).forEach(key => {
        if(key.startsWith('data-')) {
            element.setAttribute(key, props[key]);
        }
        else {
            element[key] = props[key];
        }
    });

    children.forEach(child => {
        if(typeof child === 'string') {
            child = document.createTextNode(child);
        }
        element.appendChild(child);
    });

    return element;
}

class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(type, callback) { //подписка на событие - тип события и функция обработчик - складываем название событий и их функции вызова
        this.events[type] = this.events[type] || [];
        this.events[type].push(callback);
    }

    emit(type, arg) { //тип события, который необходимо запустить и доп данные - запускаем события с аргументами для функций вызовов
        if(this.events[type]) { //если есть что вызывать
            this.events[type].forEach(callback => callback(arg));
        }
    }
}

function save(data) {
    const string = JSON.stringify(data);
    localStorage.setItem('todos', string);
}

function load() {
    const string = localStorage.getItem('todos');
    const data = JSON.parse(string);
    return data;
}

export {createElement, EventEmitter, save, load};