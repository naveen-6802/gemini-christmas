        document.addEventListener('DOMContentLoaded', () => {
            
            // ==========================================
            //       DOMAIN LOCK (SECURITY FEATURE)
            // ==========================================
            /* INSTRUCTIONS: 
               1. Test this code now. It works everywhere.
               2. Before uploading to 'gemini.christmas', UNCOMMENT the block below.
            */

            /* UNCOMMENT FOR PRODUCTION START 
            (function secureDomain() {
                const requiredDomain = "gemini.christmas";
                const currentDomain = window.location.hostname;
                
                // Allow localhost for testing if needed, otherwise strict check
                if (currentDomain !== requiredDomain && currentDomain !== 'localhost') {
                   document.body.innerHTML = `
                        <div style="height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; background:#0f0202; color:#ff0033; font-family:'VT323', monospace; text-align:center;">
                            <h1 style="font-size:4rem; margin-bottom:10px;">403 ERROR</h1>
                            <p style="font-size:1.5rem;">UNAUTHORIZED ACCESS DETECTED.</p>
                            <p>Protocol bound to ${requiredDomain}</p>
                        </div>
                    `;
                   throw new Error("Unauthorized Domain Access: Execution Halted.");
                }
            })();
            UNCOMMENT FOR PRODUCTION END */
            // ==========================================

            const chatContainer = document.getElementById('chat-container');
            const userInput = document.getElementById('user-input');
            const sendBtn = document.getElementById('send-btn');
            const newChatBtn = document.querySelector('.new-chat-btn');
            const themeBtns = [document.getElementById('theme-btn'), document.getElementById('mobile-theme')];
            
            // Modal Elements
            const donateBtns = [document.getElementById('donate-btn-sidebar'), document.getElementById('mobile-donate')];
            const aboutBtn = document.getElementById('about-btn-sidebar');
            const donateModal = document.getElementById('donate-modal');
            const aboutModal = document.getElementById('about-modal');
            
            // Sidebar Mobile Elements
            const sidebar = document.getElementById('sidebar');
            const menuBtn = document.getElementById('menu-btn');
            const closeSidebarBtn = document.getElementById('close-sidebar');
            const overlay = document.getElementById('sidebar-overlay');

            let isTyping = false;

            // --- MOBILE SIDEBAR LOGIC ---
            function openSidebar() {
                sidebar.classList.add('active');
                overlay.classList.add('active');
            }
            function closeSidebar() {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }

            menuBtn?.addEventListener('click', openSidebar);
            closeSidebarBtn?.addEventListener('click', closeSidebar);
            overlay?.addEventListener('click', closeSidebar);

            // --- THEME TOGGLE LOGIC ---
            function toggleTheme() {
                document.body.classList.toggle('dark-theme');
            }
            themeBtns.forEach(btn => btn?.addEventListener('click', toggleTheme));

            // --- MODAL LOGIC ---
            
            // Donate Modal
            donateBtns.forEach(btn => btn?.addEventListener('click', () => {
                donateModal.style.display = 'flex';
                if(window.innerWidth <= 768) closeSidebar();
            }));

            // About Modal
            aboutBtn?.addEventListener('click', () => {
                aboutModal.style.display = 'flex';
                if(window.innerWidth <= 768) closeSidebar();
            });

            // Close Functions (exposed to window for onclick HTML attributes)
            window.closeDonateModal = function() {
                donateModal.style.display = 'none';
            };
            
            window.closeAboutModal = function() {
                aboutModal.style.display = 'none';
            };

            // Close when clicking outside modal
            donateModal.addEventListener('click', (e) => {
                if(e.target === donateModal) window.closeDonateModal();
            });
            aboutModal.addEventListener('click', (e) => {
                if(e.target === aboutModal) window.closeAboutModal();
            });

            window.copyToClipboard = function() {
                const addr = document.getElementById('wallet-address').innerText;
                navigator.clipboard.writeText(addr).then(() => {
                    alert("Address copied to clipboard!");
                }).catch(() => {
                    prompt("Copy address below:", addr);
                });
            };

            // --- CHAT LOGIC ---

            // Reset Chat
            newChatBtn.addEventListener('click', () => {
                chatContainer.innerHTML = '<div class="message ai-msg"><span class="ai-icon">Gemini ♦</span>System reset complete. Ready for input.</div>';
                if(window.innerWidth <= 768) closeSidebar();
            });

            // Send Message
            function sendMessage() {
                const text = userInput.value.trim();
                if (!text || isTyping) return;

                // 1. Add User Message
                addMessage(text, 'user-msg');
                userInput.value = '';

                // 2. CHECK INPUT LENGTH
                if (text.length > 500) {
                    setTimeout(() => {
                        const errorDiv = document.createElement('div');
                        errorDiv.classList.add('message', 'ai-msg', 'error-msg');
                        errorDiv.innerHTML = '<span class="ai-icon">Gemini ♦</span>System Alert: Input too long. This is just only coded for wishing christmas.';
                        chatContainer.appendChild(errorDiv);
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                    }, 500);
                    return; // Stop execution here
                }

                // 3. AI Thinking Simulation
                isTyping = true;
                
                const loadingDiv = document.createElement('div');
                loadingDiv.classList.add('message', 'ai-msg');
                loadingDiv.id = 'loading-indicator';
                loadingDiv.innerHTML = '<span class="ai-icon">Gemini ♦</span><span class="blink">_</span> processing...';
                chatContainer.appendChild(loadingDiv);
                chatContainer.scrollTop = chatContainer.scrollHeight;

                setTimeout(() => {
                    loadingDiv.remove();
                    triggerChristmasMode();
                }, 800);
            }

            function addMessage(text, className) {
                const div = document.createElement('div');
                div.classList.add('message', className);
                div.textContent = text;
                chatContainer.appendChild(div);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }

            function triggerChristmasMode() {
                const responseDiv = document.createElement('div');
                responseDiv.classList.add('message', 'ai-msg', 'christmas-response');
                chatContainer.appendChild(responseDiv);
                
                // Add Icon first
                responseDiv.innerHTML = '<span class="ai-icon">Gemini ♦</span>';
                
                // Text to type
                const phrase = "MERRY CHRISTMAS! 🎄🎅\n\nAnalyzed your request... \nResult: Wishing you joy, peace, and happiness this holiday season.";
                
                // Create a text node for typing
                const textNode = document.createTextNode("");
                responseDiv.appendChild(textNode);

                let i = 0;
                const typeInterval = setInterval(() => {
                    textNode.nodeValue += phrase.charAt(i);
                    i++;
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                    
                    if (i >= phrase.length) {
                        clearInterval(typeInterval);
                        isTyping = false;
                        createSnowStorm();
                    }
                }, 40);
            }

            function createSnowStorm() {
                let count = 0;
                const snowInterval = setInterval(() => {
                    createSnowflake();
                    count++;
                    if(count > 30) clearInterval(snowInterval);
                }, 100);
            }

            function createSnowflake() {
                const snow = document.createElement('div');
                snow.classList.add('snowflake');
                const shapes = ['❄', '❅', '❆', '.', '+', '*'];
                snow.textContent = shapes[Math.floor(Math.random() * shapes.length)];
                
                snow.style.left = Math.random() * 100 + 'vw';
                snow.style.fontSize = (Math.random() * 20 + 10) + 'px';
                
                const duration = Math.random() * 4 + 4; // Slower, nicer fall
                snow.style.animationDuration = duration + 's';
                
                document.body.appendChild(snow);

                setTimeout(() => {
                    snow.remove();
                }, duration * 1000);
            }

            // Event Listeners
            sendBtn.addEventListener('click', sendMessage);
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        });
