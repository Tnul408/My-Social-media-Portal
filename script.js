let matrixInterval; // Variable globale pour contrôler le rythme de la pluie digitale
// Liste des chaînes YouTube à synchroniser automatiquement
const YOUTUBE_CHANNELS = [
    { id: "UCi7MICOBujlvvPTxEb10FUQ", type: "cs2", subtitle: "Channel: JoJos (Pro POV gameplay)" }, // Exemple ID pour @jojos13450
    { id: "UCQMGgEYYYBuGGgH1L1OGYPQ", type: "ut", subtitle: "Channel: Old Games Gameplay" }       // Exemple ID pour @oldgameplay13450
];

// --- 1. FAUX CHARGEMENT AVEC BOUTON D'ENTRÉE (DÉBLOCAGE AUDIO AUTO) ---
function runSystemLoader() {
    const progress = document.getElementById("load-progress");
    const percentText = document.getElementById("load-percentage");
    const loaderScreen = document.getElementById("loader-screen");
    const mainContent = document.getElementById("main-content");
    const loaderContent = document.querySelector(".loader-content");
    
    let count = 0;
    const speed = 15;

    const loadingInterval = setInterval(() => {
        count += Math.floor(Math.random() * 4) + 1;
        if(count > 100) count = 100;
        
        progress.style.width = count + "%";
        percentText.innerText = count + "%";
        
        if(count === 100) {
            clearInterval(loadingInterval);
            
            setTimeout(() => {
                percentText.style.display = "none";
                document.querySelector(".loader-bar-container").style.display = "none";
                
                const enterBtn = document.createElement("div");
                enterBtn.className = "cyber-enter-btn";
                enterBtn.innerText = "[ PRESS ANYWHERE TO ENTER SYSTEM ]";
                loaderContent.appendChild(enterBtn);
                
                loaderScreen.addEventListener('click', () => {
                    window.myAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    playClickSound();
                    
                    loaderScreen.style.opacity = "0";
                    loaderScreen.style.visibility = "hidden";
                    mainContent.classList.add("visible");
                    
                    runGlitchEffect();
                });
            }, 300);
        }
    }, speed);
}

