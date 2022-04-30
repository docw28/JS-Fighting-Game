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
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6
    },
    attack2: {
      imageSrc: "./img/samuraiMack/Attack2.png",
      framesMax: 6
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      framesMax: 6
    }
  },
  hitbox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 160,
    height: 50
  },
  damage: 20
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
  imageSrc: "./img/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      framesMax: 4
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      framesMax: 8
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      framesMax: 2
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      framesMax: 2
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      framesMax: 4
    },
    attack2: {
      imageSrc: "./img/kenji/Attack2.png",
      framesMax: 4
    },
    takeHit: {
      imageSrc: "./img/kenji/Take Hit - white.png",
      framesMax: 3
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      framesMax: 7
    }
  },
  hitbox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  },
  damage: 10
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
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  //player movement
  player.velocity.x = 0;

  if (keys.d.pressed && player.lastKey === "d" && !player.isAttacking) {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else if (keys.a.pressed && player.lastKey === "a" && !player.isAttacking) {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

    //jumping animations
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //enemy movement
  enemy.velocity.x = 0;

  if (keys.l.pressed && enemy.lastKey === "l" && !enemy.isAttacking) {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else if (keys.j.pressed && enemy.lastKey === "j" && !enemy.isAttacking) {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

    //jumping animations
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // when enemy is hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit(player.damage);
    player.isAttacking = false;
    gsap.to("#enemyHealth", {
      width: enemy.health + "%"
    });
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  // when player gets hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit(enemy.damage);
    enemy.isAttacking = false;
    gsap.to("#playerHealth", {
      width: player.health + "%"
    });
  }

  // if enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
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
        if (player.canJump) {
          player.velocity.y = -20;
          player.canJump = false;
        }
        break;
      case 's':
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
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
        if (enemy.canJump) {
          enemy.velocity.y = -20;
          enemy.canJump = false;
        }
        break;
      case 'k':
        enemy.attack();
        break;
    }
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
