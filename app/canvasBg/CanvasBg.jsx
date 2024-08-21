import { useEffect, useRef } from 'react';

class Scene {
    constructor() {
        this.animation = undefined;
        this.canvas = undefined;
        this.height = 0;
        this.width = 0;
        this.context = undefined;
        this.paused = false;
        this.stats = undefined;
        this.istats = undefined;
    }

    setup(canvas, animation, width, height, stats) {
        this.canvas = canvas;
        this.animation = animation;
        this.height = this.canvas.height = height;
        this.width = this.canvas.width = width;
        this.context = this.canvas.getContext('2d');
        this.stats = stats && window.Stats;
        if (this.stats) {
            this.istats = new Stats();
            this.istats.showPanel(0);
            document.body.appendChild(this.istats.dom);
        }
    }

    animate() {
        if (!this.paused) {
            window.requestAnimationFrame(this.animate.bind(this));
        }
        this.stats && this.istats.begin();
        this.animation(this);
        this.stats && this.istats.end();
    }
}

class Particle {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 0;
        this.depth = 0;
        this.vy = 0;
    }

    update(width, height) {
        this.y -= this.vy;
        if (this.y < -this.size) {
            this.y = height;
        } else if (this.y > height) {
            this.y = -this.size;
        }
        if (this.x < -this.size) {
            this.x = width;
        } else if (this.x > width) {
            this.x = -this.size;
        }
    }
}

export default function CanvasBg() {
    const canvasRef = useRef(null);
    const sceneRef = useRef(new Scene());
    const particlesRef = useRef([]);
    const scrollOffsetRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const scene = sceneRef.current;

        const width = window.innerWidth;
        const height = window.innerHeight;

        const len = 100;
        const particles = [];

        for (let i = 0; i < len; i++) {
            const particle = new Particle();
            particle.x = Math.random() * width;
            particle.y = Math.random() * height;
            particle.depth = Math.random() * 10 | 0;
            particle.size = (particle.depth + 1) / 8;
            particle.vy = ((particle.depth * 0.25) + 1 / Math.random()) / 10;
            particles.push(particle);
        }

        particlesRef.current = particles;

        const risingParticles = function () {
            const idata = scene.context.createImageData(scene.width, scene.height);
            const scrollOffset = scrollOffsetRef.current;

            for (let i = 0, l = particles.length; i < l; i++) {
                const particle = particles[i];
                // Wrap around logic
                const posX = (particle.x - scrollOffset.x) % scene.width;
                const posY = (particle.y - scrollOffset.y) % scene.height;

                for (let w = 0; w < particle.size; w++) {
                    for (let h = 0; h < particle.size; h++) {
                        const px = ((~~(posX + w) + scene.width) % scene.width + ((~~(posY + h) + scene.height) % scene.height) * scene.width) * 4;
                        idata.data[px] = 255;
                        idata.data[px + 1] = 255;
                        idata.data[px + 2] = 255;
                        idata.data[px + 3] = 255;
                    }
                }
                particle.update(scene.width, scene.height);
            }
            scene.context.putImageData(idata, 0, 0);
        };

        scene.setup(canvas, risingParticles, width, height, true);
        scene.animate();

        const handleResize = () => {
            scene.height = scene.canvas.height = window.innerHeight;
            scene.width = scene.canvas.width = window.innerWidth;
        };

        const handleScroll = (e) => {
            scrollOffsetRef.current.y = e.target.scrollingElement.scrollTop;
            scrollOffsetRef.current.x = e.target.scrollingElement.scrollLeft;
            canvas.style.transform = `translate(${scrollOffsetRef.current.x}px, ${scrollOffsetRef.current.y}px)`;
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return <canvas style={{ position: 'absolute', top: 0, left: 0 }} ref={canvasRef} />;
}
