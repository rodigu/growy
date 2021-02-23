class Box {
  constructor (x_, y_, wid_, hei_) {
    this.position = {x: x_, y: y_}
    this.width = wid_
    this.height = hei_
  }

  pointHit (x_, y_) {
    return (x_ > this.position.x && x_ < this.position.x + this.width && y_ > this.position.y && y_ < this.position.y + this.height)
  }
}