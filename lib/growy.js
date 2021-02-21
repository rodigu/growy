const RATIO = 1.6
const WIDTH = 3 * window.innerWidth / 4
const HEIGHT = WIDTH / RATIO

class Growy {
  constructor () {

    this.color = new ColorManager()

    this.canv = new PIXI.Application({
      width: WIDTH,
      height: HEIGHT,
      antialias: true,
      resolution: 1
    })

    this.ticker = new PIXI.Ticker()
    this.ticker.stop()
    
    this.graphics = new PIXI.Graphics()
    document.body.appendChild(this.canv.view)

    this.levels = []
    fetch('https://teste.pushstart.com.br/api/blocks/levels')
      .then(response => response.json())
      .then(data => this.levels = this.levels.concat(data))

    this.scenes = {}
    this.currentScene = {}
    this.scenes['mainMenu'] = new Menu(
      [
        {
          position: {x: WIDTH , y: HEIGHT / 2},
          size: {width: 20, height: 20},
          text: 'Level 0',
          event: 'level_0'
        },
        {
          position: {},
          size: {},
          text: {},
          event: 'level_1'
        }
      ]
    )


    this.interact = new PIXI.InteractionManager(this.canv)
    this.mouse = {}
    this.mouse.position = this.interact.mouse.getLocalPosition(this.graphics)
    this.mouse.isPressed = this.interact.mouse.buttons
    
  }

  changeScene (newScene_) {
    for (let i in this.scenes[this.currentScene].buttons) {
      this.canv.stage.removeChild(i.text)
    }

    this.currentScene = newScene_

    for (let i in this.scenes[this.currentScene].buttons) {
      this.canv.stage.addChild(i.text)
    }
  }

  gameLoop () {
    this.ticker.add((deltaTime) => {
      this.mouse.position = this.interact.mouse.getLocalPosition(this.graphics)
      this.mouse.isPressed = this.interact.mouse.buttons
      this.graphics.clear()
      if (this.mouse.isPressed){
        this.graphics.beginFill(0xDE3249);
        this.graphics.drawRect(this.mouse.position.x, this.mouse.position.y, 100, 100);
        this.graphics.endFill();
      }
      // this.scenes[this.currentScene].draw()
    
      this.canv.stage.addChild(this.graphics)
    })
    this.ticker.start()
  }

  addLevel (name_, initial_, final_, modifiers_) {
    this.levels.push({name: name_, initial: initial_, final: final_, modifiers: modifiers_})
  }

  postHighScore = async function (data = {}) {
    const response = await fetch ('https://teste.pushstart.com.br/api/blocks/scores', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    return response.json()
  }


}
