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
  'colorize': (x, y, c = 0x000000) => {
    x -= BLOCK_SIZE / 2
    y -= BLOCK_SIZE / 2
    Graphics.lineStyle(2, Styling.currentColors.text, 1)
    Graphics.beginFill(PIXI.utils.string2hex(c), 1)
    Graphics.drawRect(x, y, BLOCK_SIZE, BLOCK_SIZE)
    Graphics.endFill()
  },
  'select': (x, y) => {
    x -= BLOCK_SIZE / 2
    y -= BLOCK_SIZE / 2
    Graphics.lineStyle(2, Styling.currentColors.text, 1)
    Graphics.beginFill(Styling.currentColors.background, 0)
    Graphics.drawRect(x, y, BLOCK_SIZE, BLOCK_SIZE)
    Graphics.endFill()
  }
}

class LevelReader {
  constructor () {
    this.currentLevel = {}
    this.playButton = {
      x: (WIDTH / 2) - BLOCK_SIZE / 1.2,
      y: (HEIGHT - (2 * BLOCK_SIZE)) - BLOCK_SIZE / 2
    }
    this.playButton.box = new Box (this.playButton.x, this.playButton.y, BLOCK_SIZE, BLOCK_SIZE),
    this.playButton.draw = () => {
      buttonTypes.playButton(this.playButton.x, this.playButton.y)
    }
    this.playButton.update = () => {
      if (this.playButton.box.pointHit(MOUSE.position.x, MOUSE.position.y) && MOUSE.isPressed) {
        this.isPlaying = true
      }
    }
  }

  init () {
    this.isPlaying = false
    this.didEnd = false
    this.selectedColor = Styling.currentColors.endColors[0]
    this.selectedSize = 0
    this.selectable = {
      colorize: {
        x: (WIDTH) / 3,
        y: BLOCK_SIZE
      },
      resize: {
        x: (2 * WIDTH) / 3,
        y: BLOCK_SIZE
      }
    }
    this.currentBlock = -1
    this.rs = 110
    this.player = {
      size: 1,
      x: BLOCK_SIZE,
      y: HEIGHT / 2 - (BLOCK_SIZE / 2),
      modifierN: 0,
      color: Styling.currentColors.player
    }
    this.player.draw = () => {
      Graphics.lineStyle(2, Styling.currentColors.text, 1)
      Graphics.beginFill(PIXI.utils.string2hex(this.player.color), 1) // PIXIJS funtion for coloring stuff
      Graphics.drawRect(this.player.x, this.player.y, BLOCK_SIZE, this.player.size * BLOCK_SIZE)
      Graphics.endFill()
    }
    this.player.update = () => {
      if (this.player.x >= WIDTH - 4 * BLOCK_SIZE) {
        this.didEnd = true
      }
      this.player.x += WIDTH / (2 * BLOCK_SIZE)
      const mods = this.currentLevel['modifiers']
      const xInteraction = (this.player.modifierN + 1) * (WIDTH - BLOCK_SIZE) / (mods.length + 1)
      if (this.player.modifierN < mods.length && this.player.x > xInteraction) {
        if (mods[this.player.modifierN]['type'] === 'resize') {
          this.player.size = mods[this.player.modifierN]['size']
          this.player.y = HEIGHT / 2 - (this.player.size * BLOCK_SIZE / 2)
        } else if (mods[this.player.modifierN]['type'] === 'colorize') {
          this.player.color = mods[this.player.modifierN]['color']
        }
        this.player.modifierN ++
      }
    }

    const initial = this.currentLevel['initial']
    this.player.size = initial['size']
    this.player.color = initial['color']
    this.player.y = (HEIGHT - initial['size'] * BLOCK_SIZE) / 2
    this.didEnd = false
    this.isPlaying = false
  }

