class StyleManager {
  constructor () {
    this.palettes = {}
    this.palettes['default'] = {
      player: 0xDA2C38,
      background: 0x02182B,
      text: 0xE9FFF9,
      endColors: [
        "#0000ff", "#ff0000", "#F2E94E", "#FBFBFF", "#00FF00"
      ]
    }
    this.currentColors = this.palettes['default']
    this.fontStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: RATIO * 20,
      fill: [this.currentColors.text], // inconsistent use of HEX and Strings
      
    })
    this.text = {}
    this.textIds = []
  }

  addText (id_, text_, pos_) {
    if (this.textIds.indexOf(id_) === -1) {
      return
    }
    this.textIds.push(id_)
    this.text[id_] = new PIXI.Text(text_, this.fontStyle)
    this.text[id_].x = pos_.x
    this.text[id_].y = pos_.y

    this.text[id_].fixedX = pos_.x
    this.text[id_].fixedY = pos_.y
  }
}
