// Open Modal
function openModal(modalId) {
  document.getElementById(modalId).style.display = 'flex';
}

// Close Modal
function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Close if clicking outside modal
window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
};

// ✅ Handle Login (final, correct one)
async function handleLogin(e, role) {
  e.preventDefault();

  const email = document.getElementById(`${role}Email`).value.trim();
  const password = document.getElementById(`${role}Password`).value;

  try {
    const response = await fetch('https://dare-to-dream-ideathon.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // 🔒 Check if user role matches the expected role (modal type)
    if (data.role !== role) {
      alert(`❌ You are not allowed to login as ${role}. Please use the correct login.`);
      return;
    }

    // ✅ Save token + info
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('name', data.name); // optional

    // ✅ Redirect based on role
    if (data.role === 'admin') {
      window.location.href = 'admin.html';
    } else if (data.role === 'participant') {
      window.location.href = 'participant.html';
    } else {
      alert("Unknown role");
    }

  } catch (err) {
    console.error(err);
    alert("Something went wrong. Try again.");
  }
}


// ✅ Handle SignUp
async function handleSignup() {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirm').value;

  if (!name || !email || !password || !confirmPassword) {
    alert('Please fill in all fields.');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  try {
    const response = await fetch('https://dare-to-dream-ideathon.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role: 'participant' })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.msg || "Signup failed");
      return;
    }

    alert(`Account created for ${name}!\nYou can now login.`);
    closeModal('signupModal');
  } catch (err) {
    console.error(err);
    alert("Error signing up. Try again.");
  }
}
