let arr = [];
function showLoading() {
    $('.loading').style.display = 'flex'
}

function hideLoading() {
    $('.loading').style.display = 'none'
}

function $(selector) {
    return document.querySelector(selector);
}
const fetchData = () => {
    axios.get("https://63cbb569ea85515415140ab2.mockapi.io/api/todoMVC/blogs")
    .then((response) => {
        main(response.data)
    })
    .catch((err) => {
        console.log("co loi~")
    });
}
function li_activeItem(item) {
    const li = document.createElement('li')
    li.id = item.id
    const div = document.createElement('div')
    div.className = 'view'
    const cb = document.createElement('input')
    cb.type = 'checkbox'
    cb.className = 'toggle'
    const lb = document.createElement('label')
    lb.innerText = item.title
    const btn = document.createElement('button')
    btn.className = 'destroy'
    btn.id = item.id
    btn.onclick = function(e) {
        const id = e.target.id
        const res = axios.delete(`https://63cbb569ea85515415140ab2.mockapi.io/api/todoMVC/blogs/${id}`)
        .then((response) => {
            if (response.status == 200) {
                e.target.parentElement.parentElement.remove()
            }
        })
    }
    div.appendChild(cb)
    div.appendChild(lb)
    div.appendChild(btn)
    li.appendChild(div)
    return li
}
function li_completedItem(item) {
    const li = document.createElement('li')
    li.className = 'completed'
    li.id = item.id
    const div = document.createElement('div')
    div.className = 'view'
    const cb = document.createElement('input')
    cb.type = 'checkbox'
    cb.checked = 'checked'
    cb.className = 'toggle'
    cb.checked = true
    const lb = document.createElement('label')
    lb.innerText = item.title
    const btn = document.createElement('button')
    btn.className = 'destroy'
    btn.id = item.id
    btn.onclick = function(e) {
        const id = e.target.id
        const res = axios.delete(`https://63cbb569ea85515415140ab2.mockapi.io/api/todoMVC/blogs/${id}`)
        .then((response) => {
            if (response.status == 200) {
                e.target.parentElement.parentElement.remove()
            }
        })
    }
    div.appendChild(cb)
    div.appendChild(lb)
    div.appendChild(btn)
    li.appendChild(div)
    return li
}
function filteredAllItems(items) {
    const todoItems = items.filter(item => item.status === 'active')
    const completedItems = items.filter(item => item.status === 'completed')
    return [todoItems,completedItems]
}
function showTodoItems(items) {
    const ul_todoItems = $('.todo-list')
    const [todoItems,completedItems] = filteredAllItems(items)
    todoItems.map(item => {
        ul_todoItems.appendChild(li_activeItem(item))
    })
    showCount(items)
}
function showCompletedItems(items) {
    const ul_todoItems = $('.todo-list')
    const [todoItems,completedItems] = filteredAllItems(items)
    completedItems.map(item => {
        ul_todoItems.appendChild(li_completedItem(item))
    })
    showCount(items)
}
function showAllItems(items) {
    const ul_todoItems = document.querySelector('.todo-list')
    const [todoItems,completedItems] = filteredAllItems(items)
    todoItems.map(item => {
        ul_todoItems.appendChild(li_activeItem(item))
    })
    completedItems.map(item => {
        ul_todoItems.appendChild(li_completedItem(item))
    })
    showCount(items)
}
function showCount(items) {
    const [todoItems,completedItems] = filteredAllItems(items)
    const number = todoItems.length
    const todoCount = document.querySelector('.todo-number')
    todoCount.innerText = number
    const number2 = completedItems.length
    const toggleAll = document.querySelector('.toggle-all')
    if(number2 > 0){
        const clearCompleted = document.querySelector('.clear-completed')
        clearCompleted.style.display = 'block'
    }
    if (todoItems.length === 0) {
        toggleAll.checked = true
    } else {
        toggleAll.checked = false
    }
}
function main(items) {
    try{
        showAllItems(items)
        $('.filters-all').addEventListener('click', (e) => {
            $('.todo-list').innerHTML = ''
            showAllItems(items)
        })
        $('.filters-active').addEventListener('click', (e) => {
            $('.todo-list').innerHTML = ''
            showTodoItems(items)
        })
        $('.filters-completed').addEventListener('click', (e) => {
            $('.todo-list').innerHTML = ''
            showCompletedItems(items)
        })
    }
    catch(err){
        console.log(err)
    } 
}
const addItem = (item) => {
    
    axios.post("https://63cbb569ea85515415140ab2.mockapi.io/api/todoMVC/blogs", item)
    .then((response) => {
        if(response.status === 201){
            arr.push(item);
        }
        location.reload()
    })
}
$('.new-todo').addEventListener('keypress', (e) =>{
    const title = $('.new-todo').value
    if(e.key === "Enter"){
        e.preventDefault();
        const item = {
            title: title,
            status: 'active'
        }

        addItem(item)
        $('.new-todo').value = ''
    }
})
$('.todo-list').addEventListener('click', function(e) {
    if (e.target.className === 'toggle') {
        // if input checked 
        if(e.target.checked === false){
            const id = e.target.parentElement.parentElement.id
            const res = axios.put(`https://63cbb569ea85515415140ab2.mockapi.io/api/todoMVC/blogs/${id}`, {
                status: 'active'
            })
            .then((response) => {
                if(response.status === 200){
                    $('.todo-list').innerHTML = ''
                    fetchData()
                }
            })
            .catch((error) => {
                console.log(error)
            })
        }
        else {
            const id = e.target.parentElement.parentElement.id
            const res = axios.put(`https://63cbb569ea85515415140ab2.mockapi.io/api/todoMVC/blogs/${id}`, {
                status: 'completed'
            })
            .then((response) => {
                if(response.status === 200){
                    $('.todo-list').innerHTML = ''
                    fetchData()
                }
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }
})
fetchData();