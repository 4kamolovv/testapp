const loginForm = document.getElementById("loginForm");
const loginInput = document.getElementById("login");
const passwordInput = document.getElementById("password");

const createAccountBtn = document.getElementById("createAccountBtn");
const emailStep = document.getElementById("emailStep");
const registerStep = document.getElementById("registerStep");
const emailInput = document.getElementById("email");
const verifyBtn = document.getElementById("verifyEmailBtn");
const emailConfirmed = document.getElementById("emailConfirmed");
const registerBtn = document.getElementById("registerBtn");

// 📌 Avtomatik login tavsiyasi (login + parollarni yig‘ib olamiz)
let savedUsers = [];

for (let key in localStorage) {
  try {
    let user = JSON.parse(localStorage.getItem(key));
    if (user && user.login && user.password) {
      savedUsers.push(user);
    }
  } catch (e) {}
}

// 🔽 Login inputga datalist variantlari (avtomatik to‘ldirish uchun)
if (loginInput) {
  const datalist = document.createElement("datalist");
  datalist.id = "loginOptions";

  savedUsers.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.login;
    datalist.appendChild(option);
  });

  document.body.appendChild(datalist);
  loginInput.setAttribute("list", "loginOptions");
}

// 🔐 Login tanlanganda parolni avtomatik to‘ldirish
loginInput?.addEventListener("input", () => {
  const user = savedUsers.find((u) => u.login === loginInput.value);
  if (user) {
    passwordInput.value = user.password;
  } else {
    passwordInput.value = "";
  }
});

// ▶️ Kirish (login form submit)
loginForm?.addEventListener("submit", function (e) {
  e.preventDefault();
  const login = loginInput.value;
  const password = passwordInput.value;

  const user = JSON.parse(localStorage.getItem(login));
  if (user && user.password === password) {
    // 🔐 Foydalanuvchini tizimga kirgan deb belgilash
    localStorage.setItem("loggedInUser", JSON.stringify({ login }));

    alert(`Xush kelibsiz, ${user.login}!`);
    window.location.href = "../index.html";
  } else {
    alert("Login yoki parol noto'g'ri.");
  }
});

// 📩 Emailni kiritish bosqichiga o‘tish
createAccountBtn?.addEventListener("click", () => {
  loginForm.parentElement.classList.add("hidden");
  emailStep.classList.remove("hidden");
});

// ✅ Emailni "tasdiqlash"
verifyBtn?.addEventListener("click", () => {
  const email = emailInput.value.trim();
  if (email && email.includes("@")) {
    emailConfirmed.classList.remove("hidden");
    setTimeout(() => {
      emailStep.classList.add("hidden");
      registerStep.classList.remove("hidden");
    }, 1000);
  } else {
    alert("To‘g‘ri email kiriting!");
  }
});

// 🧾 Ro‘yxatdan o‘tish
registerBtn?.addEventListener("click", () => {
  const login = document.getElementById("newLogin").value.trim();
  const password = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!login || !password || !confirmPassword) {
    alert("Barcha maydonlarni to‘ldiring.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Parollar mos emas!");
    return;
  }

  if (localStorage.getItem(login)) {
    alert("Bu login allaqachon mavjud.");
    return;
  }

  // ✅ Hisobni saqlash
  localStorage.setItem(login, JSON.stringify({ login, password }));
  alert("Hisob yaratildi. Endi login orqali tizimga kiring.");
  location.reload();
});

// 🔙 Orqaga qaytish
document.querySelector(".bck-pointer")?.addEventListener("click", () => {
  window.location.href = "../index.html";
});