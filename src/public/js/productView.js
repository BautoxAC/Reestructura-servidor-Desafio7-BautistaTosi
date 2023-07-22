const url = 'http://localhost:8080/'
const URLactual = window.location.href
const queries = URLactual.split('?')
// eslint-disable-next-line no-undef
const socket = io()
const email = document.getElementById('email')
async function requestAPI () {
  await fetch(`http://localhost:8080/api/products?${queries[1]}`)
    .then(res => res.json())
    .then(data => {
      for (const product of data.payload) {
        document.getElementById('agregateOne' + product._id).addEventListener('click', () => {
          socket.emit('add_product_to_cart_front_to_back', { idProduct: product._id, email: email.innerHTML })
        })
      }
      for (const product of data.payload) {
        document.getElementById('linkDetail' + product._id).addEventListener('click', (e) => {
          e.stopPropagation()
        })
      }
    })
    .catch(error => console.log(error))
}
requestAPI()
socket.on('add_product_to_cart_back_to_front', (data) => {
  if (data.status === 'success') {
    alert(`producto agregado correctamente, puedes encontrar tu carrito aqui: ${url}carts/${data.cartId}`)
  } else {
    alert('ha ocurrido un error')
  }
})
