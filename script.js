let matrixInterval;
const YOUTUBE_CHANNELS = [
    { id: "UCi7MICOBujlvvPTxEb10FUQ", type: "cs2", subtitle: "Channel: JoJos (Pro POV gameplay)" },
    { id: "UCQMGgEYYYBuGGgH1L1OGYPQ", type: "ut", subtitle: "Channel: Old Games Gameplay" }
];

// Configuration API Google Cloud pour récupérer les vues
const YT_API_KEY = "AIzaSyBePk6S-cPENbXedT01dGS3QL1c6iy-oo0"; 

// Gestion de l'historique des commandes saisies dans le terminal (comme sous Linux)
let commandHistory = [];
let historyIndex = -1;

// --- 1. FAUX CHARGEMENT ET ENTRÉE DU SYSTÈME ---
function runSystemLoader() {
    const progress = document.getElementById("load-progress");
    const percentText = document.getElementById("load-percentage");
    const loaderScreen = document.getElementById("loader-screen");
    const mainContent = document.getElementById("main-content");
    const loaderContent = document.querySelector(".loader-content");
    
    let count = 0;
    const speed = 12;

    const loadingInterval = setInterval(() => {
        count += Math.floor(Math.random() * 4) + 1;
        if(count > 100) count = 100;
        
        if (progress) progress.style.width = count + "%";
        if (percentText) percentText.innerText = count + "%";
        
        if(count === 100) {
            clearInterval(loadingInterval);
            
            setTimeout(() => {
                if (percentText) percentText.style.display = "none";
                const bar = document.querySelector(".loader-bar-container");
                if (bar) bar.style.display = "none";
                
                const enterBtn = document.createElement("div");
                enterBtn.className = "cyber-enter-btn";
                enterBtn.innerText = "[ PRESS ANYWHERE TO ENGAGE SYSTEM ]";
                if (loaderContent) loaderContent.appendChild(enterBtn);
                
                loaderScreen?.addEventListener('click', () => {
                    window.myAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    playClickSound();
                    
                    if (loaderScreen) {
                        loaderScreen.style.opacity = "0";
                        loaderScreen.style.visibility = "hidden";
                    }
                    mainContent?.classList.add("visible");
                    
                    runGlitchEffect();
                });
            }, 300);
        }
    }, speed);
}

// --- 2. RETRO SOUND DESIGN ---
function playTechBeep() {
    try {
        if (!window.myAudioCtx) window.myAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (window.myAudioCtx.state === 'suspended') window.myAudioCtx.resume();
        
        const oscillator = window.myAudioCtx.createOscillator();
        const gainNode = window.myAudioCtx.createGain();
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(120, window.myAudioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.15, window.myAudioCtx.currentTime); 
        gainNode.gain.exponentialRampToValueAtTime(0.00001, window.myAudioCtx.currentTime + 0.02);
        
        oscillator.connect(gainNode);
        gainNode.connect(window.myAudioCtx.destination);
        oscillator.start(); oscillator.stop(window.myAudioCtx.currentTime + 0.02);
    } catch(e) {}
}

function playClickSound() {
    try {
        const oscillator = window.myAudioCtx.createOscillator();
        const gainNode = window.myAudioCtx.createGain();
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(180, window.myAudioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.20, window.myAudioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, window.myAudioCtx.currentTime + 0.05);
        
        oscillator.connect(gainNode);
        gainNode.connect(window.myAudioCtx.destination);
        oscillator.start(); oscillator.stop(window.myAudioCtx.currentTime + 0.05);
    } catch(e) {}
}

function attachAudioToElement(el) {
    el.addEventListener('mouseenter', playTechBeep);
    el.addEventListener('click', playClickSound);
}

if (typeof initAudioFX === 'undefined') {
    function initAudioFX() {
        document.querySelectorAll('.link-btn, .tab-btn').forEach(el => attachAudioToElement(el));
    }
}

