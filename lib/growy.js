const RATIO = 1.6
const WIDTH = window.innerWidth - 10
const HEIGHT = WIDTH / 1.6

class Growy {
  constructor () {
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
  }

  gameLoop () {
    this.ticker.add((deltaTime) => {
      let x = 100 * (Math.random())
      let y = 100 * (Math.random())
      this.graphics.clear()
      this.graphics.lineStyle(20, 0xFF00FF, .25);
      this.graphics.beginFill(0xDE3249, 1)
      this.graphics.drawCircle(x, y, 50)
      this.graphics.endFill()
    
      this.canv.stage.addChild(this.graphics)
    })
    this.ticker.start()
  }

  postHighScore = async function (data = {}) {
    const response = await fetch ('https://teste.pushstart.com.br/api/blocks/scores', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    return response.json()
  }

}
