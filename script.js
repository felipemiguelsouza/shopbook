// gradient.js — Gradiente animado suave em branco, cinza claro e cinza médio

(function () {
    const canvas = document.getElementById('gradient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;

    // Pontos de cor flutuantes — paleta refinada branco/cinza
    const points = [
        { x: 0.10, y: 0.10, vx:  0.00028, vy:  0.00019, color: [250, 250, 248] }, // branco quente
        { x: 0.80, y: 0.15, vx: -0.00021, vy:  0.00033, color: [225, 224, 220] }, // cinza claro
        { x: 0.50, y: 0.82, vx:  0.00035, vy: -0.00026, color: [185, 183, 178] }, // cinza médio
        { x: 0.22, y: 0.58, vx: -0.00018, vy: -0.00030, color: [243, 242, 239] }, // branco suave
        { x: 0.88, y: 0.72, vx:  0.00024, vy:  0.00018, color: [208, 206, 202] }, // cinza suave
        { x: 0.40, y: 0.35, vx: -0.00030, vy:  0.00022, color: [235, 234, 230] }, // cinza clarinho
    ];

    function resize() {
        width  = canvas.width  = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function tick() {
        // Move pontos e rebate nas bordas
        for (const p of points) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x <= 0 || p.x >= 1) { p.vx *= -1; p.x = Math.max(0, Math.min(1, p.x)); }
            if (p.y <= 0 || p.y >= 1) { p.vy *= -1; p.y = Math.max(0, Math.min(1, p.y)); }
        }

        // Renderiza em baixa resolução e escala para suavidade
        const SCALE = 5;
        const w = Math.ceil(width  / SCALE);
        const h = Math.ceil(height / SCALE);
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;

        for (let py = 0; py < h; py++) {
            const fy = py / h;
            for (let px = 0; px < w; px++) {
                const fx = px / w;
                let r = 0, g = 0, b = 0, total = 0;

                for (const p of points) {
                    const dx = fx - p.x;
                    const dy = fy - p.y;
                    const w2 = 1 / (dx * dx + dy * dy + 0.0008);
                    r += p.color[0] * w2;
                    g += p.color[1] * w2;
                    b += p.color[2] * w2;
                    total += w2;
                }

                const idx = (py * w + px) * 4;
                data[idx]     = r / total;
                data[idx + 1] = g / total;
                data[idx + 2] = b / total;
                data[idx + 3] = 255;
            }
        }

        // Usa offscreen canvas para escalar
        const off = document.createElement('canvas');
        off.width = w; off.height = h;
        off.getContext('2d').putImageData(imageData, 0, 0);

        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(off, 0, 0, width, height);
        ctx.restore();

        requestAnimationFrame(tick);
    }

    window.addEventListener('resize', resize);
    resize();
    tick();
})();