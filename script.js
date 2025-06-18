// Skrypt do obsługi dynamicznych danych, countdown, ogłoszeń, załogi, sesji, logowania

// --- Dane domyślne ---
const defaultData = {
  // Zmień datę/godzinę następnej sesji tutaj:
  nextSession: {
    start: "2025-06-22T21:37:00", // <--- EDYTUJ TĘ LINIĘ, aby ustawić datę/godzinę następnej sesji
    goal: "Pewnie zdobycie reputacji u baby od czach ale idk, moze coc innego", // <--- EDYTUJ TĘ LINIĘ, aby zmienić cel sesji
  },
  // Edytuj listę poprzednich sesji tutaj:
  pastSessions: [
    // 20/11/2022
    { date: "2022-11-20T00:04:00", durationMin: "BRAK DANYCH", gold: "BRAK DANYCH", doubloons: "BRAK DANYCH", ancientCoins: "BRAK DANYCH" },
    // 21/11/2022 (dwie części)
    { date: "2022-11-21T16:50:00", durationMin: 128, gold: 70940, doubloons: 33, ancientCoins: 133 },
    // 22/11/2022
    { date: "2022-11-22T18:20:00", durationMin: "BRAK DANYCH", gold: "BRAK DANYCH", doubloons: "BRAK DANYCH", ancientCoins: "BRAK DANYCH" },
    // 24/11/2022
    { date: "2022-11-24T17:30:00", durationMin: 295, gold: 261687, doubloons: 515, ancientCoins: 50 },
    // 25/11/2022 (dwie części)
    { date: "2022-11-25T19:40:00", durationMin: 151, gold: 289050, doubloons: 124, ancientCoins: 25 },
    // 26/11/2022
    { date: "2022-11-26T21:57:00", durationMin: 173, gold: 292954, doubloons: 118, ancientCoins: 25 },
    // 27/11/2022
    { date: "2022-11-27T18:18:00", durationMin: "BRAK DANYCH", gold: 0, doubloons: 0, ancientCoins: 0 },
    // 28/11/2022
    { date: "2022-11-28T20:04:00", durationMin: 95, gold: 0, doubloons: 0, ancientCoins: 0 },
    // 29/11/2022
    { date: "2022-11-29T21:00:00", durationMin: 100, gold: 97959, doubloons: 100, ancientCoins: 50 },
    // 02/12/2022
    { date: "2022-12-02T21:37:00", durationMin: 193, gold: 444709, doubloons: 336, ancientCoins: 25 },
    // 21/11/2023
    { date: "2023-11-21T16:19:00", durationMin: 121, gold: 171071, doubloons: 36, ancientCoins: 25 },
    // Wczoraj (przykładowo 2023-08-15)
    { date: "2023-08-15T20:00:00", durationMin: "BRAK DANYCH", gold: 150000, doubloons: "BRAK DANYCH", ancientCoins: "BRAK DANYCH" },
    // ...możesz dodać kolejne sesje tutaj...
  ],
  // Edytuj listę załogi tutaj:
  crew: [
    { name: "Telduu", roles: ["Ster", "Armaty", "Harpun", "Wiadro"] },
    { name: "Weico", roles: ["Boarding", "Mapa", "Maszty", "Kotwica", "Gotowanie"] },
    { name: "Prucio", roles: ["Armaty", "Ster", "Gotowanie", "Maszty", "Kotwica"] },
    { name: "Totkacz", roles: ["Naprawy", "Gotowanie", "Maszty", "Kotwica", "Pomoc uniwersalna"] },
    { name: "Menio", roles: ["Ster", "Mapa", "Maszty", "Zapasowy loot", "Harpun"] },
    { name: "Huci", roles: ["Armaty", "Abordaż", "Harpun", "Maszty", "Kotwica"] },
    { name: "Nofi", roles: ["General help na statku", "Wiadro", "Naprawy", "Maszty", "Kotwica"] },
    { name: "Arek", roles: ["BRAK. Nadal nie odpowiedział na wiadomość z pytaniem co chce robić"] }
    // Dodaj/usuń członków załogi według potrzeb
  ],
  // Edytuj ogłoszenia tutaj:
  announcements: [
    "NAPRAWIANIE STATKU I WYLEWANIE WODY TO PRIORYTET DLA KAZDEGO. Za opierdalanie się i nie wypełnianie obowiązków wpierdol do brygu. Jak się nie podobają rolę to mówić, można pozmieniać."
    // Dodaj/usuń ogłoszenia według potrzeb
  ]
};

