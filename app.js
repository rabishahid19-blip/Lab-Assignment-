const express = require('express');
const productRoutes = require('./src/routes/productRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products Dashboard</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #f5f6fa;
        margin: 0;
        padding: 20px;
        color: #333;
      }
      h1 { text-align: center; color: #4CAF50; }
      .container { max-width: 1000px; margin: auto; }
      .section {
        background: #fff;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 20px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }
      input, select, button {
        padding: 8px 10px;
        margin: 5px 5px 5px 0;
        border-radius: 5px;
        border: 1px solid #ccc;
        font-size: 0.9rem;
      }
      button {
        background: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
        transition: 0.3s;
      }
      button:hover { background: #45a049; }
      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 15px;
      }
      .product-card {
        background: #fff;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
        cursor: grab;
      }
      .product-card.dragging {
        opacity: 0.5;
      }
      .product-card h3 { margin: 0 0 10px 0; font-size: 1.2rem; }
      .product-card p { margin: 5px 0; }
      .product-card input { width: calc(50% - 6px); }
      .product-card .actions { margin-top: 10px; display: flex; gap: 5px; flex-wrap: wrap; }
      .message {
        margin-top: 10px;
        padding: 6px 10px;
        border-radius: 5px;
        font-size: 0.85rem;
        display: none;
      }
      .success { background: #d4edda; color: #155724; }
      .error { background: #f8d7da; color: #721c24; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Products Dashboard</h1>

      <div class="section">
        <h2>Create New Product</h2>
        <input type="text" id="newName" placeholder="Product Name">
        <input type="number" id="newPrice" placeholder="Product Price">
        <button onclick="createProduct()">Create</button>
        <div id="createMsg" class="message"></div>
      </div>

      <div class="section">
        <h2>Search & Filter</h2>
        <input type="text" id="searchName" placeholder="Search by name" oninput="applyFilters()">
        <input type="number" id="minPrice" placeholder="Min price" oninput="applyFilters()">
        <input type="number" id="maxPrice" placeholder="Max price" oninput="applyFilters()">
        <select id="sortOption" onchange="applyFilters()">
          <option value="">Sort By</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="price-asc">Price Low-High</option>
          <option value="price-desc">Price High-Low</option>
        </select>
      </div>

      <h2>All Products</h2>
      <div id="productsGrid" class="products-grid"></div>
    </div>

    <script>
      const apiBase = '/products';
      const grid = document.getElementById('productsGrid');
      let allProducts = [];

      function formatPrice(price) {
        return '$' + Number(price).toFixed(2);
      }

      async function fetchProducts() {
        const res = await fetch(apiBase);
        allProducts = await res.json();
        renderProducts(allProducts);
      }

      function renderProducts(products) {
        grid.innerHTML = '';
        if (products.length === 0) {
          grid.innerHTML = '<p>No products found.</p>';
          return;
        }
        products.forEach(product => {
          const card = document.createElement('div');
          card.className = 'product-card';
          card.draggable = true;
          card.dataset.id = product.id;
          card.innerHTML = ''
            + '<h3>' + product.name + '</h3>'
            + '<p><strong>ID:</strong> ' + product.id + '</p>'
            + '<p><strong>Price:</strong> ' + formatPrice(product.price) + '</p>'
            + '<input type="text" placeholder="New Name" id="name-' + product.id + '">'
            + '<input type="number" placeholder="New Price" id="price-' + product.id + '">'
            + '<div class="actions">'
            + '<button onclick="updateProduct(' + product.id + ')">Update</button>'
            + '<button onclick="deleteProduct(' + product.id + ')" style="background:#e74c3c">Delete</button>'
            + '</div>'
            + '<div id="msg-' + product.id + '" class="message"></div>';
          grid.appendChild(card);
        });

        initDragAndDrop();
      }

      function applyFilters() {
        let filtered = [...allProducts];
        const nameFilter = document.getElementById('searchName').value.toLowerCase();
        const minPrice = parseFloat(document.getElementById('minPrice').value);
        const maxPrice = parseFloat(document.getElementById('maxPrice').value);
        const sort = document.getElementById('sortOption').value;

        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(nameFilter) &&
          (isNaN(minPrice) || p.price >= minPrice) &&
          (isNaN(maxPrice) || p.price <= maxPrice)
        );

        if (sort) {
          if (sort === 'name-asc') filtered.sort((a,b) => a.name.localeCompare(b.name));
          if (sort === 'name-desc') filtered.sort((a,b) => b.name.localeCompare(a.name));
          if (sort === 'price-asc') filtered.sort((a,b) => a.price - b.price);
          if (sort === 'price-desc') filtered.sort((a,b) => b.price - a.price);
        }

        renderProducts(filtered);
      }

      async function createProduct() {
        const name = document.getElementById('newName').value;
        const price = document.getElementById('newPrice').value;
        const msg = document.getElementById('createMsg');
        msg.style.display = 'none';
        if (!name || !price) {
          msg.textContent = 'Enter name and price';
          msg.className = 'message error';
          msg.style.display = 'block';
          return;
        }
        const res = await fetch(apiBase, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ name, price: Number(price) })
        });
        const data = await res.json();
        msg.textContent = 'Product Created: ' + JSON.stringify(data);
        msg.className = 'message success';
        msg.style.display = 'block';
        document.getElementById('newName').value = '';
        document.getElementById('newPrice').value = '';
        fetchProducts();
      }

      async function updateProduct(id) {
        const name = document.getElementById('name-' + id).value;
        const price = document.getElementById('price-' + id).value;
        const msg = document.getElementById('msg-' + id);
        msg.style.display = 'none';
        const body = {};
        if (name) body.name = name;
        if (price) body.price = Number(price);
        const res = await fetch(apiBase + '/' + id, {
          method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
        });
        const data = await res.json();
        msg.textContent = data.message || 'Product Updated';
        msg.className = 'message success';
        msg.style.display = 'block';
        document.getElementById('name-' + id).value = '';
        document.getElementById('price-' + id).value = '';
        fetchProducts();
      }

      async function deleteProduct(id) {
        const msg = document.getElementById('msg-' + id);
        msg.style.display = 'none';
        const res = await fetch(apiBase + '/' + id, { method:'DELETE' });
        const data = await res.json();
        msg.textContent = data.message || 'Product Deleted';
        msg.className = 'message success';
        msg.style.display = 'block';
        fetchProducts();
      }

      // Drag-and-drop
      function initDragAndDrop() {
        const cards = document.querySelectorAll('.product-card');
        let dragSrc = null;

        cards.forEach(card => {
          card.addEventListener('dragstart', e => {
            dragSrc = card;
            card.classList.add('dragging');
          });
          card.addEventListener('dragend', e => card.classList.remove('dragging'));
          card.addEventListener('dragover', e => e.preventDefault());
          card.addEventListener('drop', e => {
            e.preventDefault();
            if (card !== dragSrc) {
              const parent = card.parentNode;
              parent.insertBefore(dragSrc, card.nextSibling);
              // Optional: Update allProducts array order
            }
          });
        });
      }

      fetchProducts();
    </script>
  </body>
  </html>
  `);
});

app.use('/products', productRoutes);
app.listen(PORT, function() {
  console.log("Server running on http://localhost:" + PORT);
});