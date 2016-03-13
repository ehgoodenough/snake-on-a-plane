var React = require("react")
var ReactDOM = require("react-dom")
var Afloop = require("afloop")
var Keyb = require("keyb")

var state = {
    game: {
        snake: {
            age: 3,
            direction: "EAST",
            pods: [
                {
                    age: 0,
                    position: {
                        x: 2,
                        y: 2,
                    }
                },
                {
                    age: 1,
                    position: {
                        x: 1,
                        y: 2,
                    }
                },
                {
                    age: 2,
                    position: {
                        x: 1,
                        y: 3,
                    }
                },
            ]
        }
    },
    frame: {
        width: 12,
        height: 12,
    }
}

var MountElement = document.getElementById("mount")
class MountComponent extends React.Component {
    render() {
        return (
            <div>Hello World!</div>
        )
    }
}

var rendering = ReactDOM.render(<MountComponent/>, MountElement)
