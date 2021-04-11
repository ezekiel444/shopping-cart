// variables 

const cartBtn = document.querySelector('.cart-btn')
const closeCartBtn = document.querySelector('.close-cart')
const clearCartBtn = document.querySelector('.clear-cart')
const cartDOM = document.querySelector('.cart')
const cartOverLay = document.querySelector('.cart-overlay')
const cartItems = document.querySelector('.cart-items')
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
// add products to the cart
// save cart in local storage
// set cart values
// display cart item
// show the cart
            }) 
    })
}

}

// local storage

class Storage{
    static saveProducts(products){
        localStorage.setItem('products', JSON.stringify(products))
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