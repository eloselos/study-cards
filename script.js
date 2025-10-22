// Import Leaflet library
const L = window.L

function typeWriter(element, text, speed = 100) {
  let i = 0
  element.innerHTML = ""

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i)
      i++
      setTimeout(type, speed)
    }
  }
  type()
}

document.addEventListener("DOMContentLoaded", () => {
  const titleElement = document.querySelector(".typewriter")
  const text = titleElement.getAttribute("data-text")
  typeWriter(titleElement, text, 150)

  loadDailyMessage()
  generateConstellation()
  startCountdown()

  if (localStorage.getItem("notebookUnlocked") === "true") {
    unlockNotebook()
  }

  renderPlaylist()

  if (typeof L !== "undefined") {
    initializeMap()
  }

  document.getElementById("notebookPassword").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      unlockNotebook()
    }
  })
})

async function loadDailyMessage() {
  try {
    const response = await fetch("messages.json")
    const data = await response.json()

    const today = new Date()
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
    const messageIndex = dayOfYear % data.messages.length

    const messageElement = document.querySelector(".typewriter-message")
    const dateElement = document.getElementById("messageDate")

    typeWriter(messageElement, data.messages[messageIndex], 50)
    dateElement.textContent = today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    console.error("error loading daily message:", error)
    document.querySelector(".typewriter-message").textContent = "you make every day brighter! ✨"
  }
}

function checkSecretCode() {
  const code = document.getElementById("secretCode").value.toLowerCase()
  const secretMessage = document.getElementById("secretMessage")

  if (code === "nemo" || code === "handsome boy") {
    secretMessage.textContent = "PICKLE (jumpscare)"
    createSparkles(document.querySelector(".secret-card"))
  } else {
    secretMessage.textContent = "wrong code! try again 💕"
  }
}

function createSparkles(element) {
  for (let i = 0; i < 10; i++) {
    const sparkle = document.createElement("div")
    sparkle.innerHTML = "✨"
    sparkle.style.position = "absolute"
    sparkle.style.left = Math.random() * 100 + "%"
    sparkle.style.top = Math.random() * 100 + "%"
    sparkle.style.animation = "sparkle 1s ease-out forwards"
    sparkle.style.pointerEvents = "none"
    element.style.position = "relative"
    element.appendChild(sparkle)

    setTimeout(() => sparkle.remove(), 1000)
  }
}

const sparkleCSS = `
@keyframes sparkle {
    0% { opacity: 0; transform: scale(0) rotate(0deg); }
    50% { opacity: 1; transform: scale(1) rotate(180deg); }
    100% { opacity: 0; transform: scale(0) rotate(360deg); }
}
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
`

const style = document.createElement("style")
style.textContent = sparkleCSS
document.head.appendChild(style)

async function generateConstellation() {
  try {
    const response = await fetch("memories.json")
    const data = await response.json()
    const container = document.getElementById("constellationContainer")

    data.memories.forEach((memory) => {
      const star = document.createElement("div")
      star.className = "star"

      star.style.left = memory.x || Math.random() * 95 + "%"
      star.style.top = memory.y || Math.random() * 95 + "%"
      star.style.animationDelay = Math.random() * 2 + "s"

      star.addEventListener("click", () => {
        showMemory(memory.text)
      })

      container.appendChild(star)
    })
  } catch (error) {
    console.error("error loading memories:", error)
  }
}

function showMemory(memory) {
  const display = document.getElementById("memoryDisplay")
  display.innerHTML = `<div style="animation: fadeIn 0.5s ease-in;">${memory}</div>`
}

function startCountdown() {
  const targetDate = new Date("2025-10-24T10:00:00").getTime()

  function updateCountdown() {
    const now = new Date().getTime()
    const distance = targetDate - now

    if (distance < 0) {
      document.getElementById("countdownDisplay").innerHTML =
        '<div style="text-align: center; font-size: 1.5rem; color: #ffd700;">RAAAHHHH WE ARE SO BACK</div>'
      return
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)

    document.getElementById("days").textContent = days.toString().padStart(2, "0")
    document.getElementById("hours").textContent = hours.toString().padStart(2, "0")
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0")
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0")
  }

  updateCountdown()
  setInterval(updateCountdown, 1000)
}

