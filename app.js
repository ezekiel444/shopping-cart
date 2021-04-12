// variables 

const cartBtn = document.querySelector('.cart-btn')
const closeCartBtn = document.querySelector('.close-cart')
const clearCartBtn = document.querySelector('.clear-cart')
const cartDOM = document.querySelector('.cart')
const cartOverLay = document.querySelector('.cart-overlay')
const cartItems = document.querySelector('.cart-items')
const cartTotal = document.querySelector('.cart-total')
const cartContent = document.querySelector('.cart-content')
const productsDOM = document.querySelector('.products-center')
// cart

let cart = [ ]
// buttons
let buttonsDOM = []

// getting the products

class Products{
async getProducts(){
try{
    const results = await (await fetch('package.json')).json()
 return results.items.map(item=>{
    const {sys:{id}, fields:{title, price, image:{fields:{file:{url}}}}} = item
    return {id,title,price,url}
})
}catch(error){
    console.log(error);
}

}
}

// display products

class UI{
    displayProducts(products){
      products.map(product=>{
    const allProductsHtml = 
          `
          <article class="product">
          <div class="img-container">
              <img src=${product.url} class="product-img" alt="product">
              <button class="bag-btn" data-id=${product.id}>
                  <i class="fas fa-shoppig-cart"></i>
                  add to bag
              </button>
          </div>
          <h3>${product.title}</h3>
          <h4>$${product.price}</h4>
      
      </article>
          `
       productsDOM.innerHTML += allProductsHtml
      })

   
    }

getProductsBtn(){
    const allBtn = [...document.querySelectorAll('.bag-btn')]
    buttonsDOM = allBtn
    allBtn.map(button=>{
        const id = button.dataset.id
        let inCart = cart.find(item=>item.id === id)
        if(inCart){
          button.innerHTML = 'In Cart'  
          button.disabled = true
        }
            button.addEventListener('click',(event)=>{
event.target.innerText = 'In Cart'
event.target.disabled = true
// get product from products
let cartItem = {...Storage.getProduct(id), amount:1}
cart = [...cart, cartItem]

// add products to the cart
// save cart in local storage
Storage.saveCart(cart)
// set cart values
this.setCartValues(cart)
// display cart item
this.addCartItem(cartItem)
// show the cart
this.showCart()
            }) 
    })
}
setCartValues(cart){
    let temTotal = 0
    let itemsTotal = 0
    cart.map(item=>{
        temTotal +=item.price * item.amount
        itemsTotal +=item.amount
    })
    cartTotal.innerText = parseFloat(temTotal.toFixed(2))
    cartItems.innerText = itemsTotal
}
    addCartItem(item){
     const div = document.createElement('div')
    div.classList.add('cart-item')
    div.innerHTML = `<img src=${item.url} alt="product image">
    <div>
        <h4>${item.title}</h4>
        <h5>$${item.price}</h5>
        <span class="remove-item" data-id=${item.id}>remove</span>
    </div>
    <div>
        <i class="fas fa-chevron-up" data-id=${item.id}></i>
        <p class="item-amount">${item.amount}</p>
        <i class="fas fa-chevron-down" data-id=${item.id}></i>
    </div>`

    cartContent.appendChild(div)
    }
    showCart(){
cartOverLay.classList.add('transparentBcg')
cartDOM.classList.add('showCart')
    }
}



// local storage

class Storage{
    static saveProducts(products){
        localStorage.setItem('products', JSON.stringify(products))
    }
    static getProduct(id){
let products = JSON.parse(localStorage.getItem('products'))
return products.find(product=>product.id === id)
    }
    static saveCart(cart){
        localStorage.setItem('cart',JSON.stringify(cart))
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    const ui = new UI();
    const products = new Products()
    products.getProducts().then(product=>{
        ui.displayProducts(product)
        Storage.saveProducts(product)
    }).then(()=>{
        ui.getProductsBtn()
    })
})