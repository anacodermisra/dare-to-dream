// Smooth scrolling for navbar links
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 60, // adjust for navbar height
        behavior: 'smooth'
      });
    }
  });
});

// Optional: Scroll to top when logo is clicked
document.querySelector('.logo')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Optional: FAQ toggle open one at a time
const faqs = document.querySelectorAll("details");
faqs.forEach((faq) => {
  faq.addEventListener("toggle", () => {
    if (faq.open) {
      faqs.forEach((item) => {
        if (item !== faq) item.open = false;
      });
    }
  });
});
