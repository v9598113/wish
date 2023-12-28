let yStart;
let myTextSize = 32;
let inputValue = "";

let particlesSystem1 = [];
let particlesSystem2 = [];
let noiseScale, t;
let alphaIncrement = 2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(myTextSize);
  inputBox = createInput('輸入你的心願');
  inputBox.position(width / 2 - 100, height - 50);
  inputBox.style('opacity', '0.6');
  button = createButton('送出');
  button.position(width / 2 + 20, height - 52);
  button.mousePressed(showText);
  clearButton = createButton('Clear');
  clearButton.position(width / 2 + 120, height - 50);
  clearButton.mousePressed(clearText);

  yStart = height;
  noiseScale = 0.01;
  noiseDetail(8, 0.15);

  // 初始化第一個粒子系統
  initParticles(particlesSystem1);

  // 初始化第二個粒子系統
  initParticles(particlesSystem2);

  t = 0;
}

function initParticles(particles) {
  for (let i = 0; i < 10; i++) {
    particles[i] = new Particle(width / 2, height, random(1, 2), random(0, 10));
  }
}

function draw() {
  background(0);

  // 判斷文字是否在畫布範圍內
  if (yStart > -myTextSize) {
    let alpha = map(yStart, height, 0, 255, 0);
    alpha = constrain(alpha, 0, 255);
    fill(200, alpha);

    // 使用噪音來產生微小的位置變化，並調整速度和距離
    let xNoise = noise(t * 0.1) * 20 - 10; // 調整速度和範圍
    let yNoise = noise(t * 0.1 + 100) * 5; // 調整距離

    text(inputValue, width / 2 + xNoise, yStart + yNoise);

    // 更新文字位置，實現由下往上的滾動效果
    yStart -= 2;
  }

  // 更新和繪製第一個粒子系統
  updateAndDisplayParticles(particlesSystem1);

  // 更新和繪製第二個粒子系統
  updateAndDisplayParticles(particlesSystem2);

  t += 1;
}

function updateAndDisplayParticles(particles) {
  let particlesDead = 0;
  for (let i = 0; i < particles.length; i++) {
    particles[i].reset(t);
  }
  while (particlesDead === 0) {
    particlesDead = 1;
    for (let i = 0; i < particles.length; i++) {
      if (!particles[i].isDead()) {
        particles[i].update();
        particles[i].display();
        particlesDead = 0;
      }
    }
  }
}

function showText() {
  inputValue = inputBox.value();
}

function clearText() {
  inputValue = "";
  yStart = height;

  // 重置第一個粒子系統
  initParticles(particlesSystem1);

  // 重置第二個粒子系統
  initParticles(particlesSystem2);

  t = 0;
}

class Particle {
  constructor(x, y, R, t) {
    this.x = x;
    this.y = y;
    this.R = R;
    this.t = t;
    this.init = t;
    this.alpha = random(10, 40);
    this.z = 0;
  }

  update() {
    let theta = noise(this.x * noiseScale, this.y * noiseScale, this.t * noiseScale) * 2 * PI;
    this.x += this.R * cos(theta);
    this.y += -this.R * abs(sin(theta));
    this.t++;
  }

  isDead() {
    if (this.x > width || this.x < 0 || this.y > height || this.y < 0) {
      return true;
    } else {
      return false;
    }
  }

  reset(t) {
    this.x = width / 2;
    this.y = height;
    this.t = this.init + t;
  }

  display() {
    noStroke();
    fill(220, this.alpha);
    ellipse(this.x, this.y, this.R * 2, this.R * 2);
  }
}
