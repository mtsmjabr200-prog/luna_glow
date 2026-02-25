/* ============================================
   LUNA GLOW - JEWELRY WEBSITE
   JavaScript - Interactive Features with Admin Panel
   ============================================ */

// ============================================
// PRODUCTS MANAGEMENT
// ============================================

// Default products
const defaultProducts = [
  // Necklaces
  { id: 1, name: "قلادة ذهبية فاخرة", price: 149.99, image: "images/necklace-1.jpg", category: "قلادات" },
  { id: 2, name: "قلادة اللؤلؤ الأنيقة", price: 189.99, image: "images/necklace-2.jpg", category: "قلادات" },
  { id: 3, name: "قلادة الماس الكلاسيكية", price: 299.99, image: "images/necklace-1.jpg", category: "قلادات" },
  { id: 4, name: "قلادة الزمرد الخضراء", price: 219.99, image: "images/necklace-2.jpg", category: "قلادات" },
  
  // Bracelets
  { id: 5, name: "سوار ذهبي مشغول", price: 129.99, image: "images/rings-bracelets.jpg", category: "أساور" },
  { id: 6, name: "سوار التنس اللامع", price: 249.99, image: "images/rings-bracelets.jpg", category: "أساور" },
  { id: 7, name: "سوار الذهب الوردي", price: 159.99, image: "images/rings-bracelets.jpg", category: "أساور" },
  { id: 8, name: "سوار الياقوت الأزرق", price: 199.99, image: "images/rings-bracelets.jpg", category: "أساور" },
  
  // Earrings
  { id: 9, name: "أقراط الماس المتألقة", price: 179.99, image: "images/earrings.jpg", category: "أقراط" },
  { id: 10, name: "أقراط اللؤلؤ الناعمة", price: 139.99, image: "images/earrings.jpg", category: "أقراط" },
  { id: 11, name: "أقراط الذهب الحلقية", price: 99.99, image: "images/earrings.jpg", category: "أقراط" },
  { id: 12, name: "أقراط الزمرد المتدلية", price: 229.99, image: "images/earrings.jpg", category: "أقراط" },
  
  // Rings
  { id: 13, name: "خاتم الخطوبة الماسي", price: 399.99, image: "images/rings-bracelets.jpg", category: "خواتم" },
  { id: 14, name: "خاتم الزفاف الذهبي", price: 249.99, image: "images/rings-bracelets.jpg", category: "خواتم" },
  { id: 15, name: "خاتم الياقوت الأزرق", price: 279.99, image: "images/rings-bracelets.jpg", category: "خواتم" },
  { id: 16, name: "خاتم الياقوت الأحمر", price: 329.99, image: "images/rings-bracelets.jpg", category: "خواتم" },
  
  // Additional pieces
  { id: 17, name: "مجموعة القلادات المتعددة", price: 169.99, image: "images/necklace-1.jpg", category: "مجموعات" },
  { id: 18, name: "سوار الكريستال الفاخر", price: 189.99, image: "images/rings-bracelets.jpg", category: "أساور" },
  { id: 19, name: "خاتم حجر القمر", price: 159.99, image: "images/rings-bracelets.jpg", category: "خواتم" },
  { id: 20, name: "قلادة الأميثيست البنفسجية", price: 119.99, image: "images/necklace-2.jpg", category: "قلادات" },
];

// Initialize products from localStorage
let products = JSON.parse(localStorage.getItem('lunaGlowProducts')) || defaultProducts;
let cart = JSON.parse(localStorage.getItem('lunaGlowCart')) || [];

// Admin password
const ADMIN_PASSWORD = "admin123";
let isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    setupMobileMenu();
    displayProducts();
    checkAdminStatus();
    
    // Add admin button if not exists
    if (!document.getElementById('adminToggle')) {
        addAdminButton();
    }
});

// ============================================
// ADMIN PANEL FUNCTIONS
// ============================================

function addAdminButton() {
    const navbar = document.querySelector('.navbar-container');
    if (navbar) {
        const adminBtn = document.createElement('button');
        adminBtn.id = 'adminToggle';
        adminBtn.className = 'admin-btn';
        adminBtn.textContent = '⚙️ إدارة';
        adminBtn.onclick = toggleAdminPanel;
        navbar.appendChild(adminBtn);
    }
}

function toggleAdminPanel() {
    if (!isAdminLoggedIn) {
        const password = prompt('أدخل كلمة المرور الإدارية:');
        if (password === ADMIN_PASSWORD) {
            isAdminLoggedIn = true;
            localStorage.setItem('adminLoggedIn', 'true');
            showAdminPanel();
        } else {
            alert('كلمة المرور غير صحيحة!');
        }
    } else {
        showAdminPanel();
    }
}