// --- 3. EFFET HOLOGRAMME 3D (TILT) ---
function attachTiltToElement(card) {
    card.addEventListener('mousemove', (e) => {
        const cardRect = card.getBoundingClientRect();
        const cardX = e.clientX - cardRect.left;
        const cardY = e.clientY - cardRect.top;
        const xRotation = -((cardY - cardRect.height / 2) / cardRect.height) * 12;
        const yRotation = ((cardX - cardRect.width / 2) / cardRect.width) * 12;
        card.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
}

function init3DTilt() {
    document.querySelectorAll('.central-panel').forEach(card => attachTiltToElement(card));
}

// --- 4. DIGITAL MATRIX RAIN ---
function initDigitalRain() {
    const canvas = document.getElementById("digital-rain");
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const charSize = 14; const columns = canvas.width / charSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
        ctx.fillStyle = "rgba(3, 3, 6, 0.1)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0, 242, 254, 0.12)"; ctx.font = charSize + "px monospace";
        for (let i = 0; i < drops.length; i++) {
            ctx.fillText(Math.random() > 0.5 ? "0" : "1", i * charSize, drops[i] * charSize);
            if (drops[i] * charSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    if(matrixInterval) clearInterval(matrixInterval);
    matrixInterval = setInterval(draw, 45);
}

// --- 5. GLITCH DE TEXTE MATRIX ---
function runGlitchEffect() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    const target = document.getElementById("username");
    if(!target) return;
    let iterations = 0; const originalValue = target.dataset.value;
    const interval = setInterval(() => {
        target.innerText = originalValue.split("").map((letter, index) => {
            if(index < iterations) return originalValue[index];
            return letters[Math.floor(Math.random() * letters.length)];
        }).join("");
        if(iterations >= originalValue.length) clearInterval(interval);
        iterations += 1 / 3;
    }, 30);
}

// --- 6. GESTION DES ONGLETS (FILTRES DYNAMIQUES) ---
function switchTab(type) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    const secCs2 = document.getElementById('section-cs2');
    const secUt = document.getElementById('section-ut');

    if(type === 'all') {
        secCs2?.classList.remove('hidden');
        secUt?.classList.remove('hidden');
    } else if(type === 'cs2') {
        secCs2?.classList.remove('hidden');
        secUt?.classList.add('hidden');
    } else if(type === 'ut') {
        secCs2?.classList.add('hidden');
        secUt?.classList.remove('hidden');
    }
}

// --- NOUVEAU : FONCTION AUXILIAIRE POUR FOCUS/AFFICHER LE TERMINAL ---
function focusAndShowTerminal() {
    const consoleContainer = document.getElementById('terminal-console');
    const consoleInput = document.getElementById('term-input');
    
    if (consoleContainer) {
        // Enlève la classe de masquage si elle est présente
        consoleContainer.classList.remove('terminal-hidden');
        
        // Fait défiler la page de manière fluide jusqu'au terminal pour qu'il soit visible
        consoleContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        
        // Donne le focus au champ de saisie
        setTimeout(() => { consoleInput?.focus(); }, 300);
    }
}

// --- 7. FLUX YOUTUBE SANS CACHE, VUES REELLES & DOUBLE PARTAGE FLUIDE AUTOFOCUS ---
async function displayContent() {
    const gridCs2 = document.getElementById('content-grid-cs2');
    const gridUt = document.getElementById('content-grid-ut');
    if(!gridCs2 || !gridUt) return;
    
    gridCs2.innerHTML = ""; gridUt.innerHTML = ""; 

    for (const channel of YOUTUBE_CHANNELS) {
        try {
            const cacheBuster = new Date().getTime();
            const rssUrl = encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}&t=${cacheBuster}`);
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
            const data = await response.json();

            if (data.status === 'ok' && data.items) {
                const limit = channel.type === "cs2" ? 6 : 2;
                const targetGrid = channel.type === "cs2" ? gridCs2 : gridUt;
                const videos = data.items.filter(item => !item.title.includes('#Shorts') && !item.title.includes('#shorts'));

                const channelItems = videos.slice(0, limit).map(item => {
                    let videoId = "";
                    if (item.link.includes('v=')) videoId = item.link.split('v=')[1].split('&')[0];
                    return {
                        type: channel.type,
                        title: item.title,
                        subtitle: channel.subtitle,
                        link: item.link,
                        id: videoId,
                        image: item.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                        views: "0" 
                    };
                });

                // Extraction des vues réelles via l'API officielle Google Cloud
                if (channelItems.length > 0 && YT_API_KEY !== "REMPLACE_PAR_TA_CLE_API" && YT_API_KEY !== "") {
                    const videoIdsString = channelItems.map(item => item.id).join(',');
                    try {
                        const statsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIdsString}&key=${YT_API_KEY}`);
                        const statsData = await statsResponse.json();
                        
                        if (statsData.items) {
                            statsData.items.forEach(statsItem => {
                                const matchingVideo = channelItems.find(v => v.id === statsItem.id);
                                if (matchingVideo) {
                                    matchingVideo.views = parseInt(statsItem.statistics.viewCount).toLocaleString('fr-FR');
                                }
                            });
                        }
                    } catch (apiErr) { console.error("Erreur YouTube Stats API :", apiErr); }
                }

                // Génération des structures de cartes dynamiques
                channelItems.forEach((item, index) => {
                    const card = document.createElement('a'); 
                    card.href = item.link; card.target = "_blank"; 
                    card.className = `content-card card-${item.type}`;
                    card.style.animationDelay = `${index * 0.08}s`;
                    
                    card.innerHTML = `
                        <div class="thumbnail-placeholder" style="background-image: url('${item.image}'); background-size: cover; background-position: center;">
                            <span class="play-btn"><i class="fa-solid fa-play"></i></span>
                            <div class="share-actions">
                                <button class="action-btn link-share-btn" title="Copier le lien"><i class="fa-solid fa-link"></i></button>
                                <button class="action-btn discord-share-btn" title="Partage Ultra-Fluide Discord"><i class="fa-brands fa-discord"></i></button>
                            </div>
                        </div>
                        <div class="card-info">
                            <h3>${item.title}</h3>
                            <div class="card-meta">
                                <p>${item.subtitle}</p>
                                <span class="video-views"><i class="fa-solid fa-eye"></i> ${item.views}</span>
                            </div>
                        </div>`;
                    
                    // Action 1 : Copie rapide du lien + Focus Terminal
                    const linkBtn = card.querySelector('.link-share-btn');
                    linkBtn.addEventListener('click', (e) => {
                        e.preventDefault(); e.stopPropagation(); 
                        
                        navigator.clipboard.writeText(item.link).then(() => {
                            playTechBeep();
                            focusAndShowTerminal(); // Affiche et descend jusqu'au terminal
                            writeToTerminal(`[SYSTEM]: Link copied to clipboard -> ${item.title.substring(0, 30)}...`, "success-text");
                            
                            linkBtn.innerHTML = `<i class="fa-solid fa-check"></i>`;
                            setTimeout(() => { linkBtn.innerHTML = `<i class="fa-solid fa-link"></i>`; }, 2000);
                        }).catch(() => { writeToTerminal(`[ERROR]: Failed to copy link`, "error-text"); });
                    });

                    // Action 2 : Partage Discord + Copie automatique + Focus Terminal
                    const discordBtn = card.querySelector('.discord-share-btn');
                    discordBtn.addEventListener('click', (e) => {
                        e.preventDefault(); e.stopPropagation(); 
                        playClickSound();
                        
                        navigator.clipboard.writeText(item.link).then(() => {
                            focusAndShowTerminal(); // Affiche et descend jusqu'au terminal
                            writeToTerminal(`[STREAM]: Video link packed and cached into local memory.`, "success-text");
                            writeToTerminal(`[DISCORD]: Initializing protocol... Press CTRL+V in your chat.`, "reply-text");
                            
                            window.location.href = `discord://-`; 
                            
                            setTimeout(() => {
                                if (document.hasFocus()) {
                                    const encodedMsg = encodeURIComponent(`Regarde ce POV CS2 : ${item.title} 🚀\n${item.link}`);
                                    window.open(`https://discord.com/channels/@me?message=${encodedMsg}`, '_blank');
                                }
                            }, 400);
                        });
                    });
                    
                    targetGrid.appendChild(card);
                    attachAudioToElement(card);
                    attachTransitionTilt(card);
                });
            }
        } catch (error) { console.error("Erreur API Youtube :", error); }
    }
}
function attachTransitionTilt(card) { attachTiltToElement(card); }

