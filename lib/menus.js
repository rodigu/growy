class Menu {
  constructor (buttons_) {
    this.buttons = buttons_
  }
  draw () {
    let stage = Canvas.stage
    let s_ = Styling.fontStyle
    for (let i = 0; i < this.buttons.length; i++) {
      let t = this.buttons[i].text._t
      let b = this.buttons[i].box
      Graphics.beginFill(Styling.currentColors.player, 1);
      Graphics.drawRoundedRect(b.position.x, b.position.y, b.width, b.height, 6);
      Graphics.endFill();
      if (b.pointHit(MOUSE.position.x, MOUSE.position.y) && MOUSE.isPressed) {
        this.buttons[i].isPressed = true
        Event.type = this.buttons[i].event.type
        Event.level = this.buttons[i].event.level
      } else {
        this.buttons[i].isPressed = false
      }
      this.buttons[i].text.content = new PIXI.Text(t, s_)
      this.buttons[i].text.content.x = this.buttons[i].box.position.x
      this.buttons[i].text.content.y = this.buttons[i].box.position.y
      stage.addChild(this.buttons[i].text.content)
    }
  }
}