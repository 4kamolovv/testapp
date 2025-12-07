const topicItems = document.querySelectorAll('.topic-item');
const testCardWrapper = document.querySelector(".test-card-wrapper");
const contentTitle = document.querySelector(".content-title");
const searchInput = document.querySelector(".search-input");

let allTests = []; // Barcha testlar
let currentFilteredTests = []; // Hozir tanlangan fan bo‘yicha

// Highlight qilish uchun util funksiyasi
function highlightText(text, search) {
  if (!search) return text;
  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // special belgilarni qochirish
  const regex = new RegExp(escaped, "gi");
  return text.replace(regex, match => `<mark>${match}</mark>`);
}

// Card render funksiyasi (highlight bilan)
function renderTestCards(filteredTests, highlight = "") {
  const topicMap = new Map();

  filteredTests.forEach(q => {
    if (!topicMap.has(q.topic)) {
      topicMap.set(q.topic, q);
    }
  });

  testCardWrapper.innerHTML = "";

  if (topicMap.size === 0) {
    testCardWrapper.innerHTML = `<p>Test topilmadi.</p>`;
    return;
  }

function getRandomNumber(min, max) {
  const random = Math.floor(Math.random() * ((max - min) / 10 + 0.1)) * 7 + min;
  return random;
}



  topicMap.forEach(data => {
    const card = document.createElement("div");
    card.className = "test-card";
    card.innerHTML = `
      <div class="test-card-top-wrapper">
        <div class="test-card-top">
          <div class="test-card-subject">${highlightText(data.subject, highlight)}</div>
          <img src="../images/icons/bookmark.svg" alt="Bookmark" class="test-bookmark-icon">
        </div>
        <div class="test-card-title">${highlightText(data.topic, highlight)}</div>
      </div>
      <div class="test-card-footer">
        <div class="test-card-stat">
          <img src="../images/icons/staricon.svg" alt="Reyting" class="test-icon">
          <span>4.67</span>
        </div>
        <div class="test-card-stat">
          <img src="../images/icons/quantityicon.svg" alt="Test soni" class="test-icon">
          <span>${filteredTests.filter(t => t.topic === data.topic).length}test</span>
        </div>
        <div class="test-card-stat">
          <img src="../images/icons/viewsicon.svg" alt="Ko‘rilgan" class="test-icon">
          <span>${getRandomNumber(100, 400)} views</span>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      localStorage.setItem("selectedSubject", data.subject);
      localStorage.setItem("selectedTopic", data.topic);
      window.location.href = "../html/test.html";
    });

    testCardWrapper.appendChild(card);
  });
}

// JSON dan testlarni yuklash
fetch("https://4kamolovv.github.io/docs/data/data.json")
  .then(response => response.json())
  .then(test => {
    allTests = test;

    topicItems.forEach(item => {
      item.addEventListener("click", () => {
        topicItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        const selectedTopic = item.getAttribute("data-topic");
        contentTitle.textContent = item.textContent.trim();

        currentFilteredTests = selectedTopic === "barchasi"
          ? allTests
          : allTests.filter(q => q.subject.toLowerCase().replace(/\s+/g, '-') === selectedTopic);

        renderTestCards(currentFilteredTests, searchInput.value.trim().toLowerCase());
      });
    });

    // Dastlab "Barchasi" ni faollashtiramiz
    document.querySelector('.topic-item.active')?.click();
  })
  .catch(error => {
    testCardWrapper.innerHTML = `<p>Xatolik: test ma'lumotlari yuklanmadi.</p>`;
    console.error("Xatolik:", error);
  });

// 🔍 Qidiruv inputi bo‘yicha
searchInput?.addEventListener("input", () => {
  const searchValue = searchInput.value.trim().toLowerCase();

  const filtered = currentFilteredTests.filter(q =>
    q.subject.toLowerCase().includes(searchValue) ||
    q.topic.toLowerCase().includes(searchValue)
  );

  renderTestCards(filtered, searchValue);
});
