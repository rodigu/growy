const RATIO = 1.6
const WIDTH = 3 * window.innerWidth / 4
const HEIGHT = WIDTH / 1.6
const MOUSE = {}
const Styling = new StyleManager()
const Event = {type: null}
const BLOCK_SIZE = 18.7 * RATIO
let Canvas
let Graphics
let LEVELS = []
fetch('https://teste.pushstart.com.br/api/blocks/levels')
      .then(response => response.json())
      .then(data => LEVELS = LEVELS.concat(data))


class Growy {
  constructor () {

    Graphics = new PIXI.Graphics()
    Canvas = new PIXI.Application({
      width: WIDTH,
      height: HEIGHT,
      antialias: true,
      resolution: 1
    })

    this.ticker = new PIXI.Ticker()
    this.ticker.stop()
    
    document.body.appendChild(Canvas.view)

    this.scenes = {}
    this.currentScene = 'mainMenu'

    this.scenes['mainMenu'] = new Menu(
      [
        {
          box: new Box(RATIO * 20, RATIO * 20, RATIO * 70, RATIO * 25),
          text: {_t: 'Level 0'},
          event: {type: 'toLevel', level: "Growing"}
        },
        {
          box: new Box(RATIO * 20, RATIO * 50, RATIO * 70, RATIO * 25),
          text: {_t: 'Level 1'},
          event: {type: 'toLevel', level: "Let it Blue"}
        },
        {
          box: new Box(RATIO * 20, RATIO * 80, RATIO * 70, RATIO * 25),
          text: {_t: 'Level 2'},
          event: {type: 'toLevel', level: "Pulsating"}
        },
        {
          box: new Box(RATIO * 20, RATIO * 110, RATIO * 70, RATIO * 25),
          text: {_t: 'Level 3'},
          event: {type: 'toLevel', level: "Mix and Match"}
        },
        {
          box: new Box(RATIO * 20, RATIO * 140, RATIO * 70, RATIO * 25),
          text: {_t: 'Level 4'},
          event: {type: 'toLevel', level: "Time to Choose"}
        }
      ]
    )


    this.interact = new PIXI.InteractionManager(Canvas)
    this.scenes['levelReader'] = new LevelReader ()
  }

  changeScene () {
    if (Event.type === 'toLevel') {
      this.currentScene = 'levelReader'
      for (let i in LEVELS) {
        if (LEVELS[i].name === Event.level) {
          this.scenes['levelReader'].currentLevel = LEVELS[i]
          break
        }
      }
    }
    Event.type = null
  }

  updateGraphics () {
    Canvas.stage.removeChildren()
    Canvas.stage.addChild(Graphics)
    Graphics.clear()
    MOUSE.position = this.interact.mouse.global
    MOUSE.isPressed = this.interact.mouse.buttons
    if (Event.type !== null) {
      this.changeScene()
    }
    this.scenes[this.currentScene].draw()
  }

  gameLoop () {
    this.ticker.add((deltaTime) => {
      this.updateGraphics()
    })
    this.ticker.start()
  }

  addLevel (name_, initial_, final_, modifiers_) {
    LEVELS.push({name: name_, initial: initial_, final: final_, modifiers: modifiers_})
  }

  postHighScore = async function (data = {}) {
    const response = await fetch ('https://teste.pushstart.com.br/api/blocks/scores', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    return response.json()
  }


}
