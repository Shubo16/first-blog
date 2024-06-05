let prevScrollpos = window.pageYOffset;
const header = document.getElementsByClassName("header");

window.onscroll = function() {
  let currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    header.classList.remove("header"); // Show header
  } else {
    header.classList.add("header"); // Hide header
  }
  prevScrollpos = currentScrollPos;
};



document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const fullscreenMenu = document.getElementById('fullscreenMenu');

  hamburger.addEventListener('click', function () {
    fullscreenMenu.classList.toggle('active');
  });

  fullscreenMenu.addEventListener('click', function () {
    fullscreenMenu.classList.remove('active');
  });
});