// --- Funkcja pobierająca dane (zawsze bierze z kodu, nie z localStorage) ---
function getData() {
  return defaultData;
}

// --- Pobierz dane ---
const sotData = getData();
const nextSession = {
  start: new Date(sotData.nextSession.start),
  goal: sotData.nextSession.goal
};
const pastSessions = sotData.pastSessions;
const crew = sotData.crew;
const announcements = sotData.announcements;

// --- Następna sesja (tylko jeśli są elementy na stronie) ---
const sessionStartEl = document.getElementById("sessionStart");
const sessionGoalEl = document.getElementById("sessionGoal");
const countdownEl = document.getElementById("countdown");

// --- Aktualizacja odliczania i statusu sesji ---
function updateCountdown(targetDate) {
  if (!countdownEl) return;
  const now = new Date();
  let diff = targetDate - now;

  if (diff <= 0) {
    // Sesja w trakcie
    countdownEl.innerHTML = '<span style="color:#ff4f4f;font-weight:bold;"><span style="font-size:1.2em;vertical-align:middle;">🔴</span> Sesja w trakcie</span>';
    return;
  }

  let years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  diff -= years * (1000 * 60 * 60 * 24 * 365.25);

  let months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
  diff -= months * (1000 * 60 * 60 * 24 * 30.44);

  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);

  let hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);

  let minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);

  let seconds = Math.floor(diff / 1000);

  let parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'rok' : (years < 5 ? 'lata' : 'lat')}`);
  if (months > 0 || years > 0) parts.push(`${months} ${months === 1 ? 'miesiąc' : (months < 5 ? 'miesiące' : 'miesięcy')}`);
  if (days > 0 || months > 0 || years > 0) parts.push(`${days} ${days === 1 ? 'dzień' : (days < 5 ? 'dni' : 'dni')}`);
  if (hours > 0 || days > 0 || months > 0 || years > 0) parts.push(`${hours} ${hours === 1 ? 'godzina' : (hours < 5 ? 'godziny' : 'godzin')}`);
  if (minutes > 0 || hours > 0 || days > 0 || months > 0 || years > 0) parts.push(`${minutes} ${minutes === 1 ? 'minuta' : (minutes < 5 ? 'minuty' : 'minut')}`);
  parts.push(`${seconds} ${seconds === 1 ? 'sekunda' : (seconds < 5 && seconds > 0 ? 'sekundy' : 'sekund')}`);

  countdownEl.innerHTML = parts.join(', ');
}

if (sessionStartEl && sessionGoalEl && countdownEl) {
  sessionStartEl.textContent = nextSession.start.toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  sessionGoalEl.textContent = nextSession.goal;

  updateCountdown(nextSession.start);
  setInterval(() => updateCountdown(nextSession.start), 1000);
}

// --- Funkcja pomocnicza do pobierania ikon walut ---
function getCurrencyIcon(name) {
  if (name === "gold") return '<img src="Gold.webp" alt="Gold" style="height:1em;vertical-align:middle;margin-left:3px;">';
  if (name === "doubloons") return '<img src="Doubloon.webp" alt="Doubloons" style="height:1em;vertical-align:middle;margin-left:3px;">';
  if (name === "ancient") return '<img src="AncientCoin.webp" alt="Ancient Coins" style="height:1em;vertical-align:middle;margin-left:3px;">';
  return '';
}

// --- Modal z sesjami (tylko na stronie głównej) ---
const showSessionsBtn = document.getElementById("showSessionsBtn");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");
const sessionsTableBody = document.getElementById("sessionsTableBody");

if (showSessionsBtn && modal && closeModalBtn && sessionsTableBody) {
  showSessionsBtn.addEventListener("click", () => {
    // Pokaż tylko 3 ostatnie sesje
    sessionsTableBody.innerHTML = "";
    const lastSessions = pastSessions.slice(-3).reverse();
    lastSessions.forEach(session => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${session.date ? new Date(session.date).toLocaleString("pl-PL", {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"}) : "BRAK DANYCH"}</td>
        <td>${session.durationMin ?? "BRAK DANYCH"}</td>
        <td>${session.gold ?? "BRAK DANYCH"}</td>
        <td>${session.doubloons ?? "BRAK DANYCH"}</td>
        <td>${session.ancientCoins ?? "BRAK DANYCH"}</td>
      `;
      sessionsTableBody.appendChild(tr);
    });
    // Dodaj info i link do pełnej historii
    const infoTr = document.createElement("tr");
    infoTr.innerHTML = `<td colspan="5" style="text-align:center;padding-top:18px;font-size:1.08em;color:#ffe08a;">
      Więcej danych o poprzednich sesjach zobaczysz <a href='sesje.html' style='color:#f0a500;text-decoration:underline;font-weight:700;'>tutaj</a>.
    </td>`;
    sessionsTableBody.appendChild(infoTr);
    modal.style.display = "flex";
  });

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
}

