// script.js

document.addEventListener("DOMContentLoaded", () => {
    console.log("Website loaded");
  });
  
  // Example of handling an owner login
  function ownerLogin(event) {
    event.preventDefault();
    const email = document.getElementById("owner-email").value;
    const password = document.getElementById("owner-password").value;
    
    // Simple check for demonstration
    if (email === "romel@example.com" && password === "password") {
      window.location.href = "owner-dashboard.html";
    } else {
      alert("Access restricted to Romel Gravidez only.");
    }
  }
  
  // Example of handling a customer login
  function customerLogin(event) {
    event.preventDefault();
    // In a real scenario, you'd validate & store the user data.
    // For now, we just redirect to the shopping page.
    window.location.href = "shopping.html";
  }  