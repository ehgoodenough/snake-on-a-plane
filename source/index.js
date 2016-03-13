////////////////////
///// Importing /////
//////////////////

var React = require("react")
var ReactDOM = require("react-dom")
var Afloop = require("afloop")
var Keyb = require("keyb")

/////////////////////////
///// Initializ4ing /////
///////////////////////

var FRAME_WIDTH = 13
var FRAME_HEIGHT = 13

class Game {
    constructor() {
        this.snake = new Snake({
            position: {
                x: Math.floor(FRAME_WIDTH / 2),
                y: Math.floor(FRAME_HEIGHT / 2),
            }
        })
    }
    update(delta) {
        this.snake.update(delta)
    }
}

class Snake {
    constructor(snake) {
        this.position = snake.position || {x: 0, y: 0}
        this.direction = snake.direction || {x: 0, y: 0}
        this.speed = snake.speed || 0.25
        this.size = snake.size || 3
        this.pods = []
    }
    update(delta) {
        if(Keyb.isDown("W") || Keyb.isDown("<up>")) {
            this.direction = {x: 0, y: -1}
        } if(Keyb.isDown("D") || Keyb.isDown("<down>")) {
            this.direction = {x: 0, y: +1}
        } if(Keyb.isDown("A") || Keyb.isDown("<left>")) {
            this.direction = {x: -1, y: 0}
        } if(Keyb.isDown("D") || Keyb.isDown("<right>")) {
            this.direction = {x: +1, y: 0}
        }

        this.delta = this.delta || 0
        this.delta += delta
        if(this.delta >= this.speed) {
            this.delta -= this.speed

            if(!this.hasDirection()) {
                return
            }

            this.position.x += this.direction.x
            this.position.y += this.direction.y

            if(this.position.y >= state.frame.height) {
                this.position.y = 0
            } else if(this.position.y < 0) {
                this.position.y = state.frame.height - 1
            } if(this.position.x >= state.frame.height) {
                this.position.x = 0
            } else if(this.position.x < 0) {
                this.position.x = state.frame.width - 1
            }

            this.pods.unshift({
                position: {
                    x: this.position.x,
                    y: this.position.y,
                }
            })

            if(this.pods.length > this.size) {
                this.pods.pop()
            }
        }
    }
    hasDirection() {
        return !!this.direction.x
            || !!this.direction.y
    }
}

var state = {
    game: new Game(),
    frame: {
        width: FRAME_WIDTH,
        height: FRAME_HEIGHT,
    }
}

if(STAGE == "DEVELOPMENT") {
    window.state = state
}

//////////////////////
///// Rendering /////
////////////////////

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

class SnakeComponent extends React.Component {
    render() {
        return (
            <div className="snake" style={this.style}>
                {this.props.snake.pods.map((pod, key) => {
                    return (
                        <SnakePodComponent key={key} pod={pod}
                            percent={key / this.props.snake.pods.length}/>
                    )
                })}
            </div>
        )
    }
}

class SnakePodComponent extends React.Component {
    render() {
        return (
            <div className="snake-pod" style={this.style}/>
        )
    }
    get style() {
        return {
            width: 1 + "em",
            height: 1 + "em",
            position: "absolute",
            top: this.props.pod.position.y + "em",
            left: this.props.pod.position.x + "em",
            backgroundColor: "rgb(" + Math.floor((255 - 100) * (1 - this.props.percent) + 100) + ", 0, 0)",
            // transitionDuration: this.props.snake.speed + "s",
            // transitionTimingFunction: "linear",
            // transitionProperty: "top, left",
        }
    }
}

class UserInterface extends React.Component {
    render() {
        return (
            <div className="user-interface" style={this.style}>
                {this.props.game.snake.hasDirection() == false ? (
                    <div className="user-prompt">
                        <span>Press Any Key</span>
                    </div>
                ) : null}
            </div>
        )
    }
}

var MountElement = document.getElementById("mount")
class MountComponent extends React.Component {
    render() {
        if(!!this.state) {
            return (
                <AspectRatioFrameComponent frame={this.state.frame}>
                    <SnakeComponent snake={this.state.game.snake}/>
                    <UserInterface game={this.state.game}/>
                </AspectRatioFrameComponent>
            )
        } else {
            return (
                <div/>
            )
        }
    }
}

var render = ReactDOM.render(<MountComponent/>, MountElement)

////////////////////
///// Looping /////
//////////////////

var loop = new Afloop((delta) => {
    state.game.update(delta)
    render.setState(state)
})
