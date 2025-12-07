// ===================== LOADING BAR (ON LOAD) =====================
let bar = document.getElementById("progress-bar");

bar.style.transition = "width 0.2s ease-out";
bar.style.width = "40%";

setTimeout(() => {
  bar.style.transition = "width 0.2s ease-in-out";
  bar.style.width = "50%";
}, 300);

setTimeout(() => {
  bar.style.transition = "width 0.2s ease-in";
  bar.style.width = "100%";
}, 600);

setTimeout(() => {
  bar.style.transition = "opacity 0.2s ease-out";
  bar.style.opacity = "0";
  
  setTimeout(() => {
    bar.remove();
    document.getElementById("progress-bg")?.remove();
  }, 300);
}, 1000);

// ===================== FOYDALANUVCHI LOGIN HOLATINI KO‘RSATISH =====================
document.addEventListener("DOMContentLoaded", () => {
  const loginWrap = document.querySelector(".login-wrap");
  const userData = localStorage.getItem("loggedInUser");
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (user && typeof user.login === "string" && user.login.trim() !== "") {
        const profilePhoto = user.photo || "../images/image/prifilephoto.png";
        
        loginWrap.innerHTML = `
          <div class="dropdown">
            <button class="profile-btn-img">
              <img src="${profilePhoto}" alt="User" class="profile-img" />
              <i class="bi bi-chevron-down chevron-icon"></i>
            </button>
            <div class="dropdown-menu">
              <a href="../html/profile.html"><i class="bi bi-person-circle"></i> Profil</a>
              <a href="../html/testpro.html"><i class="bi bi-pencil-square"></i> Test Pro</a>
              <a href="../html/saqlanganlar.html"><i class="bi bi-bookmark-heart"></i> Saqlanganlar</a>
              <a href="../html/natijalar.html"><i class="bi bi-bar-chart-fill"></i> Mening natijalarim</a>
              <hr>
              <button class="logout-btn"><i class="bi bi-box-arrow-right"></i> Chiqish</button>
            </div>
          </div>
        `;
        
        // Dropdown toggle
        const profileBtn = document.querySelector(".profile-btn-img");
        const dropdownMenu = document.querySelector(".dropdown-menu");
        profileBtn.addEventListener("click", () => {
          dropdownMenu.classList.toggle("show");
        });
        
        // Logout
        const logoutBtn = document.querySelector(".logout-btn");
        logoutBtn.addEventListener("click", () => {
          localStorage.removeItem("loggedInUser");
          location.reload();
        });
        
        // Sahifa tashqarisiga bosilsa dropdown yopiladi
        document.addEventListener("click", (e) => {
          if (!e.target.closest(".dropdown")) {
            dropdownMenu?.classList.remove("show");
          }
        });
        
        // Boshqa joyda username kerak bo‘lsa
        const usernameEl = document.getElementById("username");
        if (usernameEl) usernameEl.textContent = user.login;
      }
    } catch (e) {
      console.warn("Foydalanuvchi ma'lumotida xatolik bor:", e);
    }
  } else {
    // Login bo‘lmagan foydalanuvchi
    if (loginWrap) {
      loginWrap.innerHTML = `
  <a href="../html/auth.html" class="login-btn btn-login login">
    <img class="login-icon" src="../images/icons/loginicon.svg" alt="login icon" />
    Kirish
  </a>
`;
    }
  }
});