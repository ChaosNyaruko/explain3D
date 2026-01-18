const  BACKGROUND = "#efefef"
const  FOREGROUND = "#101010"
game.width = 800
game.height = 800

const ctx = game.getContext("2d")

function clear() {
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0, 0, game.width, game.height)
}

function point({x, y}) {
    const s = 20;
    ctx.fillStyle = FOREGROUND;
    ctx.fillRect(x-s/2, y-s/2, s, s);
}

function screen({x, y}) {
    // -1..1 -> 0..width
    // -1..1 -> 0..height
    return {
        x: (x + 1) / 2 * game.width,
        y: (1 - (y + 1) / 2) * game.height,
    }
}

function project({x, y, z}) {
    return {
        x: x / z, 
        y: y / z,
    }
}

function rotate_xz({x, y, z}, angle) {
    //  x' = x cos θ − y sin θ
    // y' = x sin θ + y cos θ
    return {
        x: x * Math.cos(angle) - z * Math.sin(angle),
        y: y,
        z: x * Math.sin(angle) + z * Math.cos(angle),
    }
}

function add_z({x, y, z}, dz) {
    return {
        x: x,
        y: y, 
        z: z + dz,
    }
}

function line(p1, p2) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = FOREGROUND;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

const FPS = 60;
let dz = 5;
let angle = 0;

function frame() {
    // dz += 1/FPS * 1;
    const dt = 1/FPS;
    angle += Math.PI * 2 * dt;
    clear();

    for (const f of fs) {
        for (let i = 0; i < f.length; ++i) {
            const a = vs[f[i]];
            const b = vs[f[(i+1)%f.length]];
            const c = screen(project(add_z(rotate_xz(a, angle), dz)));
            const d = screen(project(add_z(rotate_xz(b, angle), dz)));
            line(c,d);
        }
    }
    setTimeout(frame, 1000/FPS);
}

setTimeout(frame, 1000/FPS);