// --- 2. RETRO SOUND DESIGN (ADOUCI & CORRIGÉ) ---
function playTechBeep() {
    try {
        if (!window.myAudioCtx) {
            window.myAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (window.myAudioCtx.state === 'suspended') {
            window.myAudioCtx.resume();
        }
        const oscillator = window.myAudioCtx.createOscillator();
        const gainNode = window.myAudioCtx.createGain();
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(120, window.myAudioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(0.25, window.myAudioCtx.currentTime); 
        gainNode.gain.exponentialRampToValueAtTime(0.00001, window.myAudioCtx.currentTime + 0.02);
        
        oscillator.connect(gainNode);
        gainNode.connect(window.myAudioCtx.destination);
        oscillator.start();
        oscillator.stop(window.myAudioCtx.currentTime + 0.02);
    } catch(e) {}
}

function playClickSound() {
    try {
        const oscillator = window.myAudioCtx.createOscillator();
        const gainNode = window.myAudioCtx.createGain();
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(180, window.myAudioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(0.30, window.myAudioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, window.myAudioCtx.currentTime + 0.05);
        
        oscillator.connect(gainNode);
        gainNode.connect(window.myAudioCtx.destination);
        oscillator.start();
        oscillator.stop(window.myAudioCtx.currentTime + 0.05);
    } catch(e) {}
}

function attachAudioToElement(el) {
    el.addEventListener('mouseenter', playTechBeep);
    el.addEventListener('click', playClickSound);
}

function initAudioFX() {
    const targets = document.querySelectorAll('.link-btn');
    targets.forEach(el => {
        el.addEventListener('mouseenter', playTechBeep);
        el.addEventListener('click', playClickSound);
    });
}

// --- 3. EFFET HOLOGRAMME 3D (TILT EFFET MAISON) ---
function init3DTilt() {
    const cards = document.querySelectorAll('.central-panel');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardX = e.clientX - cardRect.left;
            const cardY = e.clientY - cardRect.top;
            
            const xRotation = -((cardY - cardRect.height / 2) / cardRect.height) * 15;
            const yRotation = ((cardX - cardRect.width / 2) / cardRect.width) * 15;
            
            card.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotateX(0deg) rotateY(0deg)`;
        });
    });
}

function attachTiltToElement(card) {
    card.addEventListener('mousemove', (e) => {
        const cardRect = card.getBoundingClientRect();
        const cardX = e.clientX - cardRect.left;
        const cardY = e.clientY - cardRect.top;
        const xRotation = -((cardY - cardRect.height / 2) / cardRect.height) * 15;
        const yRotation = ((cardX - cardRect.width / 2) / cardRect.width) * 15;
        card.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
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
            const text = Math.random() > 0.5 ? "0" : "1";
            ctx.fillText(text, i * charSize, drops[i] * charSize);
            if (drops[i] * charSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    
    if(matrixInterval) clearInterval(matrixInterval);
    matrixInterval = setInterval(draw, 45);
}

// --- 5. GLITCH DE TEXTE ---
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

// --- 6. AFFICHAGE SÉPARÉ DES CARTES VIDÉOS ---
async function displayContent() {
    const gridCs2 = document.getElementById('content-grid-cs2');
    const gridUt = document.getElementById('content-grid-ut');
    
    if(!gridCs2 || !gridUt) return;
    gridCs2.innerHTML = ""; 
    gridUt.innerHTML = ""; 

    for (const channel of YOUTUBE_CHANNELS) {
        try {
            const rssUrl = encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`);
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
            const data = await response.json();

            if (data.status === 'ok' && data.items) {
                const limit = channel.type === "cs2" ? 6 : 2;
                const targetGrid = channel.type === "cs2" ? gridCs2 : gridUt;

                const videos = data.items.filter(item => {
                    return !item.title.includes('#Shorts') && !item.title.includes('#shorts');
                });

                const channelItems = videos.slice(0, limit).map(item => {
                    let videoId = "";
                    if (item.link.includes('v=')) {
                        videoId = item.link.split('v=')[1].split('&')[0];
                    }
                    return {
                        type: channel.type,
                        title: item.title,
                        subtitle: channel.subtitle,
                        link: item.link,
                        image: item.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                        date: new Date(item.pubDate)
                    };
                });

                channelItems.sort((a, b) => b.date - a.date);

                channelItems.forEach((item, index) => {
                    const card = document.createElement('a'); 
                    card.href = item.link; 
                    card.target = "_blank"; 
                    card.className = `content-card card-${item.type}`;
                    card.style.animationDelay = `${index * 0.08}s`;
                    
                    card.innerHTML = `
                        <div class="thumbnail-placeholder" style="background-image: url('${item.image}'); background-size: cover; background-position: center;">
                            <span class="play-btn"><i class="fa-solid fa-play"></i></span>
                        </div>
                        <div class="card-info">
                            <h3>${item.title}</h3>
                            <p>${item.subtitle}</p>
                        </div>`;
                    
                    targetGrid.appendChild(card);
                    attachAudioToElement(card);
                    attachTiltToElement(card);
                });
            }
        } catch (error) {
            console.error("Erreur d'accès au flux de la chaîne :", error);
        }
    }
}

// --- 7. VÉRIFICATION AUTOMATIQUE DU STATUT DU SERVEUR ---
function checkServerStatus() {
    const statusBadge = document.getElementById("server-status");
    if (!statusBadge) return;

    const serverUrl = "http://TON_IP_PUBLIQUE:PORT_DE_TON_SERVEUR"; 

    fetch(serverUrl, { mode: 'no-cors', timeout: 3000 })
        .then(() => {
            statusBadge.innerText = "ONLINE";
            statusBadge.classList.remove("offline");
        })
        .catch(() => {
            statusBadge.innerText = "OFFLINE";
            statusBadge.classList.add("offline");
        });
}

// --- 8. SYSTÈME DE CONSOLE DE COMMANDES CACHÉE ---
const consoleInput = document.getElementById('term-input');
const consoleContainer = document.getElementById('terminal-console');
const consoleHistory = document.getElementById('term-history');

