// ===================== test.json fayldan ma'lumotni yuklash =====================
fetch("https://4kamolovv.github.io/docs/data/data.json")
  .then((res) => {
    if (!res.ok) throw new Error("Ma'lumotni yuklashda xatolik yuz berdi");
    return res.json();
  })
  .then((test) => {
    const selectedSubject = localStorage.getItem("selectedSubject");
    const selectedTopic = localStorage.getItem("selectedTopic");

    let shuffledData = JSON.parse(localStorage.getItem("shuffledData"));

    if (!shuffledData) {
      const filtered = test.filter(
        (q) => q.subject === selectedSubject && q.topic === selectedTopic
      );
      shuffledData = shuffle(filtered);
      localStorage.setItem("shuffledData", JSON.stringify(shuffledData));
    }

    const data = shuffledData;
    const totalQuestions = data.length;

    if (!selectedSubject || !selectedTopic || data.length === 0) {
      alert("Test yuklanmadi. Iltimos, mavzuni qaytadan tanlang.");
      window.location.href = "../html/themetest.html";
      return;
    }

    let currentIndex = parseInt(localStorage.getItem("quizIndex")) || 0;
    let shuffledAnswers = JSON.parse(localStorage.getItem("shuffledAnswers")) || {};
    let selectedAnswers = JSON.parse(localStorage.getItem("selectedAnswers")) || {};

    const subjectEls = document.querySelectorAll(".quiz-subject");
    const topicTitleEl = document.querySelector(".quiz-info-title");
    const questionText = document.querySelector(".quiz-question-text");
    const progressNumber = document.querySelector(".quiz-question-progress");
    const progressFill = document.getElementById("progress-fill");
    const progressText = document.getElementById("progress-text");
    const testAmountEl = document.querySelector(".test-amount");

    const variantEls = document.querySelectorAll(".quiz-variant");
    const optionBtns = document.querySelectorAll(".quiz-option");
    const checkBtn = document.querySelector(".btn-check");
    const answerStatusEl = document.querySelector(".answer-status");

    const correctSound = document.getElementById("correctSound");
    const wrongSound = document.getElementById("wrongSound");

    correctSound.preload = "auto";
    wrongSound.preload = "auto";

    const endModal = document.getElementById("endModal");
    const cancelEndBtn = document.getElementById("cancelEnd");
    const confirmEndBtn = document.getElementById("confirmEnd");
    const completeBtn = document.querySelector(".btn-complete");
    const backBtn = document.querySelector(".backto-mainpage-wrapper");

    const restartBtn = document.getElementById("restartBtn");
    const backToMainPage = document.querySelector(".back-tomain-page");

    const questionPicEl = document.querySelector(".quiz-options-pic");

    let selectedOption = null;
    let isAnswered = false;
    let hasAnswered = Object.values(selectedAnswers).some((a) => a.checked);

    if (testAmountEl) {
      testAmountEl.textContent = `${totalQuestions} test`;
    }

    function shuffle(array) {
      return [...array].sort(() => Math.random() - 0.5);
    }

    function renderQuestion(index) {
      const q = data[index];

      subjectEls.forEach((el) => (el.textContent = q.subject));
      if (topicTitleEl) topicTitleEl.textContent = q.topic;

      questionText.textContent = q.question;
      progressNumber.textContent = `${index + 1} / ${totalQuestions}`;
      progressText.textContent = `${index + 1}/${totalQuestions}`;
      progressFill.style.width = ((index + 1) / totalQuestions) * 100 + "%";

      if (q.questionpic) {
        questionPicEl.src = q.questionpic;
        questionPicEl.style.display = "block";
      } else {
        questionPicEl.src = "";
        questionPicEl.style.display = "none";
      }

      const correct = q.answer;

      if (!shuffledAnswers[index]) {
        const answers = [correct];
        while (answers.length < 4) {
          const r = data[Math.floor(Math.random() * data.length)].answer;
          if (!answers.includes(r)) answers.push(r);
        }
        shuffledAnswers[index] = shuffle(answers);
        localStorage.setItem("shuffledAnswers", JSON.stringify(shuffledAnswers));
      }

      shuffledAnswers[index].forEach((text, i) => {
        variantEls[i].textContent = text;
        optionBtns[i].classList.remove("selected");
        optionBtns[i].style = "";
        optionBtns[i].disabled = false;
      });

      const saved = selectedAnswers[index];
      if (saved) {
        const selectedText = saved.answer;
        optionBtns.forEach((btn) => {
          const btnText = btn.querySelector(".quiz-variant").textContent;
          if (btnText === selectedText) {
            btn.classList.add("selected");
            selectedOption = btn;
          }
        });

        checkBtn.disabled = false;
        checkBtn.classList.add("active");

        if (saved.checked) {
          isAnswered = true;
          optionBtns.forEach((btn) => (btn.disabled = true));

          if (selectedText === correct) {
            selectedOption.style.border = "2px solid #00c853";
            selectedOption.style.backgroundColor = "#f0fdf4";
            answerStatusEl.innerHTML = `<img class="correction" src="../images/icons/correctanswericon.gif" alt="Correct" /> <span>To‘g‘ri javob</span>`;
          } else {
            selectedOption.style.border = "2px solid #FB2C36";
            selectedOption.style.backgroundColor = "#FEF2F2";
            answerStatusEl.innerHTML = `<img src="../images/icons/incorrect-answer.gif" alt="Incorrect" /> <span>No‘to‘g‘ri javob</span>`;
            optionBtns.forEach((btn) => {
              if (btn.querySelector(".quiz-variant").textContent === correct) {
                btn.style.border = "2px solid #00c853";
                btn.style.backgroundColor = "#f0fdf4";
              }
            });
            checkBtn.style.backgroundColor = "#F62B35";
            checkBtn.style.color = "#fff";
          }

          answerStatusEl.style.display = "flex";
          checkBtn.textContent =
            currentIndex + 1 === totalQuestions ? "Natijalar" : "Keyingisi";
          checkBtn.classList.add("next-question");

          if (checkBtn.textContent === "Natijalar") {
            checkBtn.style.border = "2px solid #00c853";
            checkBtn.style.backgroundColor = "#f0fdf4";
            checkBtn.style.color = "#00c853";
          }
        } else {
          isAnswered = false;
          answerStatusEl.style.display = "none";
          answerStatusEl.innerHTML = "";
        }
      } else {
        selectedOption = null;
        checkBtn.disabled = true;
        checkBtn.classList.remove("active");
        isAnswered = false;
        answerStatusEl.style.display = "none";
        answerStatusEl.innerHTML = "";
      }

      if (!saved || !saved.checked) {
        checkBtn.textContent = "Tekshirish";
        checkBtn.classList.remove("next-question");
        checkBtn.style = "";
      }
    }

    optionBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (isAnswered) return;
        optionBtns.forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedOption = btn;
        checkBtn.disabled = false;
        checkBtn.classList.add("active");
        const selectedText = btn.querySelector(".quiz-variant").textContent;
        selectedAnswers[currentIndex] = {
          answer: selectedText,
          checked: false,
        };
        localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));
      });
    });

    checkBtn.addEventListener("click", () => {
      if (checkBtn.classList.contains("next-question")) {
        if (currentIndex + 1 < totalQuestions) {
          currentIndex++;
          localStorage.setItem("quizIndex", currentIndex);
          renderQuestion(currentIndex);
        } else {
          showResultModal();
        }
        return;
      }

      if (!selectedOption) return;
      const correct = data[currentIndex].answer;
      const selectedText = selectedOption.querySelector(".quiz-variant").textContent;

      isAnswered = true;
      hasAnswered = true;
      optionBtns.forEach((btn) => (btn.disabled = true));

      if (selectedText === correct) {
        correctSound.currentTime = 0;
        correctSound.play().catch(() => {});
        selectedOption.style.border = "2px solid #00c853";
        selectedOption.style.backgroundColor = "#f0fdf4";
        answerStatusEl.innerHTML = `<img class="correction" src="../images/icons/correctanswericon.gif" alt="Correct" /> <span>To‘g‘ri javob</span>`;
      } else {
        wrongSound.currentTime = 0;
        wrongSound.play().catch(() => {});
        selectedOption.style.border = "2px solid #FB2C36";
        selectedOption.style.backgroundColor = "#FEF2F2";
        answerStatusEl.innerHTML = `<img src="../images/icons/incorrect-answer.gif" alt="Incorrect" /> <span>No‘to‘g‘ri javob</span>`;
        optionBtns.forEach((btn) => {
          if (btn.querySelector(".quiz-variant").textContent === correct) {
            btn.style.border = "2px solid #00c853";
            btn.style.backgroundColor = "#f0fdf4";
          }
        });
        checkBtn.style.backgroundColor = "#F62B35";
        checkBtn.style.color = "#fff";
      }

      answerStatusEl.style.display = "flex";
      checkBtn.textContent =
        currentIndex + 1 === totalQuestions ? "Natijalar" : "Keyingisi";
      checkBtn.classList.add("next-question");
      if (checkBtn.textContent === "Natijalar") {
        checkBtn.style.border = "2px solid #00c853";
        checkBtn.style.backgroundColor = "#f0fdf4";
        checkBtn.style.color = "#00c853";
      }

      selectedAnswers[currentIndex] = { answer: selectedText, checked: true };
      localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));
    });

    function openEndModal(title, body, href = null) {
      document.querySelector(".modal-title").textContent = title;
      document.querySelector(".modal-desc").textContent = body;
      confirmEndBtn.dataset.href = href || "../html/themetest.html";
      endModal.classList.add("active");
    }

    document.querySelectorAll("a, .btn-login, .nav-link, .logo, .header-link").forEach((el) => {
      el.addEventListener("click", (e) => {
        const href = el.getAttribute("href");
        if (hasAnswered && href && !el.closest("#endModal")) {
          e.preventDefault();
          openEndModal(
            "Siz boshqa sahifaga o'tmoqchisiz",
            "Agar boshqa sahifaga o'tsangiz, test yakunlanadi. Davom etasizmi?",
            href
          );
        }
      });
    });

    confirmEndBtn?.addEventListener("click", () => {
      const redirect = confirmEndBtn.dataset.href || "../html/themetest.html";
      clearTestData();
      window.location.href = redirect;
    });

    completeBtn?.addEventListener("click", () => {
      openEndModal(
        "Testni yakunlashni xohlaysizmi?",
        "Yakunlaganingizdan so‘ng javoblaringizni o‘zgartira olmaysiz. Davom etishni istaysizmi?",
        "../html/themetest.html"
      );
    });

    backBtn?.addEventListener("click", () => {
      if (hasAnswered) {
        openEndModal(
          "Siz boshqa sahifaga o'tmoqchisiz",
          "Agar boshqa sahifaga o'tsangiz, test yakunlanadi. Davom etasizmi?",
          "../html/themetest.html"
        );
      } else {
        clearTestData();
        window.location.href = "../html/themetest.html";
      }
    });

    cancelEndBtn?.addEventListener("click", () => endModal.classList.remove("active"));
    window.addEventListener("click", (e) => {
      if (e.target === endModal) {
        endModal.classList.remove("active");
      }
    });

    restartBtn?.addEventListener("click", () => {
      clearTestData();
      location.reload();
    });

    backToMainPage?.addEventListener("click", () => {
      clearTestData();
      window.location.href = "../html/themetest.html";
    });

    document.getElementById("resultTopic").textContent =
      data[0]?.subject + ". " + data[0]?.topic;

    function showResultModal() {
      const resultModal = document.getElementById("resultModal");
      let correctCount = 0;
      for (let i = 0; i < data.length; i++) {
        const q = data[i];
        const saved = selectedAnswers[i];
        if (saved && saved.checked && saved.answer === q.answer) {
          correctCount++;
        }
      }
      const wrongCount = data.length - correctCount;
      document.getElementById("correctCount").textContent = correctCount;
      document.getElementById("wrongCount").textContent = wrongCount;
      document.getElementById("totalCount").textContent = data.length;
      document.getElementById("resultTopic").textContent =
        data[0]?.subject + ". " + data[0]?.topic;
      resultModal.classList.add("active");
      const box = resultModal.querySelector(".result-modal-box");
      if (box) box.style.animation = "scaleFromCenter 0.35s ease forwards";
    }

    renderQuestion(currentIndex);

    const allImgs = document.querySelectorAll("img");
    allImgs.forEach((img) => {
      img.setAttribute("draggable", "false");
      img.style.userSelect = "none";
      img.style.pointerEvents = "none";
    });
  })
  .catch((err) => {
    alert("Test ma'lumotlarini yuklashda xatolik yuz berdi.");
    console.error(err);
  });

  // ===================== NATIJANI KO'RSATISH VA YAKUNLASH =====================
