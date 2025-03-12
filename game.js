const config = {
    type: Phaser.AUTO,
    backgroundColor: '#59501b',
    width: 318,
    height: 500,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }, // Гравитация для падающих объектов
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let keys;
let items;
let score = 0;
let scoreText;

function preload() {
    this.load.atlas('character', 'assets/burger.png', 'assets/spritesheet.json');
    this.load.image('item', 'assets/item.png'); // Загрузите изображение для падающих объектов
}

function create() {
    // Создание анимаций
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNames('character', {
            prefix: 'anim4_frame',
            start: 0,
            end: 1,
            zeroPad: 0
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNames('character', {
            prefix: 'anim5_frame',
            start: 0,
            end: 1,
            zeroPad: 0
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: [{ key: 'character', frame: 'anim4_frame0' }],
        frameRate: 10
    });

    // Создание персонажа
    player = this.physics.add.sprite(150, 450, 'character', 'anim4_frame0');
    player.setCollideWorldBounds(true);
    player.setScale(2);

    // Настройка управления
    cursors = this.input.keyboard.createCursorKeys();
    keys = {
        A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    // Создание группы для падающих объектов
    items = this.physics.add.group();

    // Создание текста для отображения счета
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '20px', fill: '#fff' });

    // Создание таймера для генерации падающих объектов
    this.time.addEvent({
        delay: 1000, // Интервал между падением объектов (1 секунда)
        callback: spawnItem,
        callbackScope: this,
        loop: true
    });

    // Настройка коллизии между персонажем и объектами
    this.physics.add.overlap(player, items, collectItem, null, this);
}

function update() {
    // Управление персонажем
    if (keys.A.isDown) {
        player.setVelocityX(-160); // Движение влево
        player.anims.play('left', true);
        player.flipX = true; // Отразить персонажа, если движется влево
    } else if (keys.D.isDown) {
        player.setVelocityX(160); // Движение вправо
        player.anims.play('right', true);
        player.flipX = false; // Не отражать, если движется вправо
    } else {
        player.setVelocityX(0); // Остановка
        player.anims.play('idle', true); // Анимация покоя
    }
}

function spawnItem() {
    // Создание падающего объекта в случайной позиции по X
    const x = Phaser.Math.Between(0, config.width);
    const item = items.create(x, 0, 'item');
    item.setVelocityY(Phaser.Math.Between(100, 200)); // Случайная скорость падения
}

function collectItem(player, item) {
    // Уничтожение объекта при столкновении с персонажем
    item.disableBody(true, true);

    // Увеличение счета
    score += 10;
    scoreText.setText('Score: ' + score);
}