const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");
const progressBar = document.getElementById("progressBar");
const stepIndicator = document.getElementById("stepIndicator");
const form = document.getElementById("multiStepForm");
const totalSteps = steps.length;

let currentStep = 0;

// Next buttons
nextBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const currentFields = steps[currentStep].querySelectorAll("input, select, textarea");
    let isValid = true;

    currentFields.forEach((field) => {
      if (!field.checkValidity()) {
        field.reportValidity();
        isValid = false;
      }
    });

    if (!isValid) return;

    steps[currentStep].classList.remove("active");
    currentStep++;
    steps[currentStep].classList.add("active");

    updateProgress(currentStep);
    updateStepIndicator(currentStep);

    if (currentStep === totalSteps - 1) {
      populateReview();
    }
  });
});

// Previous buttons
prevBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    steps[currentStep].classList.remove("active");
    currentStep--;
    steps[currentStep].classList.add("active");

    updateProgress(currentStep);
    updateStepIndicator(currentStep);
  });
});

// Progress bar update
function updateProgress(step) {
  const percent = (step / (totalSteps - 1)) * 100;
  if (progressBar) {
    progressBar.style.width = `${percent}%`;
  }
}

// Step indicator
function updateStepIndicator(step) {
  if (stepIndicator) {
    stepIndicator.textContent = `Step ${step + 1} of ${totalSteps}`;
  }
}

// Review summary on Step 4
function populateReview() {
  const review = document.getElementById("reviewSummary");
  if (!review) return;

  const formData = new FormData(form);
  review.innerHTML = "";

  for (const [key, value] of formData.entries()) {
    const displayValue = value.name ? value.name : value; // Handles file
    const field = document.createElement("p");
    field.innerHTML = `<strong>${formatKey(key)}:</strong> ${displayValue}`;
    review.appendChild(field);
  }
}

function formatKey(key) {
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
}

// Submit
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(form);
  const token = localStorage.getItem("token");

  if (!token) {
    alert("No token found. Please log in again.");
    return;
  }

  console.log("🔐 Sending token:", token);

  try {
    const response = await fetch("http://localhost:5000/api/submission/submit", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}` // FormData handles content-type
      },
      body: formData
    });
let result;
try {
  result = await response.json();
} catch (jsonErr) {
  console.error("❌ Failed to parse JSON:", jsonErr);
  const text = await response.text(); // fallback
  console.error("🧾 Raw response:", text);
  throw new Error("Server did not return valid JSON");
}


    if (response.ok) {
      //alert("✅ Submission successful!");
console.log("🚀 Redirecting to participantDashboard.html");
location.assign("participant.html");



    } else {
      console.error("❌ Server error:", result);
      alert("Error: " + result.msg);
    }

  } catch (error) {
    console.error("❌ Submission failed:", error);
    alert("Something went wrong!");
  }
});
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:5000/api/public/verticals")
    .then(res => res.json())
    .then(verticals => {
      const select = document.querySelector('select[name="innovation_vertical"]');
      select.innerHTML = '<option value="">-- Select Vertical --</option>';

      verticals.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v;
        select.appendChild(opt);
      });
    })
    .catch(err => console.error("❌ Failed to fetch verticals", err));
});
