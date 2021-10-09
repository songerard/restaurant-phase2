// disabling form submissions if there are invalid fields
(function () {
  'use strict';
  window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    let forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    let validation = Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();

// show and hide input form for other category
function categoryForm(selectedCategory) {
  const otherCategory = document.querySelector('.other-category')
  if (selectedCategory === '其他') {
    otherCategory.classList.remove('invisible')
    otherCategory.classList.add('visible')
    otherCategory.pattern = ".*\\S+.*"
    otherCategory.required = true
  } else {
    otherCategory.classList.remove('visible')
    otherCategory.classList.add('invisible')
    otherCategory.removeAttribute('pattern')
    otherCategory.required = false
  }
}

// show rating and stars
function showRating(rating) {

  // show rating
  const ratingNum = document.querySelector('#star-rating')
  ratingNum.innerText = rating

  // show star color
  const stars = document.querySelectorAll('.star')
  for (let i = 0; i < stars.length; i++) {
    if (rating >= i + 1) {
      stars[i].classList.remove('far')
      stars[i].classList.remove('fa-star-half-alt')
      stars[i].classList.add('fas')
      stars[i].classList.add('fa-star')
    } else if (rating >= i + 0.5) {
      stars[i].classList.remove('far')
      stars[i].classList.remove('fa-star')
      stars[i].classList.add('fas')
      stars[i].classList.add('fa-star-half-alt')
    } else {
      stars[i].classList.remove('fas')
      stars[i].classList.remove('fa-star-half-alt')
      stars[i].classList.add('far')
      stars[i].classList.add('fa-star')
    }
  }
}

