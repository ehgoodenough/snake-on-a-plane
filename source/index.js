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

if(STAGE == "DEVELOPMENT") {
    window.state = state
}

class AspectRatioFrameComponent extends React.Component {
    render() {
        return (
            <div className="frame" style={this.style}>
                {this.props.children}
            </div>
        )
    }
    get style() {
        return {
            top: "0px",
            left: "0px",
            right: "0px",
            bottom: "0px",
            margin: "auto",
            position: "fixed",
            overflow: "hidden",
            width: this.props.frame.width + "em",
            height: this.props.frame.height + "em",
            backgroundColor: this.props.frame.color || "#222",
            fontSize: Math.min(
                window.innerWidth / this.props.frame.width,
                window.innerHeight / this.props.frame.height,
            ) + "px"
        }
    }
}

var MountElement = document.getElementById("mount")
class MountComponent extends React.Component {
    render() {
        if(!!this.state) {
            return (
                <AspectRatioFrameComponent frame={this.state.frame}>
                    <div>Hello World!!</div>
                </AspectRatioFrameComponent>
            )
        } else {
            return (
                <div/>
            )
        }
    }
}

var rendering = ReactDOM.render(<MountComponent/>, MountElement)
rendering.setState(state)