// --- Wyświetlanie sesji na podstronie sesje.html ---
const sessionsTableBodyPage = document.getElementById("sessionsTableBodyPage");
if (sessionsTableBodyPage) {
  sessionsTableBodyPage.innerHTML = "";
  pastSessions.forEach(session => {
    const dateObj = new Date(session.date);
    sessionsTableBodyPage.innerHTML += `
      <tr>
        <td>${dateObj.toLocaleDateString("pl-PL")} ${dateObj.toLocaleTimeString("pl-PL", {hour: '2-digit', minute: '2-digit'})}</td>
        <td>${session.durationMin}</td>
        <td>${session.gold} ${getCurrencyIcon("gold")}</td>
        <td>${session.doubloons} ${getCurrencyIcon("doubloons")}</td>
        <td>${session.ancientCoins} ${getCurrencyIcon("ancient")}</td>
      </tr>
    `;
  });
}

// --- Wyświetlanie załogi na podstronie zaloga.html oraz stronie głównej ---
const crewList = document.getElementById("crewList");
if (crewList) {
  let selectedIndex = null;
  let originalOrder = [...crew];

  function renderCrewList(selectedIdx = null) {
    crewList.innerHTML = "";
    let crewToShow;
    if (selectedIdx !== null) {
      crewToShow = [...originalOrder];
      const [selected] = crewToShow.splice(selectedIdx, 1);
      crewToShow.unshift(selected);
    } else {
      crewToShow = [...originalOrder];
    }
    crewToShow.forEach((member, idx) => {
      const li = document.createElement("li");
      const rolesStr = member.roles.join(", ");
      li.innerHTML = `<strong>${member.name}</strong><br>Role: ${rolesStr}`;
      if (selectedIdx !== null && idx === 0) {
        li.classList.add("crew-selected");
      }
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        if (selectedIdx !== null && idx === 0) {
          renderCrewList(null);
        } else {
          const origIdx = originalOrder.findIndex(m => m.name === member.name);
          renderCrewList(origIdx);
        }
      });
      crewList.appendChild(li);
    });
  }

  renderCrewList();
}

