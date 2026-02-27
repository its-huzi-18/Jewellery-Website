import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send order confirmation email to customer
export const sendOrderConfirmationEmail = async (order, user) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Black & Gold Jewelry" <${process.env.EMAIL_USER}>`,
      to: order.shippingAddress.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Georgia', serif; line-height: 1.6; color: #0A0A0A; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0A0A0A 0%, #171717 100%); color: #C9A54D; padding: 30px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #E5E5E5; }
              .order-info { background: #F9F5EB; padding: 20px; margin: 20px 0; border-left: 4px solid #C9A54D; }
              .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .items-table th { background: #0A0A0A; color: #C9A54D; padding: 12px; text-align: left; }
              .items-table td { padding: 12px; border-bottom: 1px solid #E5E5E5; }
              .total { background: #0A0A0A; color: #C9A54D; padding: 15px; text-align: right; font-size: 18px; font-weight: bold; }
              .footer { background: #0A0A0A; color: #888; padding: 20px; text-align: center; font-size: 12px; }
              .button { display: inline-block; background: linear-gradient(135deg, #C9A54D 0%, #B88D3A 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>BLACK & GOLD</h1>
                <p style="margin: 10px 0 0 0; color: #fff;">Order Confirmation</p>
              </div>
              
              <div class="content">
                <h2 style="color: #0A0A0A;">Dear ${order.shippingAddress.fullName},</h2>
                
                <p>Thank you for your order! We're pleased to confirm that your order has been received and is being processed.</p>
                
                <div class="order-info">
                  <h3 style="margin-top: 0; color: #0A0A0A;">Order Details</h3>
                  <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                  <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p><strong>Order Status:</strong> <span style="color: #C9A54D;">${order.orderStatus.toUpperCase()}</span></p>
                </div>

                <h3 style="color: #0A0A0A;">Order Items</h3>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${order.items.map(item => `
                      <tr>
                        <td>${item.title}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>$${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>

                <div class="total">Total: $${order.total.toFixed(2)}</div>

                <div style="margin: 30px 0;">
                  <h3 style="color: #0A0A0A;">Shipping Address</h3>
                  <p style="color: #555;">
                    ${order.shippingAddress.fullName}<br>
                    ${order.shippingAddress.street}<br>
                    ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
                    ${order.shippingAddress.country}<br>
                    ${order.shippingAddress.phone}
                  </p>
                </div>

                <div style="text-align: center;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/account/orders" class="button">Track Your Order</a>
                </div>

                <p style="margin-top: 30px; color: #555;">
                  We'll send you another email when your order ships. If you have any questions, please don't hesitate to contact us.
                </p>

                <p style="color: #555;">
                  Thank you for choosing Black & Gold!<br>
                  <strong style="color: #C9A54D;">The Black & Gold Team</strong>
                </p>
              </div>

              <div class="footer">
                <p>© ${new Date().getFullYear()} Black & Gold Jewelry. All rights reserved.</p>
                <p>123 Jewelry Lane, New York, NY 10001</p>
                <p>This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to: ${order.shippingAddress.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return false;
  }
};

// Send new order notification to admin
export const sendNewOrderNotificationToAdmin = async (order, user, adminUser) => {
  try {
    const transporter = createTransporter();

    // Use admin email from database
    const adminEmail = adminUser?.email || 'admin@blackgold.com';

    const mailOptions = {
      from: `"Black & Gold System" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `🔔 New Order Received - ${order.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Georgia', serif; line-height: 1.6; color: #0A0A0A; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #C9A54D 0%, #B88D3A 100%); color: white; padding: 30px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; }
              .alert { background: #FEF3C7; border-left: 4px solid #C9A54D; padding: 15px; margin: 20px 0; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #E5E5E5; }
              .order-info { background: #F9F5EB; padding: 20px; margin: 20px 0; }
              .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .items-table th { background: #0A0A0A; color: #C9A54D; padding: 12px; text-align: left; }
              .items-table td { padding: 12px; border-bottom: 1px solid #E5E5E5; }
              .total { background: #0A0A0A; color: #C9A54D; padding: 15px; text-align: right; font-size: 18px; font-weight: bold; }
              .button { display: inline-block; background: linear-gradient(135deg, #C9A54D 0%, #B88D3A 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
              .footer { background: #0A0A0A; color: #888; padding: 20px; text-align: center; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🛍️ NEW ORDER RECEIVED</h1>
                <p style="margin: 10px 0 0 0;">Order #${order.orderNumber}</p>
              </div>
              
              <div class="content">
                <div class="alert">
                  <strong>⚡ Action Required:</strong> A new order has been placed and needs processing.
                </div>

                <div class="order-info">
                  <h3 style="margin-top: 0; color: #0A0A0A;">Customer Information</h3>
                  <p><strong>Name:</strong> ${order.shippingAddress.fullName}</p>
                  <p><strong>Email:</strong> ${order.shippingAddress.email}</p>
                  <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
                  <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <h3 style="color: #0A0A0A;">Order Items (${order.items.length} items)</h3>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${order.items.map(item => `
                      <tr>
                        <td>${item.title}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>$${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>

                <div class="total">Order Total: $${order.total.toFixed(2)}</div>

                <div style="margin: 30px 0;">
                  <h3 style="color: #0A0A0A;">Shipping Address</h3>
                  <p style="color: #555;">
                    ${order.shippingAddress.fullName}<br>
                    ${order.shippingAddress.street}<br>
                    ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
                    ${order.shippingAddress.country}
                  </p>
                </div>

                <div style="margin: 30px 0;">
                  <h3 style="color: #0A0A0A;">Payment Information</h3>
                  <p><strong>Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
                  <p><strong>Status:</strong> <span style="color: #C9A54D;">${order.paymentStatus.toUpperCase()}</span></p>
                </div>

                <div style="text-align: center;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/orders" class="button">View Order in Admin Panel</a>
                </div>
              </div>

              <div class="footer">
                <p>Black & Gold Admin System</p>
                <p>This is an automated notification from your eCommerce system.</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ New order notification sent to admin: ${adminEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending admin notification email:', error);
    return false;
  }
};

// Send order status update email to customer
export const sendOrderStatusUpdateEmail = async (order, user, newStatus) => {
  try {
    const transporter = createTransporter();

    const statusMessages = {
      'processing': 'Your order is being prepared for shipment',
      'shipped': 'Your order has been shipped and is on its way!',
      'delivered': 'Your order has been delivered. Enjoy your purchase!',
      'cancelled': 'Your order has been cancelled'
    };

    const mailOptions = {
      from: `"Black & Gold Jewelry" <${process.env.EMAIL_USER}>`,
      to: order.shippingAddress.email,
      subject: `Order Status Update - ${order.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Georgia', serif; line-height: 1.6; color: #0A0A0A; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0A0A0A 0%, #171717 100%); color: #C9A54D; padding: 30px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; }
              .status-badge { background: #C9A54D; color: white; padding: 10px 20px; display: inline-block; border-radius: 5px; font-weight: bold; margin: 20px 0; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #E5E5E5; }
              .footer { background: #0A0A0A; color: #888; padding: 20px; text-align: center; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>BLACK & GOLD</h1>
                <p style="margin: 10px 0 0 0; color: #fff;">Order Status Update</p>
              </div>
              
              <div class="content">
                <h2 style="color: #0A0A0A;">Dear ${order.shippingAddress.fullName},</h2>
                
                <div style="text-align: center;">
                  <div class="status-badge">${newStatus.toUpperCase()}</div>
                </div>

                <p style="font-size: 18px; color: #555;">
                  ${statusMessages[newStatus] || 'Your order status has been updated'}
                </p>

                <div style="background: #F9F5EB; padding: 20px; margin: 20px 0; border-left: 4px solid #C9A54D;">
                  <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                  <p><strong>Order Total:</strong> $${order.total.toFixed(2)}</p>
                </div>

                <p style="color: #555; margin-top: 30px;">
                  Thank you for shopping with Black & Gold!<br>
                  <strong style="color: #C9A54D;">The Black & Gold Team</strong>
                </p>
              </div>

              <div class="footer">
                <p>© ${new Date().getFullYear()} Black & Gold Jewelry. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order status update email sent to: ${order.shippingAddress.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending status update email:', error);
    return false;
  }
};
