document.addEventListener("DOMContentLoaded", function () {
  const dayButtons = document.querySelectorAll(".dayChoosed");
  const forecastCards = document.querySelectorAll(".card.forecast");

  if (forecastCards.length > 0) {
    forecastCards[0].classList.add("active");
    dayButtons[0].classList.add("active");
  }

  dayButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const dayIndex = this.getAttribute("data-day");

      dayButtons.forEach((btn) => btn.classList.remove("active"));
      forecastCards.forEach((card) => card.classList.remove("active"));

      this.classList.add("active");
      forecastCards[dayIndex].classList.add("active");
    });
  });
});