function showAdminPanel() {
    let adminPanel = document.getElementById('adminPanel');
    
    if (!adminPanel) {
        adminPanel = document.createElement('div');
        adminPanel.id = 'adminPanel';
        adminPanel.className = 'admin-panel';
        document.body.appendChild(adminPanel);
    }
    
    adminPanel.innerHTML = `
        <div class="admin-panel-content">
            <div class="admin-header">
                <h2>لوحة التحكم الإدارية</h2>
                <button class="close-btn" onclick="closeAdminPanel()">✕</button>
            </div>
            
            <div class="admin-tabs">
                <button class="tab-btn active" onclick="switchTab('add-product')">إضافة منتج</button>
                <button class="tab-btn" onclick="switchTab('manage-products')">إدارة المنتجات</button>
                <button class="tab-btn" onclick="switchTab('settings')">الإعدادات</button>
            </div>
            
            <div id="add-product" class="admin-tab active">
                <h3>إضافة منتج جديد</h3>
                <form onsubmit="addNewProduct(event)">
                    <input type="text" id="productName" placeholder="اسم المنتج" required>
                    <input type="number" id="productPrice" placeholder="السعر" step="0.01" required>
                    <select id="productCategory">
                        <option>قلادات</option>
                        <option>أساور</option>
                        <option>أقراط</option>
                        <option>خواتم</option>
                        <option>مجموعات</option>
                    </select>
                    <input type="text" id="productImage" placeholder="رابط الصورة (أو اتركها فارغة)" value="images/necklace-1.jpg">
                    <button type="submit" class="admin-btn-submit">إضافة المنتج</button>
                </form>
            </div>
            
            <div id="manage-products" class="admin-tab">
                <h3>إدارة المنتجات (${products.length})</h3>
                <div class="products-list">
                    ${products.map(p => `
                        <div class="product-item">
                            <div class="product-info">
                                <strong>${p.name}</strong>
                                <p>${p.price} ريال - ${p.category}</p>
                            </div>
                            <button class="delete-btn" onclick="deleteProduct(${p.id})">حذف</button>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div id="settings" class="admin-tab">
                <h3>الإعدادات</h3>
                <button onclick="resetAllData()" class="danger-btn">إعادة تعيين جميع البيانات</button>
                <button onclick="logoutAdmin()" class="logout-btn">تسجيل الخروج</button>
            </div>
        </div>
    `;
    
    adminPanel.style.display = 'block';
}

function closeAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.style.display = 'none';
    }
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function addNewProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const image = document.getElementById('productImage').value || 'images/necklace-1.jpg';
    
    const newProduct = {
        id: Date.now(),
        name,
        price,
        category,
        image
    };
    
    products.push(newProduct);
    localStorage.setItem('lunaGlowProducts', JSON.stringify(products));
    
    // Reset form
    event.target.reset();
    
    // Refresh display
    displayProducts();
    showAdminPanel(); // Refresh admin panel
    
    alert('تم إضافة المنتج بنجاح!');
}

function deleteProduct(id) {
    if (confirm('هل تريد حذف هذا المنتج؟')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('lunaGlowProducts', JSON.stringify(products));
        displayProducts();
        showAdminPanel(); // Refresh admin panel
        alert('تم حذف المنتج بنجاح!');
    }
}

function resetAllData() {
    if (confirm('هل تريد إعادة تعيين جميع البيانات إلى الحالة الافتراضية؟')) {
        products = defaultProducts;
        cart = [];
        localStorage.setItem('lunaGlowProducts', JSON.stringify(products));
        localStorage.setItem('lunaGlowCart', JSON.stringify(cart));
        displayProducts();
        updateCartDisplay();
        showAdminPanel();
        alert('تم إعادة تعيين البيانات!');
    }
}

function logoutAdmin() {
    isAdminLoggedIn = false;
    localStorage.setItem('adminLoggedIn', 'false');
    closeAdminPanel();
    alert('تم تسجيل الخروج');
}

function checkAdminStatus() {
    if (isAdminLoggedIn) {
        const adminBtn = document.getElementById('adminToggle');
        if (adminBtn) {
            adminBtn.style.backgroundColor = '#d4af37';
            adminBtn.style.color = '#000';
        }
    }
}

// ============================================
// PRODUCTS DISPLAY
// ============================================

function displayProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    const bestsellersContainer = document.getElementById('bestsellersProducts');
    
    if (featuredContainer) {
        featuredContainer.innerHTML = products.slice(0, 8).map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/necklace-1.jpg'">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="category">${product.category}</p>
                    <p class="price">${product.price} ريال</p>
                    <button class="add-to-cart-btn" onclick="addToCart('${product.name.replace(/'/g, "\\'")}', ${product.price})">
                        أضيفي إلى السلة
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    if (bestsellersContainer) {
        bestsellersContainer.innerHTML = products.slice(8, 16).map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/necklace-1.jpg'">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="category">${product.category}</p>
                    <p class="price">${product.price} ريال</p>
                    <button class="add-to-cart-btn" onclick="addToCart('${product.name.replace(/'/g, "\\'")}', ${product.price})">
                        أضيفي إلى السلة
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// ============================================
// SHOPPING CART FUNCTIONALITY
// ============================================

function addToCart(productName, price) {
    const item = {
        id: Date.now(),
        name: productName,
        price: price,
        quantity: 1
    };

    const existingItem = cart.find(cartItem => cartItem.name === productName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(item);
    }

    localStorage.setItem('lunaGlowCart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification(`تم إضافة ${productName} إلى السلة`);
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('lunaGlowCart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    if (cartCount) cartCount.textContent = cart.length;

    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">السلة فارغة</p>';
            if (cartTotal) cartTotal.textContent = '0 ريال';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">${item.price * item.quantity} ريال</span>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">✕</button>
                </div>
            `).join('');

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            if (cartTotal) cartTotal.textContent = total + ' ريال';
        }
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
    }
}

function checkoutCart() {
    if (cart.length === 0) {
        alert('السلة فارغة!');
        return;
    }

    const cartText = cart.map(item => `${item.name} x${item.quantity} = ${item.price * item.quantity} ريال`).join('\n');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = `مرحباً، أود شراء:\n\n${cartText}\n\nالإجمالي: ${total} ريال`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// MOBILE MENU
// ============================================

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}
