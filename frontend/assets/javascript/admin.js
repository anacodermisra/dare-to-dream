// ✅ STEP 1: Role protection on admin dashboard
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You're not logged in. Redirecting...");
    return (window.location.href = "login.html");
  }

  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    if (decoded.role !== "admin") {
      alert("Access denied. Only admins can access this page.");
      return (window.location.href = "login.html");
    }
  } catch (err) {
    console.error("❌ Invalid token:", err);
    return (window.location.href = "login.html");
  }

  fetchSubmissions();
  loadStats();
});

// ✅ STEP 2: Navigation section logic (if you add .topnav)
const navLinks = document.querySelectorAll(".topnav a");
const sections = document.querySelectorAll(".section");

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href").substring(1);

    sections.forEach((section) => {
      section.classList.remove("active");
      if (section.id === targetId) {
        section.classList.add("active");
      }
    });
  });
});

// ✅ STEP 3: Logout functionality
function logout() {
  alert("Logged out!");
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  window.location.href = "login.html";
}

// ✅ STEP 4: Fetch and display all submissions
function fetchSubmissions() {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/api/admin/submissions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("submissionsBody");
      tbody.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">No submissions found.</td></tr>`;
        return;
      }

      data.forEach((sub) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${sub.name || "-"}</td>
          <td>${sub.category || "-"}</td>
          <td>${sub.vertical || "-"}</td>
          <td>${sub.projectTitle || "-"}</td>
          <td>${sub.abstract || "-"}</td>
          <td><a href="${sub.pdfUrl}" target="_blank">View PDF</a></td>
          <td>
            <button class="delete-btn" onclick="deleteSubmission('${sub._id}')">🗑️</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("❌ Failed to fetch submissions:", err);
    });
}

// ✅ STEP 5: Delete submission by ID
function deleteSubmission(id) {
  const token = localStorage.getItem("token");
  if (!confirm("Are you sure you want to delete this submission?")) return;

  fetch(`http://localhost:5000/api/admin/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then(() => {
      alert("Submission deleted successfully.");
      fetchSubmissions();
    })
    .catch((err) => {
      console.error("❌ Error deleting submission:", err);
      alert("Something went wrong while deleting.");
    });
}

// ✅ STEP 6: Download all submissions as ZIP
function downloadAll() {
  const token = localStorage.getItem("token");
  fetch("http://localhost:5000/api/admin/download/all", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch zip");
    return res.blob();
  })
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "all_submissions.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
  })
  .catch(err => {
    console.error("❌ Download failed", err);
    alert("Download failed.");
  });
}

// ✅ STEP 7: Fetch dashboard stats & render charts
function loadStats() {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/api/admin/stats", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => {
    if (!data || !data.total) return;
    const countEl = document.getElementById("totalCount");
    if (countEl) countEl.textContent = `Total Submissions: ${data.total}`;

    renderBarChart("verticalChart", "Submissions by Vertical", data.verticals);
    renderPieChart("categoryChart", "Submissions by Category", data.categories);
  })
  .catch(err => console.error("❌ Failed to fetch stats", err));
}

// ✅ Chart: Bar for verticals
function renderBarChart(id, label, dataset) {
  const ctx = document.getElementById(id).getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(dataset),
      datasets: [{
        label,
        data: Object.values(dataset),
        backgroundColor: "#3b82f6"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        title: {
          display: true,
          text: label
        }
      }
    }
  });
}

// ✅ Chart: Pie for categories
function renderPieChart(id, label, dataset) {
  const ctx = document.getElementById(id).getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(dataset),
      datasets: [{
        label,
        data: Object.values(dataset),
        backgroundColor: ["#60a5fa", "#f87171", "#34d399", "#facc15", "#a78bfa"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: label
        }
      }
    }
  });
}