  draw () {
    if (this.didEnd) {
      Event.type = 'endScreen'
      Event.stats = {
        playerEnd: this.player,
        final: this.currentLevel['final']
      }
    }
    Graphics.beginFill(Styling.currentColors.text, .2)
    Graphics.drawRect(BLOCK_SIZE, (HEIGHT - BLOCK_SIZE / 10) / 2, WIDTH - 2 * BLOCK_SIZE, BLOCK_SIZE / 10)
    Graphics.endFill()
    let t = new PIXI.Text(this.currentLevel.name, Styling.fontStyle)
    t.x = 10 * RATIO
    t.y = 10 * RATIO
    Canvas.stage.addChild(t)
    let modifiers = this.currentLevel['modifiers']
    const posModifier = (WIDTH - 15 * RATIO) / (modifiers.length + 1)
    for (let i in modifiers) {
      let k = parseInt(i) + 1 // i is a string when used with "in" (for some reason)
      buttonTypes[modifiers[i]['type']]((k * posModifier), HEIGHT / 2, modifiers[i]['color'])
    }
    if (this.isPlaying) {
      this.player.update()
    }
    const final = this.currentLevel['final']
    this.playButton.draw()
    this.playButton.update()
    this.player.draw()
    this.checkClick()
    Graphics.lineStyle(2, Styling.currentColors.text, 1)
    Graphics.beginFill( PIXI.utils.string2hex(final['color']), 1)
    Graphics.drawRect(WIDTH - 2 * BLOCK_SIZE, (HEIGHT - final['size'] * BLOCK_SIZE) / 2, BLOCK_SIZE, final['size'] * BLOCK_SIZE)
    Graphics.endFill()
  }

  checkClick () {
    const mx = MOUSE.position.x + BLOCK_SIZE / 2
    const my = MOUSE.position.y + BLOCK_SIZE / 2
    const bc = new Box(this.selectable.colorize.x, this.selectable.colorize.y, BLOCK_SIZE, BLOCK_SIZE)
    const br = new Box(this.selectable.resize.x, this.selectable.resize.y, BLOCK_SIZE, BLOCK_SIZE)
    buttonTypes.resize(br.position.x, br.position.y)
    let t = new PIXI.Text(this.selectedSize, Styling.fontStyle)
    t.x = br.position.x
    t.y = br.position.y * 2
    Canvas.stage.addChild(t)
    buttonTypes.colorize(bc.position.x, bc.position.y, this.selectedColor)
    this.rs += 2
    if (br.pointHit(mx, my)) {
      this.currentBlock = 'resize'
      if (MOUSE.isPressed && this.rs > 20) {
        this.rs = 0
        if (my < br.position.y + (BLOCK_SIZE / 2)) {
          this.selectedSize ++
        } else {
          this.selectedSize --
        }
      }
    } else if (bc.pointHit(mx, my)) {
      this.currentBlock = 'colorize'
      if (MOUSE.isPressed && this.rs > 20) {
        this.rs = 0
        const ind = Styling.currentColors.endColors.indexOf(this.selectedColor)
        const dc = ind + 1 >= Styling.currentColors.endColors.length ? 0 : ind + 1
        this.selectedColor = Styling.currentColors.endColors[dc]
      }
    }
    if (this.currentBlock !== -1) {
      buttonTypes[this.currentBlock](mx - BLOCK_SIZE / 2, my - BLOCK_SIZE / 2, this.selectedColor)
    }
    if (MOUSE.isPressed) {
      let modifiers = this.currentLevel['modifiers']
      const posModifier = (WIDTH - 15 * RATIO) / (modifiers.length + 1)
      for (let i in modifiers) {
        const k = parseInt(i) + 1 // i is a string when used with "in" (for some reason)
        const b = new Box((k * posModifier), HEIGHT / 2, BLOCK_SIZE, BLOCK_SIZE)
        if (b.pointHit(mx, my)) {
          this.currentLevel.modifiers[i]['type'] = this.currentBlock
          this.currentLevel.modifiers[i]['size'] = this.selectedSize
          this.currentLevel.modifiers[i]['color'] = this.selectedColor
        }
      }
    }
  }
}

function levelGenerator () {
  const cols = Styling.currentColors.endColors
  const rand = function (n) { return Math.floor(n * Math.random()) }
  const lv = {
    name: 'Generated',
    initial: {
      "size": rand(3) + 1,
      "color": cols[rand(cols.length)]
    },
    final: {
      "size": rand(3) + 1,
      "color": cols[rand(cols.length)]
    },
    modifiers: [
      {
        "type": "select"
      },
      {
        "type": "select"
      },
      {
        "type": "select"
      }
    ]
  }
  return lv
}