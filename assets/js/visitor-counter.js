// Visitor Counter for Cloud Resume
const API_URL = "/api/visitor";

async function initVisitorCounter() {
  try {
    let data;

    // Only increment once per session
    if (!sessionStorage.getItem("visited")) {
      const response = await fetch(API_URL, { method: "GET" });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      data = await response.json();
      sessionStorage.setItem("visited", "true");
    } else {
      // If already visited this session, just fetch without increment logic change
      const response = await fetch(API_URL, { method: "GET" });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      data = await response.json();
    }

    updateCounterDisplay(Number(data.views ?? 0));

  } catch (error) {
    console.error("Error updating visitor counter:", error);
    updateCounterDisplay(0);
  }
}

function updateCounterDisplay(count) {
  document.querySelectorAll("#visitor-count, [data-visitor-count]").forEach((counterElement) => {
    counterElement.textContent = Number(count).toLocaleString();
  });
}

document.addEventListener("DOMContentLoaded", initVisitorCounter);