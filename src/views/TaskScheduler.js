import React, { Component } from 'react'
import { View } from 'react-native'
import GanttChart from 'react-native-gantt-chart'

class Test extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tasks: [
        { _id: "1", name: "Task 1", "start": new Date(2018, 0, 1,4,30), "end": new Date(2018, 0, 1, 5,20), progress: 0.25 },
        { _id: "2", name: "Task 2", "start": new Date(2018, 0, 1, 2,30), "end": new Date(2018, 0, 1,3,30), progress: 1 },
        { _id: "3", name: "Task 3", "start": new Date(2018, 0, 1,7,0), "end": new Date(2018, 0, 1,9,0), progress: 0.5 }
      ]
    }
  }

  render() {
    return (
      <GanttChart
        data={this.state.tasks}
        numberOfTicks={13}
        onPressTask={task => alert(task.name)}
        gridMin={new Date(2018, 0, 1,0,0).getTime()}
        gridMax={new Date(2018, 0, 1,12,0).getTime()}
        colors={{
          barColorPrimary: '#0c2461',
          barColorSecondary: '#4a69bd',
          textColor: '#fff',
          backgroundColor: '#111111'
        }}
      />
    )
  }
}

export default Test
