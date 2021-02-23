const buttonTypes = {
  playButton: (x, y) => {
    const path = [(BLOCK_SIZE * .1 + x), (BLOCK_SIZE * .1 + y), (BLOCK_SIZE * .1 + x), (BLOCK_SIZE * .9 + y) , (BLOCK_SIZE * .9 + x), (BLOCK_SIZE * .47 + y)]
    Graphics.lineStyle(2, Styling.currentColors.text, 1)
    Graphics.beginFill(Styling.currentColors.background, 0)
    Graphics.drawRect(x, y, BLOCK_SIZE, BLOCK_SIZE)
    Graphics.endFill()
    Graphics.lineStyle(0)
    Graphics.beginFill(Styling.currentColors.text, .9)
    Graphics.drawPolygon(path)
    Graphics.endFill()
  },
  'resize': (x, y) => {
    x -= BLOCK_SIZE / 2
    y -= BLOCK_SIZE / 2
    const path1 = [(BLOCK_SIZE * .1) + x, (BLOCK_SIZE * .4) + y, (BLOCK_SIZE * .5) + x, (BLOCK_SIZE * .1) + y, (BLOCK_SIZE * .9) + x, (BLOCK_SIZE * .4) + y]
    const path2 = [(BLOCK_SIZE * .1) + x, (BLOCK_SIZE * .6) + y, (BLOCK_SIZE * .5) + x, (BLOCK_SIZE * .9) + y, (BLOCK_SIZE * .9) + x, (BLOCK_SIZE * .6) + y]
    Graphics.lineStyle(2, Styling.currentColors.text, 1)
    Graphics.beginFill(Styling.currentColors.background, 0)
    Graphics.drawRect(x, y, BLOCK_SIZE, BLOCK_SIZE)
    Graphics.endFill()
    Graphics.lineStyle(0)
    Graphics.beginFill(Styling.currentColors.text, .9)
    Graphics.drawPolygon(path1)
    Graphics.drawPolygon(path2)
    Graphics.endFill()
  },
  'colorize': (x, y) => {
    x -= BLOCK_SIZE / 2
    y -= BLOCK_SIZE / 2
    const path1 = [(BLOCK_SIZE * .1) + x, (BLOCK_SIZE * .4) + y, (BLOCK_SIZE * .5) + x, (BLOCK_SIZE * .1) + y, (BLOCK_SIZE * .9) + x, (BLOCK_SIZE * .4) + y]
    const path2 = [(BLOCK_SIZE * .1) + x, (BLOCK_SIZE * .6) + y, (BLOCK_SIZE * .5) + x, (BLOCK_SIZE * .9) + y, (BLOCK_SIZE * .9) + x, (BLOCK_SIZE * .6) + y]
    Graphics.lineStyle(2, Styling.currentColors.text, 1)
    Graphics.beginFill(Styling.currentColors.background, 0)
    Graphics.drawRect(x, y, BLOCK_SIZE, BLOCK_SIZE)
    Graphics.endFill()
    Graphics.lineStyle(0)
    Graphics.beginFill(Styling.currentColors.text, .9)
    Graphics.drawPolygon(path1)
    Graphics.drawPolygon(path2)
    Graphics.endFill()
  },
  'select': (x, y) => {
    x -= BLOCK_SIZE / 2
    y -= BLOCK_SIZE / 2
    const path1 = [(BLOCK_SIZE * .1) + x, (BLOCK_SIZE * .4) + y, (BLOCK_SIZE * .5) + x, (BLOCK_SIZE * .1) + y, (BLOCK_SIZE * .9) + x, (BLOCK_SIZE * .4) + y]
    const path2 = [(BLOCK_SIZE * .1) + x, (BLOCK_SIZE * .6) + y, (BLOCK_SIZE * .5) + x, (BLOCK_SIZE * .9) + y, (BLOCK_SIZE * .9) + x, (BLOCK_SIZE * .6) + y]
    Graphics.lineStyle(2, Styling.currentColors.text, 1)
    Graphics.beginFill(Styling.currentColors.background, 0)
    Graphics.drawRect(x, y, BLOCK_SIZE, BLOCK_SIZE)
    Graphics.endFill()
    Graphics.lineStyle(0)
    Graphics.beginFill(Styling.currentColors.text, .9)
    Graphics.drawPolygon(path1)
    Graphics.drawPolygon(path2)
    Graphics.endFill()
  }
}

class LevelReader {
  constructor () {
    this.currentLevel = {}
    this.isPlaying = false
    this.buttons = {}
    this.playButton = {
      x: (WIDTH / 2) - BLOCK_SIZE / 1.2,
      y: (HEIGHT - (2 * BLOCK_SIZE)) - BLOCK_SIZE / 2
    }
    this.playButton.box = new Box (this.playButton.x, this.playButton.y, BLOCK_SIZE, BLOCK_SIZE),
    this.playButton.draw = () => {
      buttonTypes.playButton(this.playButton.x, this.playButton.y)
    }
    this.playButton.update = () => {
      if (this.playButton.box.pointHit(MOUSE.position.x, MOUSE.position.y)) {console.log('A')}
      if (this.playButton.box.pointHit(MOUSE.position.x, MOUSE.position.y) && MOUSE.isPressed) {
        this.isPlaying = true
      }
    }
    this.player = {
      size: 1,
      x: BLOCK_SIZE,
      y: HEIGHT / 2 - (BLOCK_SIZE / 2)
    }
    this.player.box = new Box(this.player.x, this.player.y, BLOCK_SIZE, this.player.size * BLOCK_SIZE)
    this.player.draw = () => {   
      Graphics.lineStyle(2, Styling.currentColors.text, 1)
      Graphics.beginFill(Styling.currentColors.player, 1)
      Graphics.drawRect(this.player.x, this.player.y, BLOCK_SIZE, this.player.size * BLOCK_SIZE)
      Graphics.endFill()
    }
    this.player.update = () => {
      this.player.x += RATIO * 10
    }
  }

  draw () {
    Graphics.beginFill(Styling.currentColors.text, .5)
    Graphics.drawRect(BLOCK_SIZE, (HEIGHT - BLOCK_SIZE / 10) / 2, WIDTH - 2 * BLOCK_SIZE, BLOCK_SIZE / 10)
    Graphics.endFill()
    let t = new PIXI.Text(this.currentLevel.name, Styling.fontStyle)
    t.x = 10 * RATIO
    t.y = 10 * RATIO
    let modifiers = this.currentLevel['modifiers']
    const posModifier = (WIDTH - 15 * RATIO) / (modifiers.length + 1)
    for (let i in modifiers) {
      let k = parseInt(i) + 1 // i is a string when used with "in"
      buttonTypes[modifiers[i]['type']]((k * posModifier), HEIGHT / 2)
    }
    Canvas.stage.addChild(t)
    if (this.isPlaying) {
      console.log('SA')
    }
    this.playButton.draw()
    this.playButton.update()
    this.player.draw()
    Graphics.beginFill(Styling.currentColors.text, .5)
    Graphics.drawRect(BLOCK_SIZE, (HEIGHT - BLOCK_SIZE / 10) / 2, WIDTH - 2 * BLOCK_SIZE, BLOCK_SIZE / 10)
    Graphics.endFill()
  }
}