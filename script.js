document.addEventListener("DOMContentLoaded", () => {
    const isWishlistPage = window.location.pathname.includes("wishlist.html");
    if (isWishlistPage) {
        DisplayWishlist();
    }
    document.getElementById("go-to-checkout").addEventListener("click", () => {
        window.location.href = "./checkout.html";
    });
    const addToCartButton = document.querySelectorAll(".add-to-cart");
    const deleteAll = document.getElementById("delete-all");
    deleteAll.addEventListener("click", () => {
        localStorage.removeItem("sebet");
        const cartItems = document.getElementById("cart-items");
        cartItems.innerText = "Empty";
        document.getElementById("total-price").innerText = "0";
        UpdateCartCount();
    });
    addToCartButton.forEach((button) => {
        button.addEventListener("click", (e) => {
            const card = e.target.closest(".card");
            const product = {
                id: card.dataset.id,
                image: card.querySelector("img").src,
                title: card.querySelector("h3").innerText,
                price: parseFloat(card.querySelector("p").innerText.replace('$', '')),
                quantity: 1
            };
            addToCart(product);
            DisplayCart();
        });
    });
    function addToCart(addproduct) {
        let cart = JSON.parse(localStorage.getItem("sebet")) || [];

        const existingProductIndex = cart.findIndex((product) => product.id === addproduct.id);

        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push(addproduct);
        }

        localStorage.setItem("sebet", JSON.stringify(cart));
        UpdateCartCount();
    }

    function DisplayCart() {
        let cart = JSON.parse(localStorage.getItem("sebet")) || [];
        const cartItems = document.getElementById("cart-items");
        cartItems.innerHTML = '';

        cart.forEach((product) => {
            const pro = document.createElement("div");
            pro.innerHTML = `<div class="cartProduct" data-id=${product.id}>
                <img class="cartImage" src=${product.image} alt="">
                ${product.title}-${product.quantity} eded -Price: ${(product.quantity * product.price).toFixed(2)}
                <i class="fa-solid fa-trash delete-product"></i>
            </div>`;
            cartItems.appendChild(pro);
        });

        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        document.getElementById("total-price").textContent = totalPrice.toFixed(2);

        const deleteProduct = document.querySelectorAll(".delete-product");

        deleteProduct.forEach(delPro => {
            delPro.addEventListener("click", (e) => {
                const card = e.target.closest(".cartProduct");
                const productId = card.dataset.id;
                RemoveProduct(productId);
            });
        });
    }

    function RemoveProduct(productID) {
        const cart = JSON.parse(localStorage.getItem("sebet")) || [];
        const updateCart = cart.filter(item => item.id !== productID);

        localStorage.setItem("sebet", JSON.stringify(updateCart));
        UpdateCartCount();
        DisplayCart();
    }

    function UpdateCartCount() {
        const cart = JSON.parse(localStorage.getItem("sebet")) || [];
        const totalCount = cart.reduce((total, item) => total + item.quantity, 0);

        document.getElementById("cart-count").innerText = totalCount;
    }

    const addToWishlistButton = document.querySelectorAll(".add-to-wishlist");

    addToWishlistButton.forEach((button) => {
        button.addEventListener("click", (e) => {
            const card = e.target.closest(".card");
            const product = {
                id: card.dataset.id,
                image: card.querySelector("img").src,
                title: card.querySelector("h3").innerText,
                price: parseFloat(card.querySelector("p").innerText.replace("$", '')),
                quantity: 1
            };
            addToWishlist(product);
            if (isWishlistPage) {
                DisplayWishlist();
            } else {
                window.location.href = "./wishlist.html";
            }
        });
    });

    function addToWishlist(data) {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

        let isHas = (product) => product.id === data.id;
        const existWishlist = wishlist.some(isHas);

        if (!existWishlist) {
            wishlist.push(data);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
        } else {
            alert("Bu product wishlistde var!");
        }
    }

    function DisplayWishlist() {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const wishlistItems = document.getElementById("wishlist-items");
        wishlist.forEach((product) => {
            const productElement = document.createElement("div");

            productElement.innerHTML = `<div class="card" >
                <img src=${product.image} alt="">
                <h3>${product.title}</h3>
                <p>${product.price}</p>
                <button class="add-to-cart">Add to cart</button>
                <button class="remove-to-wishlist" data-id=${product.id}>Remove from wishlist</button>
            </div>`;

            wishlistItems.appendChild(productElement);
        });

        wishlistItems.querySelectorAll(".add-to-cart").forEach((button, index) => {
            button.addEventListener("click", () => {
                const product = wishlist[index];
                addToCart({
                    id: product.id,
                    image: product.image,
                    title: product.title,
                    price: parseFloat(product.price),
                    quantity: 1
                });
                DisplayCart();
                window.location.href = "index.html";
            });
        });

        wishlistItems.querySelectorAll(".remove-to-wishlist").forEach(button => {
            button.addEventListener("click", (e) => {
                const productId = e.target.dataset.id;
                removeFromWishlist(productId);
                DisplayWishlist();
                if (wishlistItems.children.length === 0) {
                    window.location.href = "index.html";
                }
            });
        });
    }

    function removeFromWishlist(productID) {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const updatedWishlist = wishlist.filter((item) => item.id !== productID);

        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    }

    UpdateCartCount();
    DisplayCart();
});


