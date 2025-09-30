// assets/seasonal.js - Осенние анимации и интерактивность
class AutumnTheme {
    constructor() {
        this.decorations = [];
        this.init();
    }

    init() {
        this.createDecorations();
        this.addInteractivity();
    }

    createDecorations() {
        const decorationConfig = [
            // Тыквы в углах
            { type: 'pumpkin', top: '5%', left: '3%', scale: 0.9 },
            { type: 'pumpkin', top: '10%', left: '92%', scale: 1.1 },
            { type: 'pumpkin', top: '82%', left: '4%', scale: 0.8 },
            { type: 'pumpkin', top: '78%', left: '88%', scale: 1.2 },
            
            // Паутинки
            { type: 'spider-web', top: '3%', left: '15%', scale: 1 },
            { type: 'spider-web', top: '8%', left: '70%', scale: 0.9 },
            { type: 'spider-web', top: '87%', left: '20%', scale: 1.1 },
            { type: 'spider-web', top: '90%', left: '75%', scale: 0.8 },
            
            // Призраки
            { type: 'ghost', top: '25%', left: '12%', scale: 1 },
            { type: 'ghost', top: '35%', left: '82%', scale: 0.9 },
            { type: 'ghost', top: '65%', left: '18%', scale: 1.1 },
            { type: 'ghost', top: '55%', left: '85%', scale: 0.8 },
            
            // Свечи
            { type: 'candle', top: '15%', left: '25%', scale: 1 },
            { type: 'candle', top: '20%', left: '60%', scale: 0.8 },
            { type: 'candle', top: '70%', left: '30%', scale: 1.2 },
            { type: 'candle', top: '75%', left: '65%', scale: 0.9 }
        ];

        decorationConfig.forEach(config => {
            const element = this.createDecorationElement(config);
            document.body.appendChild(element);
            this.decorations.push(element);
        });
    }

    createDecorationElement(config) {
        const element = document.createElement('div');
        element.className = `seasonal-decoration ${config.type}`;
        element.style.top = config.top;
        element.style.left = config.left;
        element.style.transform = `scale(${config.scale})`;
        
        // Случайные вариации анимации
        if (config.type === 'pumpkin') {
            const delay = Math.random() * 5;
            element.style.animationDelay = `${delay}s`;
        }
        
        return element;
    }

    addInteractivity() {
        // Тыквы реагируют на курсор
        document.addEventListener('mousemove', (e) => {
            this.decorations.forEach(decoration => {
                if (decoration.classList.contains('pumpkin')) {
                    this.handlePumpkinHover(decoration, e);
                }
            });
        });

        // Клик по тыкве - особенная анимация
        document.addEventListener('click', (e) => {
            this.decorations.forEach(decoration => {
                if (decoration.classList.contains('pumpkin')) {
                    const rect = decoration.getBoundingClientRect();
                    const distance = this.getDistance(e.clientX, e.clientY, rect);
                    
                    if (distance < 100) {
                        this.triggerPumpkinAnimation(decoration);
                    }
                }
            });
        });
    }

    handlePumpkinHover(pumpkin, e) {
        const rect = pumpkin.getBoundingClientRect();
        const pumpkinCenterX = rect.left + rect.width / 2;
        const pumpkinCenterY = rect.top + rect.height / 2;
        
        const distance = this.getDistance(e.clientX, e.clientY, rect);
        const maxDistance = 200;
        
        if (distance < maxDistance) {
            const intensity = 1 - (distance / maxDistance);
            const scale = 1 + intensity * 0.3;
            const rotate = intensity * 10;
            
            pumpkin.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
            pumpkin.style.filter = `drop-shadow(0 8px 16px rgba(255, 152, 0, ${intensity * 0.5}))`;
        } else {
            pumpkin.style.transform = '';
            pumpkin.style.filter = '';
        }
    }

    triggerPumpkinAnimation(pumpkin) {
        pumpkin.style.animation = 'none';
        void pumpkin.offsetWidth; // Trigger reflow
        
        // Специальная анимация при клике
        pumpkin.style.animation = 'float 1s ease-in-out, blink 0.5s infinite';
        
        setTimeout(() => {
            pumpkin.style.animation = '';
            // Возвращаем обычную анимацию
            setTimeout(() => {
                pumpkin.style.animation = 'float 8s ease-in-out infinite, blink 4s infinite, glow 3s infinite alternate';
            }, 100);
        }, 1000);
    }

    getDistance(x, y, rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        return Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    }
}

// Инициализация когда DOM загружен
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AutumnTheme();
    });
} else {
    new AutumnTheme();
}