// --- 8. VÉRIFICATION SERVEUR CS 1.6 ---
function checkServerStatus() {
    const statusBadge = document.getElementById("server-status");
    if (!statusBadge) return;
    const serverUrl = "http://TON_IP_PUBLIQUE:PORT_DE_TON_SERVEUR"; 

    fetch(serverUrl, { mode: 'no-cors', timeout: 3000 })
        .then(() => { statusBadge.innerText = "ONLINE"; statusBadge.classList.remove("offline"); })
        .catch(() => { statusBadge.innerText = "OFFLINE"; statusBadge.classList.add("offline"); });
}

// --- 9. TERMINAL AVANCÉ ET COMMANDES ACCÈS NOYAU ---
const consoleInput = document.getElementById('term-input');
const consoleContainer = document.getElementById('terminal-console');
const consoleHistory = document.getElementById('term-history');

window.addEventListener('keydown', (e) => {
    if (e.key === '²' || (e.key.toLowerCase() === 't' && document.activeElement !== consoleInput)) {
        e.preventDefault();
        consoleContainer?.classList.toggle('terminal-hidden');
        if (!consoleContainer?.classList.contains('terminal-hidden')) {
            consoleInput?.focus(); playTechBeep();
            consoleContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }
});

if (consoleInput) {
    consoleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = consoleInput.value.trim();
            if (command !== "") {
                commandHistory.push(command);
                historyIndex = commandHistory.length;
                handleTerminalCommand(command);
                consoleInput.value = "";
            }
        }
        else if (e.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                consoleInput.value = commandHistory[historyIndex];
            }
        }
        else if (e.key === 'ArrowDown') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                consoleInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                consoleInput.value = "";
            }
        }
    });
}

