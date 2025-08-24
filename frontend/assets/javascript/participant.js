document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const container = document.getElementById('submissionDetails');

  if (!token) {
    alert("You're not logged in. Redirecting...");
    return window.location.href = "login.html";
  }

  // ✅ STEP 4: Decode token to check role
  const payload = JSON.parse(atob(token.split('.')[1]));
  if (payload.role !== 'participant') {
    alert("Access denied. Only participants can view this page.");
    return window.location.href = "login.html";
  }

  // ✅ Fetch user submissions
  fetch('https://dare-to-dream-ideathon.onrender.com/api/submission/my', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => {
    if (!Array.isArray(data)) {
      container.innerHTML = "<p>Error loading submissions.</p>";
      return;
    }

    if (data.length === 0) {
      container.innerHTML = "<p>No submissions yet.</p>";
    } else {
      container.innerHTML = data.map(sub => `
        <div class="submission-card">
          <h3>${sub.projectTitle || 'Untitled Project'}</h3>
          <p><strong>Category:</strong> ${sub.category}</p>
          <p><strong>Vertical:</strong> ${sub.vertical}</p>
          <p><strong>Abstract:</strong> ${sub.abstract}</p>
          <a href="${sub.pdfUrl}" target="_blank">View PDF</a>
        </div>
      `).join('');
    }
  })
  .catch(err => {
    console.error("❌ Submission fetch error:", err);
    container.innerHTML = "<p>Something went wrong.</p>";
  });
});
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