// --- Wyświetlanie ogłoszeń na podstronie ogloszenia.html oraz stronie głównej ---
const announcementContainer = document.getElementById("announcements");
const announcementList = document.getElementById("announcementList");

if (announcementContainer && announcementList) {
  announcementList.innerHTML = "";
  if (announcements.length > 0) {
    announcements.forEach(msg => {
      const li = document.createElement("li");
      li.textContent = msg;
      announcementList.appendChild(li);
    });
    announcementContainer.style.display = "block";
  }
}

// --- Powiadomienia ---

function notifyUser(title, body) {
  if (!("Notification" in window)) {
    console.log("Twoja przeglądarka nie obsługuje powiadomień.");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(title, { body });
      }
    });
  }
}

function scheduleNotifications() {
  const now = new Date();
  const start = nextSession.start;

  const diffMs = start - now;
  const diff15min = 15 * 60 * 1000;

  if (diffMs <= 0) {
    notifyUser("Sesja już trwa!", "Start sesji właśnie nastąpił.");
    return;
  }

  if (diffMs > diff15min) {
    setTimeout(() => {
      notifyUser("Sesja za 15 minut", "Przygotuj się do sesji.");
    }, diffMs - diff15min);
  } else {
    notifyUser("Sesja za 15 minut", "Przygotuj się do sesji.");
  }

  setTimeout(() => {
    notifyUser("Sesja właśnie się zaczyna!", "Powodzenia na sesji.");
  }, diffMs);
}

window.addEventListener("load", () => {
  scheduleNotifications();
});

// --- Powiadomienia systemowe ---