function writeToTerminal(text, type = "reply-text") {
    const line = document.createElement('div');
    line.className = `term-line ${type}`; line.innerText = text;
    if (consoleHistory) {
        consoleHistory.appendChild(line);
        consoleHistory.scrollTop = consoleHistory.scrollHeight;
    }
}

function handleTerminalCommand(cmd) {
    const cleanCmd = cmd.toLowerCase().trim();
    writeToTerminal(`> ${cmd}`, "command-text");

    if (cleanCmd === 'help') {
        writeToTerminal("Commandes d'accès noyau :", "system-text");
        writeToTerminal("  status        - Diagnostic réseau du serveur principal", "reply-text");
        writeToTerminal("  matrix        - Overclock du flux binaire d'arrière-plan", "reply-text");
        writeToTerminal("  hardware      - Analyse de la configuration des contrôleurs connectés", "reply-text");
        writeToTerminal("  theme [color] - Altère la couleur d'affichage (red, blue, green, orange)", "reply-text");
        writeToTerminal("  clear         - Purge l'historique du terminal", "reply-text");
    } 
    else if (cleanCmd === 'clear') { if (consoleHistory) consoleHistory.innerHTML = ""; } 
    else if (cleanCmd === 'matrix') {
        writeToTerminal("OVERCLOCKING DIGITAL RAIN CORE STACK...", "success-text");
        const canvas = document.getElementById("digital-rain");
        if(canvas) {
            const ctx = canvas.getContext("2d");
            const charSize = 14; const columns = canvas.width / charSize;
            const drops = Array(Math.floor(columns)).fill(1);
            function drawFast() {
                ctx.fillStyle = "rgba(3, 3, 6, 0.15)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "rgba(0, 242, 254, 0.35)"; ctx.font = charSize + "px monospace";
                for (let i = 0; i < drops.length; i++) {
                    ctx.fillText(Math.random() > 0.5 ? "0" : "1", i * charSize, drops[i] * charSize);
                    if (drops[i] * charSize > canvas.height && Math.random() > 0.95) drops[i] = 0;
                    drops[i]++;
                }
            }
            clearInterval(matrixInterval); matrixInterval = setInterval(drawFast, 15);
        }
    } 
    else if (cleanCmd === 'status') {
        writeToTerminal("SÉCURISATION DE LA LIAISON IP...", "system-text");
        setTimeout(() => {
            const currentStatus = document.getElementById("server-status")?.innerText || "UNKNOWN";
            if(currentStatus === "ONLINE") { writeToTerminal("STATUS: MAIN SERVER SECURE // LIAISON ET PING STABLES", "success-text"); } 
            else { writeToTerminal("STATUS: COUPE-FEU ACTIF // ACCÈS SERVEUR IMPOSSIBLE VIA IP LOCALE", "error-text"); }
        }, 500);
    }
    else if (cleanCmd === 'hardware') {
        writeToTerminal("RECHERCHE DES PILOTES PERIPHERIQUES...", "system-text");
        setTimeout(() => {
            writeToTerminal("[OK] I/O CORE : MECHANICAL CONTROLS DETECTED", "reply-text");
            writeToTerminal("[OK] FORCE FEEDBACK : THRUSTMASTER T300 ACTIVE", "success-text");
            writeToTerminal("[OK] DISPLAY LAYER : HIGH-REFRESH RATE OUTPUT SET TO 144HZ", "reply-text");
        }, 400);
    }
    else if (cleanCmd === 'theme red') {
        document.documentElement.style.setProperty('--primary-glow', '#ff0055');
        writeToTerminal("SYSTEM CONFIG: PRIMARY GLOW SET TO RED TYPE ALERT", "error-text");
    } 
    else if (cleanCmd === 'theme blue') {
        document.documentElement.style.setProperty('--primary-glow', '#00f2fe');
        writeToTerminal("SYSTEM CONFIG: PRIMARY GLOW SET TO BASE CYBERPUNK BLUE", "success-text");
    } 
    else if (cleanCmd === 'theme green') {
        document.documentElement.style.setProperty('--primary-glow', '#39ff14');
        writeToTerminal("SYSTEM CONFIG: PRIMARY GLOW SET TO MATRIX ECO", "success-text");
    }
    else if (cleanCmd === 'theme orange') {
        document.documentElement.style.setProperty('--primary-glow', '#ff8000');
        writeToTerminal("SYSTEM CONFIG: PRIMARY GLOW SET TO RETRO TACTICAL ORANGE", "reply-text");
    }
    else { writeToTerminal(`ERROR: Unknown command '${cmd}'. Saisissez 'help'.`, "error-text"); }
}

// Initialisation globale
window.onload = function() {
    displayContent(); runSystemLoader(); initDigitalRain(); initAudioFX(); init3DTilt(); checkServerStatus();
};

window.onresize = function() {
    const canvas = document.getElementById("digital-rain");
    if(canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
};
