const WIDTH = 3 * window.innerWidth / 4
const HEIGHT = WIDTH / 1.6
const RATIO = WIDTH / 500
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
        },
        {
          box: new Box(WIDTH / 2 - 2 * BLOCK_SIZE, HEIGHT / 2 + 3 * BLOCK_SIZE, RATIO * 100, RATIO * 25),
          text: {_t: 'Generator'},
          event: {type: 'generate'}
        }
      ]
    )
    
    this.scenes['endScreen'] = new Menu(
      [
        {
          box: new Box((WIDTH - RATIO * 100) / 2, BLOCK_SIZE * 5, RATIO * 100, RATIO * 25),
          text: {_t: 'Results'},
          event: {type: 'toMain'}
        }
      ]
    )

    this.interact = new PIXI.InteractionManager(Canvas)
    this.scenes['levelReader'] = new LevelReader ()
  }

  toMenu () {
    const b = new Box(WIDTH - 4 * BLOCK_SIZE, (BLOCK_SIZE / 2), 3.2 * BLOCK_SIZE, 1.2 * BLOCK_SIZE)
    Graphics.lineStyle(2, Styling.currentColors.text, 1)
    Graphics.beginFill(Styling.currentColors.text, .8)
    Graphics.drawRect(b.position.x, b.position.y, b.width, b.height)
    Graphics.endFill()
    const t = new PIXI.Text('MENU', Styling.fontStyle)
    t.x = b.position.x
    t.y = b.position.y
    Canvas.stage.addChild(t)
    if (b.pointHit(MOUSE.position.x, MOUSE.position.y) && MOUSE.isPressed) {
      this.currentScene = 'mainMenu'
      Graphics.destroy()
      Graphics = new PIXI.Graphics()
    }
  }

  changeScene () {
    Graphics.destroy(true)
    Graphics = new PIXI.Graphics()
    this.scenes['levelReader'].currentLevel = null
    if (Event.type === 'toLevel') {
      this.currentScene = 'levelReader'
      for (let i in LEVELS) {
        if (LEVELS[i].name === Event.level) {
          this.scenes['levelReader'].currentLevel = LEVELS[i]
          this.scenes['levelReader'].init()
          break
        }
      }
    } else if (Event.type === 'generate') {
      console.log(Event)
      this.scenes['levelReader'].currentLevel = levelGenerator()
      this.scenes['levelReader'].init()
      this.currentScene = 'levelReader'
    } else if (Event.type === 'endScreen') {
      this.currentScene = 'endScreen'
      let t
      if (Event.stats.playerEnd.size == Event.stats.final.size && Event.stats.playerEnd.color == Event.stats.final.color) {
        t = 'Well Done!'
      } else { t = 'Fail:(' }
      this.scenes['endScreen'].buttons[0].text._t = t
    }
    Event.type = null
  }

  updateGraphics () {
    const prevEvent = Event.type
    Canvas.stage.removeChildren()
    Canvas.stage.addChild(Graphics)
    Graphics.clear()
    MOUSE.position = this.interact.mouse.global
    MOUSE.isPressed = this.interact.mouse.buttons
    this.scenes[this.currentScene].draw()
    if (Event.type !== null || Event.type !== prevEvent) {
      this.changeScene()
    }
    this.toMenu()
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
