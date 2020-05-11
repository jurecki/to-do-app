import React from 'react';
import io from 'socket.io-client';


class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  }
  componentDidMount() {
    this.socket = io('http://localhost:8000');

    this.socket.on('addTask', (taskName) => {
      console.log('Oh, I\'ve add task from ' + taskName);
      this.addTask(taskName)
    });
    this.socket.on('removeTask', (id, serverTask) => {
      console.log('Oh, I\'ve remove task id: ' + id);
      this.removeTask(id)
    });
    this.socket.on('updateData', (tasks) => {
      console.log('Oh, I\'ve update task, your to do LIST:' + tasks);
      this.updateTasks(tasks)
    });
  }

  removeTask = (id, localRemove) => {
    let tasks = [...this.state.tasks]
    tasks.splice(id, 1)
    this.setState({
      tasks
    })
    localRemove ? this.socket.emit('removeTask', (id)) : console.log('remove task from server')
  }

  updateTasks = (tasks) => {
    console.log('moje taski', tasks)
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
    this.addTask(this.state.taskName)
    this.socket.emit('addTask', this.state.taskName);
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
            {this.state.tasks.map((task, id) => (
              <li className='task' key={task}> {task}
                <button className="btn btn--red" onClick={this.removeTask.bind(this, id, localRemove)}>Remove</button>
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