function askNotificationPermission() {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }
  
  function showNotification(title, body) {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Sea_of_Thieves_Logo.svg/1024px-Sea_of_Thieves_Logo.svg.png",
      });
    }
  }
  
  function scheduleNotifications() {
    if (!("Notification" in window)) return;
  
    const now = new Date();
  
    // Czas 15 minut przed sesją
    const notifyBefore = new Date(nextSession.start.getTime() - 15 * 60 * 1000);
    // Czas startu sesji
    const notifyStart = nextSession.start;
  
    // Jeżeli czas 15 minut przed sesją jeszcze nie minął
    if (notifyBefore > now) {
      setTimeout(() => {
        showNotification(
          "Sesja już za 15 minut!",
          `Sesja zaczyna się o ${nextSession.start.toLocaleTimeString("pl-PL", {hour: '2-digit', minute: '2-digit'})}`
        );
      }, notifyBefore.getTime() - now.getTime());
    }
  
    // Jeżeli sesja jeszcze się nie zaczęła
    if (notifyStart > now) {
      setTimeout(() => {
        showNotification(
          "Sesja właśnie się zaczyna!",
          `Cel sesji: ${nextSession.goal}`
        );
      }, notifyStart.getTime() - now.getTime());
    }
  }
  
  // Odpalamy prośbę o pozwolenie na powiadomienia przy załadowaniu strony
  window.addEventListener("load", () => {
    askNotificationPermission();
    scheduleNotifications();
  });
  
  function updateClock() {
    const clock = document.getElementById('clock');
    if (!clock) return;
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    clock.innerHTML = `<span style="margin-right:10px;opacity:.7;filter:drop-shadow(0 0 2px #f0a50088">🕒</span>${timeStr}`;
  }
  setInterval(updateClock, 1000);
  updateClock();
  
  function updateClock() {
    const clock = document.getElementById('clock');
    if (!clock) return;
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    clock.innerHTML = `<span style="margin-right:10px;opacity:.7;filter:drop-shadow(0 0 2px #f0a50088">🕒</span>${timeStr}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

// --- System logowania z modalem i poprawionym wyglądem przycisków ---
const loginArea = document.getElementById("loginArea");
const allowedUsers = [
  "ArkaTlad",
  "Telduu",
  "Torskyy",
  "Weico",
  "Chudversek",
  "Menek",
  "Nofitek",
  "Scauterr"
];
const commonPassword = "kubusno2";

function renderLoginArea() {
  if (!loginArea) return;
  const loggedUser = sessionStorage.getItem("loggedUser");
  if (loggedUser) {
    loginArea.innerHTML = `
      <div class="login-box-logged">
        <span class="login-welcome">Witaj <b>${loggedUser}</b></span>
        <button id="logoutBtn" class="login-btn-modal login-btn-logout">Wyloguj</button>
      </div>
    `;
    document.getElementById("logoutBtn").onclick = function() {
      sessionStorage.removeItem("loggedUser");
      renderLoginArea();
    };
  } else {
    loginArea.innerHTML = `<button id="openLoginModal" class="login-btn-modal">Zaloguj</button>`;
    document.getElementById("openLoginModal").onclick = function() {
      showLoginModal();
    };
  }
}

document.addEventListener("DOMContentLoaded", renderLoginArea);

// --- Modal logowania ---
function showLoginModal() {
  if (document.getElementById('loginModal')) return;
  const modal = document.createElement('div');
  modal.id = 'loginModal';
  modal.innerHTML = `
    <div class="login-modal-bg"></div>
    <div class="login-modal-content">
      <button class="login-modal-close" id="closeLoginModal" title="Zamknij">×</button>
      <h2>Zaloguj się</h2>
      <form id="loginFormModal" class="login-modal-form">
        <select id="loginNickModal" class="login-select" required>
          <option value="" disabled selected>Nick</option>
          ${allowedUsers.map(u => `<option value="${u}">${u}</option>`).join("")}
        </select>
        <input type="password" id="loginPassModal" class="login-input" placeholder="Hasło" required>
        <button type="submit" class="login-btn">Zaloguj</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('active'), 10);

  document.getElementById("closeLoginModal").onclick = closeLoginModal;
  modal.querySelector('.login-modal-bg').onclick = closeLoginModal;

  const form = document.getElementById("loginFormModal");
  form.onsubmit = function(e) {
    e.preventDefault();
    const nick = document.getElementById("loginNickModal").value;
    const pass = document.getElementById("loginPassModal").value;
    if (allowedUsers.includes(nick) && pass === commonPassword) {
      sessionStorage.setItem("loggedUser", nick);
      closeLoginModal();
      renderLoginArea();
    } else {
      form.classList.add("login-error");
      setTimeout(() => form.classList.remove("login-error"), 1200);
    }
  };
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 200);
  }
}

