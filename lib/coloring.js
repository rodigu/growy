let STYLE
class ColorManager {
  constructor () {
    this.palettes = {}
    this.palettes['default'] = {
      player: 0xDA2C38,
      background: 0x02182B,
      text: 0xE9FFF9,
      end0: 0x0197F6,
      end1: 0xE086D3
    }
    this.palettes['colorBlind'] = {
      player: 0xDA2C38,
      background: 0x02182B,
      text: 0xE9FFF9,
      end0: 0x0197F6,
      end1: 0xE0CEAD
    }
    this.current = this.palettes['default']
    STYLE = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
    })
  }
}
