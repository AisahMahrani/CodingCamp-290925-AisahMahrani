console.log("Todo List App Initialized!");

        let toDoList = [];
        let currentFilter = 'all';

        function addTodo(event) { 
            if (event) event.preventDefault();
            
            const toDoInput = document.getElementById("toDoInput");
            const toDoDate = document.getElementById("toDoDate");
            
            if (validateInput(toDoInput.value, toDoDate.value)) {
                let todo = { id: Date.now(), task: toDoInput.value, date: toDoDate.value, completed: false
                };
                toDoList.push(todo);
                
                toDoInput.value = "";
                toDoDate.value = "";
                
                renderTodo();
            }
        }

        function renderTodo() {
            const toDoListElement = document.getElementById("toDoList");
            const filteredList = filterTodoList();
            
            if (filteredList.length === 0) {
                toDoListElement.innerHTML = `
                    <div class="empty-state">
                        No task found
                    </div>
                `;
                return;
            }
            
            toDoListElement.innerHTML = "";
            filteredList.forEach((todo) => {
                const div = document.createElement('div');
                div.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                
                div.innerHTML = `
                    <div class="flex items-center">
                        <input 
                            type="checkbox" 
                            class="checkbox-custom" 
                            ${todo.completed ? 'checked' : ''}
                            onchange="toggleTodo(${todo.id})"
                        >
                        <span class="task-text">${todo.task}</span>
                    </div>
                    <div class="task-date">${formatDate(todo.date)}</div>
                    <div>
                        <span class="status-badge ${todo.completed ? 'status-completed' : 'status-pending'}">
                            ${todo.completed ? 'Completed' : 'Pending'}
                        </span>
                    </div>
                    <div>
                        <button 
                            class="btn-delete"
                            onclick="deleteTodo(${todo.id})"
                        >
                            Delete
                        </button>
                    </div>
                `;
                
                toDoListElement.appendChild(div);
            });
        }

        function toggleTodo(id) {
            const todoIndex = toDoList.findIndex(todo => todo.id === id);
            if (todoIndex !== -1) {
                toDoList[todoIndex].completed = !toDoList[todoIndex].completed;
                renderTodo();
            }
        }

        function deleteTodo(id) {
            if (confirm("Are you sure you want to delete this task?")) {
                toDoList = toDoList.filter(todo => todo.id !== id);
                renderTodo();
            }
        }

        function deleteAllTodo() { 
            if (toDoList.length === 0) {
                alert("No tasks to delete!");
                return;
            }
            
            if (confirm("Are you sure you want to delete all tasks?")) {
                toDoList = [];
                renderTodo();
            }
        }

        function filterTodoList() {
            if (currentFilter === 'all') {
                return toDoList;
            } else if (currentFilter === 'active') {
                return toDoList.filter(todo => !todo.completed);
            } else if (currentFilter === 'completed') {
                return toDoList.filter(todo => todo.completed);
            }
            return toDoList;
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }

        function validateInput(todo, date) { 
            if (todo === "" || date === "") {
                alert("Please enter a task and date.");
                return false;
            }
            return true;
        }

        function setMinDate() {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('toDoDate').setAttribute('min', today);
            document.getElementById('toDoDate').value = today;
        }

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.getAttribute('data-filter');
                renderTodo();
            });
        });

        document.getElementById("toDoForm").addEventListener("submit", addTodo);

        setMinDate();
        renderTodo();
