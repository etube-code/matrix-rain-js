const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

const CHAR_SET = "アァカサタナハマヤャラワガザダバパ0123456789@#$%&*+-<>";

let layers = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initLayers();
}

window.addEventListener("resize", resize);

function initLayers() {
    layers = [
        createLayer(18, 1.6, "#00ff66"), // Foreground
        createLayer(14, 1.0, "#00cc55"), // Midground
        createLayer(10, 0.6, "#003311")  // Background
    ];
}

function createLayer(fontSize, speed, color) {
    const columns = Math.floor(canvas.width / (fontSize * 3));
    const drops = Array.from({ length: columns }, () => Math.random() * canvas.height);
    const chars = Array.from({ length: columns }, () =>
        Array.from({ length: 20 }, () => randomChar())
    );

    return { fontSize, speed, color, columns, drops, chars };
}

function randomChar() {
    return CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];
}

function drawLayer(layer) {
    ctx.font = `${layer.fontSize}px monospace`;

    for (let i = 0; i < layer.columns; i++) {
        const x = i * layer.fontSize * 3;
        let y = layer.drops[i];

        // %1 chance to mutate a character
        if (Math.random() < 0.01) {
            const idx = Math.floor(Math.random() * layer.chars[i].length);
            layer.chars[i][idx] = randomChar();
        }

        for (let j = 0; j < layer.chars[i].length; j++) {
            // Randomize character each frame
            layer.chars[i][j] = randomChar();

            const charY = y - j * layer.fontSize;
            if (charY < 0) continue;

            if (j === 0) {
                ctx.fillStyle = "#ffffff";
                ctx.shadowColor = "#ffffff";
                ctx.shadowBlur = 12;
            } else {
                ctx.fillStyle = layer.color;
                ctx.shadowBlur = 0;
            }

            ctx.fillText(layer.chars[i][j], x, charY);
        }

        layer.drops[i] += layer.speed * layer.fontSize;

        if (layer.drops[i] > canvas.height + 100) {
            layer.drops[i] = Math.random() * -200;
        }
    }
}

function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    layers.forEach(drawLayer);
    requestAnimationFrame(animate);
}

resize();
animate();

