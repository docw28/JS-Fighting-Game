const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: "./img/background.png"
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  }
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: -50,
    y: 0
  },
  colour: "blue",
});

const keys = {
  d: { pressed: false },
  a: { pressed: false },
  w: { pressed: false },
  l: { pressed: false },
  j: { pressed: false },
  i: { pressed: false }
}

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  // enemy.update();

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

  // detect for collision
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    })
    && player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    })
    && enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
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
    case 's':
      player.attack();
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
    case 'k':
      enemy.attack();
      break;
  }
  // console.log(event.key);
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
  // console.log(event.key);
})