// --- Style do modala logowania i przycisków (Zaloguj i Wyloguj identyczne) ---
(function addLoginModalStyles() {
  const style = document.createElement('style');
  style.innerHTML = `
    .login-btn-modal, .login-btn-logout {
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(90deg, #ffe08a 80%, #f0a500 100%);
      color: #23233a;
      border: none;
      border-radius: 10px;
      padding: 10px 32px 10px 32px;
      font-weight: 800;
      font-size: 1.13em;
      cursor: pointer;
      box-shadow: 0 2px 12px #0007, 0 0 0 2px #f0a50033;
      transition: background 0.2s, color 0.2s, box-shadow 0.2s;
      margin: 0 8px;
      letter-spacing: 0.5px;
      min-height: 44px;
      min-width: 120px;
    }
    .login-btn-modal:hover, .login-btn-modal:focus,
    .login-btn-logout:hover, .login-btn-logout:focus {
      background: linear-gradient(90deg, #f0a500 80%, #ffe08a 100%);
      color: #181825;
      box-shadow: 0 4px 24px #f0a50077, 0 2px 12px #000a;
    }
    #loginArea {
      display: flex;
      align-items: center;
      height: 100%;
    }
    .login-box-logged {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(31,31,46,0.97);
      border-radius: 10px;
      box-shadow: 0 2px 8px #0007;
      padding: 4px 18px 4px 12px;
      margin-right: 8px;
      border: 1.5px solid #23233a;
      min-height: 36px;
    }
    .login-welcome {
      color: #ffe08a;
      font-weight: 600;
      font-size: 1.08em;
      letter-spacing: 0.5px;
      margin-right: 2px;
      user-select: none;
    }
    /* Modal styles (jak poprzednio) */
    #loginModal {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
    }
    #loginModal.active {
      pointer-events: all;
      opacity: 1;
    }
    .login-modal-bg {
      position: absolute;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(18,18,23,0.92);
      z-index: 1;
      animation: fadeIn 0.2s;
    }
    .login-modal-content {
      position: relative;
      z-index: 2;
      background: var(--bg-glass-strong, #23233aee);
      border-radius: 18px;
      box-shadow: 0 0 40px #f0a50099, 0 2px 18px #000a;
      padding: 38px 36px 28px 36px;
      min-width: 320px;
      max-width: 95vw;
      min-height: 180px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 2px solid var(--accent-gold, #f0a500);
      animation: fadeIn 0.2s;
    }
    .login-modal-close {
      position: absolute;
      top: 12px; right: 14px;
      background: none;
      border: none;
      color: #ffe08a;
      font-size: 2em;
      font-weight: 700;
      cursor: pointer;
      border-radius: 6px;
      padding: 0 8px;
      transition: background 0.2s, color 0.2s;
    }
    .login-modal-close:hover, .login-modal-close:focus {
      background: #ffe08a22;
      color: #f0a500;
    }
    .login-modal-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
      margin-top: 18px;
      width: 220px;
      align-items: stretch;
    }
    .login-select, .login-input {
      background: #23233a;
      color: #ffe08a;
      border: none;
      border-radius: 7px;
      padding: 8px 14px;
      font-size: 1.08em;
      font-family: inherit;
      outline: none;
      transition: box-shadow 0.2s, border 0.2s;
      box-shadow: 0 1px 4px #0004;
      min-width: 90px;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      position: relative;
    }
    .login-select:focus, .login-input:focus {
      box-shadow: 0 0 0 2px #ffe08a99, 0 1px 4px #0004;
    }
    .login-btn {
      background: linear-gradient(90deg, #ffe08a 80%, #f0a500 100%);
      color: #23233a;
      border: none;
      border-radius: 7px;
      padding: 8px 0;
      font-weight: 800;
      font-size: 1.08em;
      cursor: pointer;
      box-shadow: 0 1px 4px #0004;
      transition: background 0.2s, color 0.2s;
      letter-spacing: 0.5px;
    }
    .login-btn:hover, .login-btn:focus {
      background: linear-gradient(90deg, #f0a500 80%, #ffe08a 100%);
      color: #181825;
    }
    .login-modal-form.login-error {
      box-shadow: 0 0 0 2px #ff4f4f, 0 2px 8px #0007;
      border-radius: 10px;
      animation: shake 0.2s 2;
    }
    @keyframes shake {
      0% { transform: translateX(0); }
      25% { transform: translateX(-3px); }
      50% { transform: translateX(3px); }
      75% { transform: translateX(-2px); }
      100% { transform: translateX(0); }
    }
    /* Styl selecta (ciemna strzałka, lepsze kolory) */
    .login-select, .login-select option {
      background: #23233a;
      color: #ffe08a;
    }
    .login-select:focus {
      outline: 2px solid #ffe08a99;
    }
    .login-select {
      background-image: url('data:image/svg+xml;utf8,<svg fill="%23ffe08a" height="18" viewBox="0 0 20 20" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M7.293 8.293a1 1 0 011.414 0L10 9.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z"/></svg>');
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 18px 18px;
      padding-right: 38px;
    }
    .login-select::-ms-expand {
      display: none;
    }
    .login-select option {
      background: #23233a;
      color: #ffe08a;
    }
  `;
  document.head.appendChild(style);
})();
