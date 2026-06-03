// ================= CONFIGURATION API =================
const YT_API_KEY = "AIzaSyBePk6S-cPENbXedT01dGS3QL1c6iy-oo0";         // Colle ta clé API Google Cloud ici
const YT_CHANNEL_ID = "UCi7MICOBujlvvPTxEb10FUQ"; // Colle l'ID de ta chaîne ici (ex: UC...)
// =====================================================

let allArchives = [];
let activeQuickTag = "all";
let currentSearchQuery = "";

const mainSearch = document.getElementById("main-search");
const clearSearchBtn = document.getElementById("clear-search");
const archiveGrid = document.getElementById("archive-grid");
const resultsCount = document.getElementById("results-count");

// Génère des tags automatiques en analysant les mots dans le titre de ta vidéo
function generateTagsFromTitle(title) {
    const tags = [];
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes("2013")) tags.push("2013");
    if (lowerTitle.includes("2014")) tags.push("2014");
    if (lowerTitle.includes("katowice")) tags.push("EMS Katowice");
    if (lowerTitle.includes("pov")) tags.push("POV");
    
    // Ajoute des équipes courantes de l'époque si elles sont dans le titre
    const teams = ["nip", "fnatic", "virtus", "ldlc", "titan", "verygames", "navi", "ibuypower"];
    teams.forEach(team => {
        if (lowerTitle.includes(team)) {
            // Met la première lettre en majuscule pour faire propre
            tags.push(team.charAt(0).toUpperCase() + team.slice(1));
        }
    });

    return tags;
}

// Va chercher les vidéos sur YouTube
async function fetchYouTubeArchives() {
    if (YT_API_KEY === "TA_CLE_API_YOUTUBE" || YT_CHANNEL_ID === "ID_DE_TA_CHAINE_YOUTUBE") {
        resultsCount.textContent = "[Erreur] : Veuillez configurer l'API Key et le Channel ID dans le script.";
        return;
    }

    try {
        // Étape 1 : On demande les dernières vidéos publiques de la chaîne (max 50)
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&channelId=${YT_CHANNEL_ID}&part=snippet,id&order=date&maxResults=50&type=video`);
        const data = await response.json();

        if (!data.items) {
            resultsCount.textContent = "Aucune vidéo trouvée ou quota API dépassé.";
            return;
        }

        // Étape 2 : On transforme les données de YouTube pour les adapter à notre site
        allArchives = data.items.map(item => {
            const title = item.snippet.title;
            const rawDate = item.snippet.publishedAt; // Format: 2026-05-20T...
            const formattedDate = rawDate.split('T')[0]; 

            return {
                id: item.id.videoId,
                title: title,
                tournament: title.includes("Katowice") ? "EMS Katowice 2014" : "CS:GO Archive",
                date: formattedDate,
                tags: generateTagsFromTitle(title)
            };
        });

        // Étape 3 : On affiche le résultat
        filterArchives();

    } catch (error) {
        console.error("Erreur API YouTube:", error);
        resultsCount.textContent = "Impossible de charger les archives depuis YouTube.";
    }
}

function renderArchives(archives) {
    archiveGrid.innerHTML = "";
    
    if (archives.length === 0) {
        resultsCount.textContent = "Aucune archive trouvée.";
        return;
    }
    resultsCount.textContent = `${archives.length} archive(s) affichée(s)`;

    archives.forEach(item => {
        const card = document.createElement("a");
        card.href = `https://www.youtube.com/watch?v=${item.id}`;
        card.target = "_blank";
        card.className = "archive-item";

        const thumbnailUrl = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;
        const tagsHTML = item.tags.map(tag => `<span class="inline-tag">${tag}</span>`).join("");

        card.innerHTML = `
            <div class="thumbnail-box">
                <img src="${thumbnailUrl}" alt="${item.title}" loading="lazy">
            </div>
            <div class="item-meta">
                <h3>${item.title}</h3>
                <div class="item-details">${item.tournament} | ${item.date}</div>
                <div class="tags-box">${tagsHTML}</div>
            </div>
        `;
        archiveGrid.appendChild(card);
    });
}

function filterArchives() {
    const filtered = allArchives.filter(item => {
        const matchesSearch = 
            item.title.toLowerCase().includes(currentSearchQuery) ||
            item.tags.some(tag => tag.toLowerCase().includes(currentSearchQuery));

        let matchesTag = false;
        if (activeQuickTag === "all") {
            matchesTag = true;
        } else {
            matchesTag = item.tags.some(tag => tag.toLowerCase() === activeQuickTag.toLowerCase());
        }

        return matchesSearch && matchesTag;
    });

    renderArchives(filtered);
}

function filterByQuickTag(tagValue) {
    activeQuickTag = tagValue;
    document.querySelectorAll(".filter-tag").forEach(btn => btn.classList.remove("active"));

    const clickedBtn = Array.from(document.querySelectorAll(".filter-tag")).find(btn => 
        (tagValue === "all" && btn.textContent.trim() === "Tous") || 
        btn.textContent.trim().toLowerCase() === tagValue.toLowerCase()
    );
    if (clickedBtn) clickedBtn.classList.add("active");

    filterArchives();
}

mainSearch.addEventListener("input", (e) => {
    currentSearchQuery = e.target.value.toLowerCase().trim();
    if (currentSearchQuery.length > 0) {
        clearSearchBtn.classList.add("visible");
    } else {
        clearSearchBtn.classList.remove("visible");
    }
    filterArchives();
});

clearSearchBtn.addEventListener("click", () => {
    mainSearch.value = "";
    currentSearchQuery = "";
    clearSearchBtn.classList.remove("visible");
    mainSearch.focus();
    filterArchives();
});

// Lancement automatique au chargement
document.addEventListener("DOMContentLoaded", () => {
    fetchYouTubeArchives();
});