function showResultModal(correctCount, wrongCount, totalCount) {
  const resultModal = document.getElementById("resultModal");
  
  // Natijalarni modalga qo'shish
  document.getElementById("correctCount").textContent = correctCount;
  document.getElementById("wrongCount").textContent = wrongCount;
  document.getElementById("totalCount").textContent = totalCount;
  
  // Modalni ko'rsatish
  resultModal.classList.add("active");
}

// ===================== TESTNI YAKUNLASH =====================
function finishTest() {
  const shuffledData = JSON.parse(localStorage.getItem("shuffledData"));
  const selectedAnswers = JSON.parse(localStorage.getItem("selectedAnswers"));

  if (!shuffledData || !selectedAnswers) {
    alert("Test yakunlanmagan yoki test ma'lumotlari yo'q.");
    return;
  }

  let correctCount = 0;
  shuffledData.forEach((question, index) => {
    if (selectedAnswers[index] && selectedAnswers[index].checked && selectedAnswers[index].answer === question.answer) {
      correctCount++;
    }
  });

  const wrongCount = shuffledData.length - correctCount;
  
  // Natijani ko'rsatish
  showResultModal(correctCount, wrongCount, shuffledData.length);
  
  // Test ma'lumotlarini tozalash
  clearTestData();
}

// ===================== TESTNI QAYTA BOSHLASH =====================
function restartTest() {
  const selectedSubject = localStorage.getItem("selectedSubject");
  const selectedTopic = localStorage.getItem("selectedTopic");

  if (!selectedSubject || !selectedTopic) {
    alert("Testni qayta boshlash uchun mavzu tanlanishi kerak.");
    return;
  }

  // Test ma'lumotlarini qayta yuklash
  const filteredData = test.filter(
    (q) => q.subject === selectedSubject && q.topic === selectedTopic
  );

  const shuffledData = shuffle(filteredData);
  localStorage.setItem("shuffledData", JSON.stringify(shuffledData));
  localStorage.setItem("quizIndex", 0); // Testni boshlash indeksi
  localStorage.setItem("selectedAnswers", JSON.stringify({})); // Javoblar

  // Yangi testni yuklash
  renderQuestion(0); // Dastlabki savolni chiqarish
}

// ===================== TEST MA'LUMOTLARINI TOZALOVCHI FUNKSIYA =====================
function clearTestData() {
  const keepLogin = localStorage.getItem("loggedInUser");

  // Testni yakunlaganda tozalash
  localStorage.removeItem("selectedSubject");
  localStorage.removeItem("selectedTopic");
  localStorage.removeItem("shuffledData");
  localStorage.removeItem("quizIndex");
  localStorage.removeItem("shuffledAnswers");
  localStorage.removeItem("selectedAnswers");

  // Login ma'lumotlarini saqlash (agar mavjud bo'lsa)
  if (keepLogin) localStorage.setItem("loggedInUser", keepLogin);
}

// ===================== QAYTA BOSHLASH FUNGSIYASI =====================
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}
