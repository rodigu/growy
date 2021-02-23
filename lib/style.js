class StyleManager {
  constructor () {
    this.palettes = {}
    this.palettes['default'] = {
      player: 0xDA2C38,
      background: 0x02182B,
      text: 0xE9FFF9,
      end0: 0x0197F6,
      end1: 0xE086D3
    }
    // this.palettes['colorBlind'] = {
    //   player: 0xDA2C38,
    //   background: 0x02182B,
    //   text: 0xE9FFF9,
    //   end0: 0x0197F6,
    //   end1: 0xE0CEAD
    // }
    this.currentColors = this.palettes['default']
    this.fontStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 32,
      fill: [this.currentColors.text], // inconsistent use of HEX and Strings
      
    })
  }
}
