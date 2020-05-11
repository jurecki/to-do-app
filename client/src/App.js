import React from 'react';
import io from 'socket.io-client';
import uuid from 'react-uuid';

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  }
  componentDidMount() {
    this.socket = io('http://localhost:8000');

    this.socket.on('addTask', (taskName) => {
      this.addTask(taskName)
    });
    this.socket.on('removeTask', (id) => {
      this.removeTask(id)
    });
    this.socket.on('updateData', (tasks) => {
      this.updateTasks(tasks)
    });

  }

  removeTask = (id, localRemove) => {
    const tasks = [...this.state.tasks]
    const index = tasks.findIndex(task => task.id === id)
    tasks.splice(index, 1)
    this.setState({
      tasks
    })
    localRemove ? this.socket.emit('removeTask', (id)) : console.log('remove task from server')
  }

  updateTasks = (tasks) => {
    this.setState({
      tasks: tasks
    })
  }

  handleInputChange = (e) => {
    this.setState({
      taskName: e.target.value,
    })
  }


  submitForm = (e) => {
    e.preventDefault();
    const idTask = uuid()
    this.addTask({ id: idTask, name: this.state.taskName })
    this.socket.emit('addTask', { id: idTask, name: this.state.taskName });
  }

  addTask = (task) => {
    if (task === '') return alert('Probujesz dodac puste zadanie')
    const tasks = [...this.state.tasks]
    tasks.push(task)
    this.setState({
      tasks
    })
  }

  render() {
    const localRemove = true;
    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map((task) => (
              <li className='task' key={task.id}> {task.name}
                <button className="btn btn--red" onClick={this.removeTask.bind(this, task.id, localRemove)}>Remove</button>
              </li>
            ))}
          </ul>

          <form id="add-task-form" onSubmit={this.submitForm}>
            <input
              className="text-input"
              autoComplete="off"
              type="text"
              placeholder="Type your description"
              id="task-name"
              value={this.state.taskName}
              onChange={this.handleInputChange} />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  }

}

export default App;
