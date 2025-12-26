        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const dogeAddress = "D775iKxVWVdYLu93yPNiMFATGLxvEvoYPh";
        
        let animationId;
        let gameActive = false;
        let score = 0;
        let highScore = parseInt(localStorage.getItem('santaCatchHighScore')) || 0;
        let lives = 3;
        let lastTime = 0;
        let itemTimer = 0;
        let items = [];
        let player = {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            targetX: 0
        };

        document.getElementById('high-score').innerText = highScore;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const bottomOffset = window.innerWidth < 768 ? 140 : 180;
            player.y = canvas.height - bottomOffset; 
            player.x = canvas.width / 2 - player.width / 2;
            player.targetX = player.x;
        }

        window.addEventListener('resize', resize);
        resize();

        function createSnow() {
            const container = document.getElementById('snow-container');
            container.innerHTML = '';
            const count = window.innerWidth < 768 ? 30 : 60;
            for (let i = 0; i < count; i++) {
                const snowflake = document.createElement('div');
                snowflake.className = 'snowflake';
                snowflake.innerHTML = '❄';
                snowflake.style.left = Math.random() * 100 + 'vw';
                snowflake.style.fontSize = Math.random() * 10 + 8 + 'px';
                snowflake.style.animation = `snow-fall ${Math.random() * 5 + 5}s linear infinite`;
                snowflake.style.animationDelay = `-${Math.random() * 10}s`;
                snowflake.style.opacity = Math.random() * 0.5 + 0.3;
                container.appendChild(snowflake);
            }
        }
        createSnow();

        class FallingItem {
            constructor() {
                this.width = 45;
                this.height = 45;
                this.x = Math.random() * (canvas.width - this.width);
                this.y = -60;
                this.speed = Math.random() * 2 + 3 + (score / 15);
                this.isCoal = Math.random() > 0.85;
                this.emoji = this.isCoal ? '🌑' : ['🎁', '🎁', '🍭', '⭐', '🎄', '🍪'][Math.floor(Math.random() * 6)];
                this.rotation = 0;
                this.rotSpeed = (Math.random() - 0.5) * 0.15;
            }

            update() {
                this.y += this.speed;
                this.rotation += this.rotSpeed;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                ctx.rotate(this.rotation);
                
                if(!this.isCoal) {
                    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
                    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(0, 0, 30, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.font = this.isCoal ? '32px Arial' : '42px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                ctx.shadowBlur = 10;
                ctx.fillText(this.emoji, 0, 0);
                ctx.restore();
            }
        }

        function startGame() {
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('game-over').classList.add('hidden');
            document.getElementById('header-hud').classList.remove('opacity-0');
            gameActive = true;
            score = 0;
            lives = 3;
            items = [];
            itemTimer = 0;
            updateUI();
            requestAnimationFrame(gameLoop);
        }

        function showMainMenu() {
            document.getElementById('game-over').classList.add('hidden');
            document.getElementById('start-screen').classList.remove('hidden');
            document.getElementById('header-hud').classList.add('opacity-0');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        function gameOver() {
            gameActive = false;
            cancelAnimationFrame(animationId);
            
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('santaCatchHighScore', highScore);
                document.getElementById('high-score').innerText = highScore;
                document.getElementById('new-record-msg').classList.remove('hidden');
            } else {
                document.getElementById('new-record-msg').classList.add('hidden');
            }

            document.getElementById('game-over').classList.remove('hidden');
            document.getElementById('final-score').innerText = score;
        }

        function updateUI() {
            document.getElementById('score').innerText = score;
            document.getElementById('lives').innerText = '❤️'.repeat(lives);
        }

        function toggleModal(id, show) {
            document.getElementById(id).classList.toggle('hidden', !show);
        }

        window.addEventListener('mousemove', (e) => {
            if (!gameActive) return;
            player.targetX = e.clientX - player.width / 2;
        });

        window.addEventListener('touchmove', (e) => {
            if (!gameActive) return;
            e.preventDefault();
            player.targetX = e.touches[0].clientX - player.width / 2;
        }, { passive: false });

        window.addEventListener('keydown', (e) => {
            if (!gameActive) return;
            if (e.key === 'ArrowLeft') player.targetX -= 50;
            if (e.key === 'ArrowRight') player.targetX += 50;
        });

        function gameLoop(timestamp) {
            if (!gameActive) return;

            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            player.x += (player.targetX - player.x) * 0.2;

            if (player.x < 0) { player.x = 0; player.targetX = 0; }
            if (player.x > canvas.width - player.width) { 
                player.x = canvas.width - player.width; 
                player.targetX = canvas.width - player.width; 
            }

            ctx.font = '90px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🎅', player.x + player.width / 2, player.y + 80);

            itemTimer += deltaTime;
            const spawnRate = Math.max(250, 900 - (score * 8));
            if (itemTimer > spawnRate) {
                items.push(new FallingItem());
                itemTimer = 0;
            }

            for (let i = items.length - 1; i >= 0; i--) {
                const item = items[i];
                item.update();
                item.draw();

                if (
                    item.y + item.height > player.y + 20 &&
                    item.y < player.y + player.height &&
                    item.x + 5 + item.width - 10 > player.x + 10 &&
                    item.x + 5 < player.x + player.width - 10
                ) {
                    if (item.isCoal) {
                        lives--;
                        items.splice(i, 1);
                        updateUI();
                        if (lives <= 0) gameOver();
                    } else {
                        score++;
                        items.splice(i, 1);
                        updateUI();
                    }
                    continue;
                }

                if (item.y > canvas.height) {
                    if (!item.isCoal) {
                        lives--;
                        updateUI();
                        if (lives <= 0) gameOver();
                    }
                    items.splice(i, 1);
                }
            }

            animationId = requestAnimationFrame(gameLoop);
        }

        function copyAddress() {
            // Updated to be more reliable in all environments
            const textArea = document.createElement("textarea");
            textArea.value = dogeAddress;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                const toast = document.getElementById('toast');
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
            } catch (err) {
                console.error('Copy failed', err);
            }
            document.body.removeChild(textArea);
        }
