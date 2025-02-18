// Check owner authentication
function checkOwnerAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!token || !user || user.role !== 'owner') {
        window.location.href = 'owner-login.html';
        return false;
    }
    return true;
}

if (!checkOwnerAuth()) {
    window.location.href = 'owner-login.html';
}

let orders = [];

// Load orders
function loadOrders() {
    try {
        orders = JSON.parse(localStorage.getItem('orders') || '[]')
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        renderOrders();
    } catch (error) {
        handleError(error);
    }
}

// Filter orders by status
function filterOrders(status) {
    const filteredOrders = status === 'all' 
        ? orders 
        : orders.filter(order => order.status === status);
    renderOrders(filteredOrders);
}

// Render orders
function renderOrders(ordersToRender = orders) {
    const ordersList = document.getElementById('ordersList');
    
    if (!ordersToRender || ordersToRender.length === 0) {
        ordersList.innerHTML = `
            <div class="no-orders">
                <p>No orders found</p>
            </div>
        `;
        return;
    }

    ordersList.innerHTML = ordersToRender.map(order => `
        <div class="order-card">
            <div class="order-header">
                <h3>Order #${order.id}</h3>
                <select class="status-select" data-order-id="${order.id}" onchange="updateOrderStatus('${order.id}', this.value)">
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="out-for-delivery" ${order.status === 'out-for-delivery' ? 'selected' : ''}>Out for Delivery</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
            </div>
            <div class="customer-info">
                <p><strong>Customer:</strong> ${order.customer.name}</p>
                <p><strong>Email:</strong> ${order.customer.email}</p>
                <p><strong>Phone:</strong> ${order.customer.phone}</p>
                <p><strong>Address:</strong> ${order.customer.address}, ${order.customer.city} ${order.customer.postal}</p>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p>Quantity: ${item.quantity}</p>
                            <p>Price: ${formatCurrency(item.price)}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <h4>Total Cost: ${formatCurrency(order.total)}</h4>
            </div>
            <div class="action-buttons">
                <button class="action-btn view-btn" onclick="viewOrderDetails('${order.id}')">View Details</button>
                <button class="action-btn print-btn" onclick="printOrder('${order.id}')">Print Order</button>
            </div>
        </div>
    `).join('');
}

// Update order status
async function updateOrderStatus(orderId, newStatus) {
    try {
        const orderIndex = orders.findIndex(order => order.id === orderId);
        if (orderIndex === -1) return;

        orders[orderIndex].status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        showNotification('Order status updated successfully');
    } catch (error) {
        handleError(error);
    }
}

// View order details
function viewOrderDetails(orderId) {
    const order = orders.find(order => order.id === orderId);
    if (!order) return;

    // Create a formatted view of the order details
    const details = `
        Order Details:
        --------------
        Order ID: #${order.id}
        Date: ${new Date(order.date).toLocaleString()}
        Status: ${order.status}

        Customer Information:
        -------------------
        Name: ${order.customer.name}
        Email: ${order.customer.email}
        Phone: ${order.customer.phone}
        Address: ${order.customer.address}, ${order.customer.city} ${order.customer.postal}

        Items:
        ------
        ${order.items.map(item => `
        - ${item.name}
          Quantity: ${item.quantity}
          Price: ${formatCurrency(item.price)}
          Subtotal: ${formatCurrency(item.price * item.quantity)}
        `).join('\n')}

        Summary:
        --------
        Subtotal: ${formatCurrency(order.total - 10)}
        Shipping: ${formatCurrency(10)}
        Total: ${formatCurrency(order.total)}
    `;

    console.log(details);
    showNotification('Order details logged to console');
}

// Print order
function printOrder(orderId) {
    const order = orders.find(order => order.id === orderId);
    if (!order) return;

    const printContent = `
        <div class="print-order">
            <h2>Order #${order.id}</h2>
            <div class="order-date">
                <p>Date: ${new Date(order.date).toLocaleString()}</p>
                <p>Status: ${order.status}</p>
            </div>
            
            <div class="customer-info">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> ${order.customer.name}</p>
                <p><strong>Email:</strong> ${order.customer.email}</p>
                <p><strong>Phone:</strong> ${order.customer.phone}</p>
                <p><strong>Address:</strong> ${order.customer.address}, ${order.customer.city} ${order.customer.postal}</p>
            </div>
            
            <div class="order-items">
                <h3>Order Items</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>${formatCurrency(item.price)}</td>
                                <td>${formatCurrency(item.price * item.quantity)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="order-summary">
                <h3>Order Summary</h3>
                <p><strong>Subtotal:</strong> ${formatCurrency(order.total - 10)}</p>
                <p><strong>Shipping:</strong> ${formatCurrency(10)}</p>
                <p><strong>Total:</strong> ${formatCurrency(order.total)}</p>
            </div>
        </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Order #${order.id}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .print-order { max-width: 800px; margin: 0 auto; }
                    .order-date { margin: 20px 0; }
                    .customer-info, .order-items, .order-summary { margin: 30px 0; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background-color: #f8f9fa; }
                </style>
            </head>
            <body>
                ${printContent}
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    };
                </script>
            </body>
        </html>
    `);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadOrders();

    // Set up status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            filterOrders(e.target.value);
        });
    }
}); 