// notebook functionality
function unlockNotebook() {
  const password = document.getElementById("notebookPassword").value
  const correctPassword = "SPONGEBOB"

  if (password === correctPassword || localStorage.getItem("notebookUnlocked") === "true") {
    document.getElementById("notebookLock").style.display = "none"
    document.getElementById("notebook").style.display = "block"
    localStorage.setItem("notebookUnlocked", "true")
  } else {
    alert("incorrect password! try again")
  }
}

function lockNotebook() {
  document.getElementById("notebookLock").style.display = "block"
  document.getElementById("notebook").style.display = "none"
  localStorage.removeItem("notebookUnlocked")
  document.getElementById("notebookPassword").value = ""
}

const playlistSongs = [

   { name: "100% gotta listen to it's very important to me",
    link: "https://www.youtube.com/watch?v=O91DT1pR1ew",  },

  {
    name: "on an island (cz we are on an island and it is a love song duh)", 
    link: "https://www.youtube.com/watch?v=zgtoe1CvlHE",
     },
  { name: "40 days (CAUSE I LOVE THE WAY THAT U SMILE N I LIKE THAT PART OF THE SONG)", 
    link: "https://www.youtube.com/watch?v=QKOF7NaWv1A" 
    },
  { name: "kisses (CZ KISSES???)", 
    link: "https://www.youtube.com/watch?v=97U7erexyR0" 
    },
  {
    
  }
]


function renderPlaylist() {
  const playlistList = document.getElementById("playlistList")
  if (!playlistList) return

  playlistList.innerHTML = ""

  playlistSongs.forEach((song) => {
    const songDiv = document.createElement("div")
    songDiv.className = "playlist-item"

    const songNameSpan = document.createElement("span")
    songNameSpan.className = "playlist-item-name"
    songNameSpan.textContent = song.name
    songNameSpan.addEventListener("click", () => {
      window.open(song.link, "_blank")
    })
    songDiv.appendChild(songNameSpan)

    const playButton = document.createElement("button")
    playButton.className = "playlist-play-btn"
    playButton.innerHTML = "▶"
    playButton.addEventListener("click", () => {
      window.open(song.link, "_blank")
    })
    songDiv.appendChild(playButton)

    playlistList.appendChild(songDiv)
  })
}
function initializeMap() {
  // Set initial view to a central point in Famagusta
  const map = L.map("map").setView([35.1230, 33.9470], 15) 

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 19,
  }).addTo(map)

  // 1. BASE ICON (Default Anchor: Center Bottom [22.5, 45])
  const baseHeartIcon = L.divIcon({
    className: "custom-heart-icon",
    html: '<img src="https://cdn2.iconfinder.com/data/icons/valentine-colored-icons-1/128/44-512.png" style="width: 45px; height: 45px;" alt="heart">',
    iconSize: [45, 45],
    iconAnchor: [22.5, 45],
  })

  // 2. MONKS INN ICON (Shifted LEFT for separation)
  const monksInnIcon = L.divIcon({
    className: "custom-heart-icon",
    html: baseHeartIcon.options.html,
    iconSize: [45, 45],
    iconAnchor: [37.5, 45], 
  })

  // 3. PETEK ICON (Shifted RIGHT for separation)
  const petekIcon = L.divIcon({
    className: "custom-heart-icon",
    html: baseHeartIcon.options.html,
    iconSize: [45, 45],
    iconAnchor: [7.5, 45], 
  })

  // CORRECTED LOCATIONS AND COORDINATES
  const locations = [
    {
      coords: [35.125339, 33.943722],
      title: "Monks Inn",
      message: "My fav cocktail bar in Famagusta! There isn't a chance that you won't like it.",
    },
    {
      coords: [35.118132, 33.957826],
      title: "Palm Beach",
      message:
        "This is one of the nicest beaches in central Famagusta. THERE ARE TURTLES HERE SOMETIMES!! It's also right next to the ghost town.",
    },
    {
      coords: [35.121242, 33.956661],
      title: "PalmHouse",
      message: "I like the vibes of this place. Nice to eat homemade thingies n wine!",
    },
    {
      coords: [35.120502, 33.956339], 
      title: "LEAA",
      message: "A cocktail bar with a stunning sunset view, perfect for evening drinks.",
    },
    {
      coords: [35.1245, 33.9450], 
      title: "Inciraltı",
      message:
        "This one is like a Turkish-tavern concept. Could be fun depending on the vibe. They make crazy good mezzes though.",
    },
    {
      coords: [35.1249, 33.9425],
      title: "Mardo",
      message: "Right next to the big mosque of old town. 10/10 location. Has the best ice cream.",
    },
    {
      coords: [35.1277, 33.9431],
      title: "Lion Statue",
      message:
        "This is a lion statue next to the city walls. It is said that if u whisper your wishes to it they will come true.",
    },
    {
      coords: [35.126139, 33.944169], 
      title: "Petek",
      message: "BEST PLACE TO EAT BAKLAVA ON THE WHOOOOLE ISLAND I'M 100% SURE.",
    },
  ]

  const customPopup = document.getElementById("customPopup")
  const popupTitle = customPopup.querySelector(".popup-title")
  const popupMessage = customPopup.querySelector(".popup-message")

  // --- Map Popup State Management ---
  let activePopupTimeout = null 
  let isPopupAttached = false 
  let isMouseOver = false // New state variable to track hover status

  function updatePopupPosition(latlng) {
    const markerPosition = map.latLngToContainerPoint(latlng)
    customPopup.style.left = markerPosition.x - 150 + "px"
    customPopup.style.top = markerPosition.y - 160 + "px"
  }

  function attachMapEvents(latlng) {
    if (isPopupAttached) {
      detachMapEvents()
    }

    map._currentPopupLatLng = latlng

    function handler() {
      if (map._currentPopupLatLng) {
        updatePopupPosition(map._currentPopupLatLng)
      }
    }

    map.on("move", handler)
    map.on("zoom", handler)
    isPopupAttached = true
  }

  function detachMapEvents() {
    if (isPopupAttached) {
      map.off("move")
      map.off("zoom")
      delete map._currentPopupLatLng
      isPopupAttached = false
    }
  }
  // Accordion Logic