window.addEventListener('keydown', (e) => {
    if (e.key === '²' || (e.key.toLowerCase() === 't' && document.activeElement !== consoleInput)) {
        e.preventDefault();
        consoleContainer.classList.toggle('terminal-hidden');
        
        if (!consoleContainer.classList.contains('terminal-hidden')) {
            consoleInput.focus();
            playTechBeep();
        }
    }
});

if (consoleInput) {
    consoleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = consoleInput.value.trim();
            if (command !== "") {
                handleTerminalCommand(command);
                consoleInput.value = "";
            }
        }
    });
}

function writeToTerminal(text, type = "reply-text") {
    const line = document.createElement('div');
    line.className = `term-line ${type}`;
    line.innerText = text;
    consoleHistory.appendChild(line);
    consoleHistory.scrollTop = consoleHistory.scrollHeight;
}

function handleTerminalCommand(cmd) {
    const cleanCmd = cmd.toLowerCase().trim();
    writeToTerminal(`> ${cmd}`, "command-text");

    if (cleanCmd === 'help') {
        writeToTerminal("Commandes disponibles :", "system-text");
        writeToTerminal("  status        - Diagnostic réseau du serveur", "reply-text");
        writeToTerminal("  matrix        - Surcharge le flux de la pluie digitale", "reply-text");
        writeToTerminal("  theme [color] - Change le thème visuel (red, blue, green)", "reply-text");
        writeToTerminal("  clear         - Efface l'historique de l'interface", "reply-text");
    } 
    else if (cleanCmd === 'clear') {
        consoleHistory.innerHTML = "";
    } 
    else if (cleanCmd === 'matrix') {
        writeToTerminal("OVERCLOCKING DIGITAL RAIN STREAM...", "success-text");
        const canvas = document.getElementById("digital-rain");
        if(canvas) {
            const ctx = canvas.getContext("2d");
            const charSize = 14; const columns = canvas.width / charSize;
            const drops = Array(Math.floor(columns)).fill(1);
            function drawFast() {
                ctx.fillStyle = "rgba(3, 3, 6, 0.15)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "rgba(0, 242, 254, 0.3)"; ctx.font = charSize + "px monospace";
                for (let i = 0; i < drops.length; i++) {
                    ctx.fillText(Math.random() > 0.5 ? "0" : "1", i * charSize, drops[i] * charSize);
                    if (drops[i] * charSize > canvas.height && Math.random() > 0.95) drops[i] = 0;
                    drops[i]++;
                }
            }
            clearInterval(matrixInterval);
            matrixInterval = setInterval(drawFast, 15);
        }
    } 
    else if (cleanCmd === 'status') {
        writeToTerminal("PINGING INFRASTRUCTURE...", "system-text");
        setTimeout(() => {
            const currentStatus = document.getElementById("server-status")?.innerText || "UNKNOWN";
            if(currentStatus === "ONLINE") {
                writeToTerminal("STATUS: MAIN SERVER CORE IS STABLE // PING 14ms", "success-text");
            } else {
                writeToTerminal("STATUS: CONNECTION TIMEOUT // HOST UNREACHABLE", "error-text");
            }
        }, 600);
    } 
    else if (cleanCmd === 'theme red') {
        document.documentElement.style.setProperty('--neon-blue', '#ff0055');
        writeToTerminal("SYSTEM THEME SET TO CRITICAL ALERT (RED)", "error-text");
    } 
    else if (cleanCmd === 'theme blue') {
        document.documentElement.style.setProperty('--neon-blue', '#00f2fe');
        writeToTerminal("SYSTEM THEME SET TO COLD CYBER (BLUE)", "success-text");
    } 
    else if (cleanCmd === 'theme green') {
        document.documentElement.style.setProperty('--neon-blue', '#39ff14');
        writeToTerminal("SYSTEM THEME SET TO OVERRIDE TERMINAL (GREEN)", "success-text");
    } 
    else {
        writeToTerminal(`ERROR: Command '${cmd}' not recognized. Type 'help' for support.`, "error-text");
    }
}

// Lancement global au chargement
window.onload = function() {
    displayContent();
    runSystemLoader(); 
    initDigitalRain();
    initAudioFX();
    init3DTilt(); 
    checkServerStatus();
};

window.onresize = function() {
    const canvas = document.getElementById("digital-rain");
    if(canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
};
