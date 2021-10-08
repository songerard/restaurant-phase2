// addEventListener to all delete button
const allDeleteBtn = document.querySelectorAll('.delete-btn')
allDeleteBtn.forEach(btn => btn.addEventListener('click', (event) => {
  const id = event.target.dataset.id
  const name = event.target.dataset.name
  const category = event.target.dataset.category

  // render modal HTML
  const modalHTML = `餐廳名稱：${name}<br>餐廳類別：${category}`
  const modalBody = document.querySelector('.modal-body')
  const deleteForm = document.querySelector('.delete-form')
  modalBody.innerHTML = modalHTML
  deleteForm.action = `/restaurants/${id}/delete`
}))


