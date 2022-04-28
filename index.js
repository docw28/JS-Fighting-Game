const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.lastKey;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, 50, this.height);
  }

  update() {
    this.draw();

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  }
});

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  }
});

const keys = {
  d: { pressed: false },
  a: { pressed: false },
  w: { pressed: false },
  l: { pressed: false },
  j: { pressed: false },
  i: { pressed: false }
}

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  //player movement
  player.velocity.x = 0;

  if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  } else if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  }

  //enemy movement
  enemy.velocity.x = 0;

  if (keys.l.pressed && enemy.lastKey === "l") {
    enemy.velocity.x = 5;
  } else if (keys.j.pressed && enemy.lastKey === "j") {
    enemy.velocity.x = -5;
  }
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    // player keys
    case 'd':
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case 'a':
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case 'w':
      player.velocity.y = -20;
      break;

    //enemy keys
    case 'l':
      keys.l.pressed = true;
      enemy.lastKey = "l";
      break;
    case 'j':
      keys.j.pressed = true;
      enemy.lastKey = "j";
      break;
    case 'i':
      enemy.velocity.y = -20;
      break;
  }
  console.log(event.key);
})

window.addEventListener("keyup", (event) => {
  //player keys
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
  }

  //enemy keys
  switch (event.key) {
    case 'l':
      keys.l.pressed = false;
      break;
    case 'j':
      keys.j.pressed = false;
      break;
  }
  console.log(event.key);
})