const accordionHeaders = document.querySelectorAll(".accordion-header")

accordionHeaders.forEach((header) => {
  header.addEventListener("click", () => {
    const accordionItem = header.parentElement
    const isActive = accordionItem.classList.contains("active")

    // Close all accordion items
    document.querySelectorAll(".accordion-item").forEach((item) => {
      item.classList.remove("active")
    })

    // Open clicked item if it wasn't active
    if (!isActive) {
      accordionItem.classList.add("active")
    }
  })
})

  function showPopup(location, latlng) {
    popupTitle.textContent = location.title
    popupMessage.textContent = location.message

    updatePopupPosition(latlng)

    customPopup.classList.remove("hidden")
    customPopup.style.opacity = "1"

    attachMapEvents(latlng)
  }

  function hidePopup() {
    // We remove the condition check here and let the mouseout handler manage the state.
    customPopup.style.opacity = "0"
    setTimeout(() => {
        customPopup.classList.add("hidden")
        detachMapEvents()
    }, 300) // 300ms fade transition
  }
  // --- End of State Management ---

  locations.forEach((location) => {
    // DETERMINE WHICH ICON TO USE BASED ON THE TITLE
    let iconToUse = baseHeartIcon;
    if (location.title === "Monks Inn") {
        iconToUse = monksInnIcon;
    } else if (location.title === "Petek") {
        iconToUse = petekIcon;
    }

    const marker = L.marker(location.coords, { icon: iconToUse }).addTo(map)

    // --- 1. CLICK BEHAVIOR (4s Persistence) ---
    marker.on("click", (e) => {
      // If clicked, clear any timer and immediately start the 4s countdown.
      clearTimeout(activePopupTimeout)
      isMouseOver = true; // Pretend we are hovering to prevent immediate hide
      showPopup(location, e.latlng)

      activePopupTimeout = setTimeout(() => {
        // Once the 4s is up, if we are NOT still hovering, hide it.
        activePopupTimeout = null 
        isMouseOver = false;
        hidePopup()
      }, 4000) 
    })

    // --- 2. HOVER BEHAVIOR ---
    marker.on("mouseover", (e) => {
      // Clear the click timer so hover takes precedence
      clearTimeout(activePopupTimeout)
      activePopupTimeout = null 
      isMouseOver = true; // Set state to hovering
      showPopup(location, e.latlng)
    })

    marker.on("mouseout", () => {
      isMouseOver = false; // Set state to not hovering
      
      // Only hide if the click timer is NOT currently set (i.e., we didn't just click).
      // If activePopupTimeout is running, the 4s timer will handle the hide.
      if (activePopupTimeout === null) {
          hidePopup()
      }
    })
  })
}
