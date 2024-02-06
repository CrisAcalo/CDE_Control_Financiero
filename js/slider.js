document
  .querySelector("#toggle_button_container")
  .addEventListener("click", function () {
    const slider = document.querySelector("#slider");
    var sliderElements = document.getElementsByClassName(
      "slider_element_content"
    );
    var arrowsElements = document.getElementsByClassName(
      "arrow_slider_element"
    );
    const mainContainer = document.querySelector("#main_container");
    mainContainer.classList.toggle("rezise_grid_slider_open");

    slider.classList.toggle("toggle_open_slider");

    Array.from(sliderElements).forEach(function (elemento) {
      elemento.classList.toggle("element_slider_toggle");
    });

    Array.from(arrowsElements).forEach(function (elemento) {
      elemento.classList.toggle("display_block");
    });
  });

document
  .querySelector("#slider_hamburguer_icon")
  .addEventListener("click", function () {
    const slider = document.querySelector("#slider");
    slider.classList.toggle("left_zero");
    this.classList.toggle("slider_hamburguer_icon_move");
  });
