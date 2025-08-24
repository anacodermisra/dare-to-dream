let verticals = []; // [{ name: "AI/ML", enabled: true }]

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) return location.href = "login.html";

  // 🧠 Load from DB
  fetch("https://dare-to-dream-ideathon.onrender.com/api/admin/config", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => {
    console.log("👉 Received verticals from DB:", data.verticals);
    // Ensure legacy string data is handled
    verticals = (data.verticals || []).map(v =>
      typeof v === "string" ? { name: v, enabled: true } : v
    );
    renderVerticals();
  })
  .catch(err => console.error("❌ Failed to load config", err));
});

function renderVerticals() {
  const container = document.getElementById("verticalsList");
  container.innerHTML = "";

  verticals
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((v, i) => {
      container.innerHTML += `
        <div class="list-item">
          <input type="checkbox" ${v.enabled ? 'checked' : ''} onchange="toggleEnabled(${i})">
          <span>${v.name}</span>
          <button onclick="removeVertical(${i})">
            <i class="fas fa-trash"></i>
          </button>
        </div>`;
    });
}

function toggleEnabled(index) {
  verticals[index].enabled = !verticals[index].enabled;
}

function addVertical() {
  const input = document.getElementById("newVerticalInput");
  const value = input.value.trim();

  if (!value) return;

  const normalized = value.toLowerCase();

  if (verticals.some(v => v.name.toLowerCase() === normalized)) {
    return alert("❌ Vertical already exists.");
  }

  verticals.push({ name: value, enabled: true });
  input.value = "";
  renderVerticals();
}

function removeVertical(index) {
  verticals.splice(index, 1);
  renderVerticals();
}

function saveVerticals() {
  const token = localStorage.getItem("token");

  fetch("https://dare-to-dream-ideathon.onrender.com/api/admin/config", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ verticals })
  })
  .then(res => res.json())
  .then(data => {
    alert("✅ Saved successfully!");
    console.log(data);
  })
  .catch(err => console.error("❌ Save error", err));
}
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}