////////////////////
///// Importing /////
//////////////////

var React = require("react")
var ReactDOM = require("react-dom")
var Afloop = require("afloop")
var Keyb = require("keyb")

/////////////////////////
///// Initializing /////
///////////////////////

class Game {
    constructor() {
        this.snake = new Snake({
            position: {
                x: Math.floor(state.frame.width / 2),
                y: Math.floor(state.frame.height / 2),
            }
        })
    }
}

class Snake {
    constructor() {
        this.size = 3,
        this.position = {
            x: 2, y: 2,
        }
        this.direction = {
            x: +1, y: 0,
        }
        this.pods = [
            {
                position: {
                    x: 2,
                    y: 2,
                }
            },
            {
                position: {
                    x: 1,
                    y: 2,
                }
            },
            {
                position: {
                    x: 1,
                    y: 3,
                }
            },
        ]

        this.speed = 0.25
        this.delta = 0
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

        this.delta += delta
        if(this.delta >= this.speed) {
            this.delta -= this.speed
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
            this.pods.unshift(new SnakePod({
                position: this.position
            }))
            if(this.pods.length > this.size) {
                this.pods.pop()
            }
        }
    }
}

class SnakePod {
    constructor(snakepod) {
        this.position = {
            x: snakepod.position.x,
            y: snakepod.position.y,
        }
    }
}

var state = {
    game: {
        snake: new Snake(),
    },
    frame: {
        width: 13,
        height: 13,
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
                        <SnakePodComponent key={key}
                            snake={this.props.snake} pod={pod}/>
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
            backgroundColor: this.props.pod.color || "hotpink",
            // transitionDuration: this.props.snake.speed + "s",
            // transitionTimingFunction: "linear",
            // transitionProperty: "top, left",
        }
    }
}

var MountElement = document.getElementById("mount")
class MountComponent extends React.Component {
    render() {
        if(!!this.state) {
            return (
                <AspectRatioFrameComponent frame={this.state.frame}>
                    <SnakeComponent snake={this.state.game.snake}/>
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
    state.game.snake.update(delta)
    render.setState(state)
})
