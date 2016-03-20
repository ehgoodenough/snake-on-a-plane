//////////////////////////////////////////
/////////////// Importing ///////////////
////////////////////////////////////////

var React = require("react")
var ReactDOM = require("react-dom")
var ShortID = require("shortid")
var Afloop = require("afloop")
var Keyb = require("keyb")

/////////////////////////////////////////////
/////////////// Initializing ///////////////
///////////////////////////////////////////

var FRAME_WIDTH = 13
var FRAME_HEIGHT = 13
var SPAWN_TIME = 1
var GAME_OVER_TIME = 5
var INITIAL_SIZE = 3
var ACCELERATION_GRADIENT = 5
var SPEED_LEVEL_COUNT = 5
var MINIMUM_SPEED = 0.1

class Game {
    constructor() {
        this.initiate()
    }
    initiate() {
        this.pellets = new Object()
        this.snake = new Snake({
            game: this,
            position: {
                x: Math.floor(FRAME_WIDTH / 2),
                y: Math.floor(FRAME_HEIGHT / 2),
            }
        })
        this.delta = 0
        this.isPlaying = true
    }
    update(delta) {
        if(this.isPlaying) {
            this.snake.update(delta)
            if(this.snake.hasDirection()) {
                this.delta += delta
                if(this.delta > SPAWN_TIME) {
                    this.delta -= SPAWN_TIME
                    var position = new Position({
                        x: Math.floor(Math.random() * FRAME_WIDTH - 2) + 1,
                        y: Math.floor(Math.random() * FRAME_HEIGHT - 2) + 1,
                    })
                    this.pellets[position] = {
                        type: Math.random() < 0.5,
                        position: position,
                    }
                }
            }
        } else {
            if(Keyb.isJustDown("W") || Keyb.isJustDown("<up>")
            || Keyb.isJustDown("S") || Keyb.isJustDown("<down>")
            || Keyb.isJustDown("A") || Keyb.isJustDown("<left>")
            || Keyb.isJustDown("D") || Keyb.isJustDown("<right>")) {
                this.initiate()
            }
            this.delta += delta
            if(this.delta > GAME_OVER_TIME) {
                this.initiate()
            }
        }
    }
}

class Snake {
    constructor(snake) {
        this.game = snake.game
        this.position = new Position(snake.position) || {x: 0, y: 0}
        this.direction = snake.direction || {x: 0, y: 0}
        this.size = snake.size || INITIAL_SIZE
        this.pods = []
    }
    update(delta) {
        if(Keyb.isJustDown("W") || Keyb.isJustDown("<up>")) {
            this.direction = {x: 0, y: -1}
        } if(Keyb.isJustDown("D") || Keyb.isJustDown("<down>")) {
            this.direction = {x: 0, y: +1}
        } if(Keyb.isJustDown("A") || Keyb.isJustDown("<left>")) {
            this.direction = {x: -1, y: 0}
        } if(Keyb.isJustDown("D") || Keyb.isJustDown("<right>")) {
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

            if(!!this.game.pellets[this.position]) {
                if(this.game.pellets[this.position].type) {
                    this.size += 1
                } else {
                    this.game.isPlaying = false
                }
            }

            var collidesWithSelf = this.pods.some((pod) => {
                return this.position.x == pod.position.x
                    && this.position.y == pod.position.y
            })
            if(!!collidesWithSelf) {
                this.game.isPlaying = false
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
    get speed() {
        return 0.2
        return Math.max(MINIMUM_SPEED, (1 - ((Math.floor(this.size / ACCELERATION_GRADIENT) + 1) / SPEED_LEVEL_COUNT)) + MINIMUM_SPEED)
    }
    get score() {
        return this.size - INITIAL_SIZE
    }
}

class Position {
    constructor(position) {
        this.x = position.x || 0
        this.y = position.y || 0
    }
    toString() {
        return this.x + "x" + this.y
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

//////////////////////////////////////////
/////////////// Rendering ///////////////
////////////////////////////////////////

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

class PelletComponent extends React.Component {
    render() {
        return (
            <div className="pellet" style={this.style}/>
        )
    }
    get style() {
        return {
            width: 1 + "em",
            height: 1 + "em",
            position: "absolute",
            top: this.props.pellet.position.y + "em",
            left: this.props.pellet.position.x + "em",
            backgroundColor: this.props.pellet.type ? "#0C0" : "#000",
        }
    }
}

class UserInterface extends React.Component {
    render() {
        return (
            <div className="user-interface" style={this.style}>
                {!this.props.game.snake.hasDirection() ? (
                    <div>
                        <header>
                            <h2>For GDC Plane Jam 2016, I made</h2>
                            <h1>SnaKe on a Plane</h1>
                        </header>
                        <div className="start-game message">
                            <span>Press any arrow Key</span>
                        </div>

                    </div>
                ) : (this.props.game.isPlaying ? (
                    <div className="score">
                        <span>{this.props.game.snake.score}</span>
                    </div>
                ) : (
                    <div className="game-over message">
                        <span>Game Over!</span>
                    </div>
                ))}
            </div>
        )
    }
    get style() {
        return {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            position: "absolute",
        }
    }
}

class MountComponent extends React.Component {
    render() {
        if(!!this.state) {
            return (
                <AspectRatioFrameComponent frame={this.state.frame}>
                    {Object.keys(this.state.game.pellets).map((key) => {
                        return (
                            <PelletComponent key={key}
                                pellet={this.state.game.pellets[key]}/>
                        )
                    })}
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

var MountElement = document.getElementById("mount")

var render = ReactDOM.render(<MountComponent/>, MountElement)

////////////////////////////////////////
/////////////// Looping ///////////////
//////////////////////////////////////

var loop = new Afloop((delta) => {
    state.game.update(delta)
    render.setState(state)
})
