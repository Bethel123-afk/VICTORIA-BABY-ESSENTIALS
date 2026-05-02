const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'Victoria Baby Essentials'} <${process.env.FROM_EMAIL || 'no-reply@victoriababy.com'}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(message);
};

// HTML Templates for Emails
const getOrderEmailTemplate = (order, type) => {
  const itemsHTML = order.orderItems.map(item => `
    <tr>
      <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;">
        <span style="display: block; font-weight: 700; font-size: 0.9rem; color: #1a1a1a;">${item.name.toUpperCase()}</span>
        <span style="font-size: 0.75rem; color: #888;">UNITS: ${item.qty}</span>
      </td>
      <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; text-align: right; font-weight: 700; color: #1a1a1a;">
        ₦${(item.price * item.qty).toLocaleString()}
      </td>
    </tr>
  `).join('');

  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background: #fafafa; padding: 40px;">
      <div style="background: white; padding: 50px; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); border: 1px solid #eee;">
        <div style="text-align: center; margin-bottom: 40px;">
            <span style="display: inline-block; padding: 5px 15px; border: 1px solid #eee; border-radius: 20px; font-size: 0.6rem; letter-spacing: 2px; color: #888; text-transform: uppercase;">Procurement Registry</span>
            <h1 style="color: #1a1a1a; font-size: 2rem; letter-spacing: 1px; margin-top: 15px;">VICTORIA <span style="font-weight: 300; opacity: 0.5;">BABY ESSENTIALS</span></h1>
        </div>
        
        <p style="font-size: 1.1rem; text-align: center; color: #1a1a1a;">${type === 'placed' ? 'Procurement Manifest Confirmed' : 'Manifest Status Updated'}</p>
        <p style="text-align: center; font-size: 0.85rem; color: #888; line-height: 1.6; margin-bottom: 40px;">Your request for high-fidelity neonatal essentials has been successfully integrated into our logistics protocol.</p>
        
        <div style="background: #fafafa; padding: 25px; border-radius: 8px; margin-bottom: 40px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-size: 0.7rem; color: #888; letter-spacing: 1px; text-transform: uppercase;">Manifest ID</span>
            <span style="font-size: 0.7rem; font-weight: 700; color: #1a1a1a;">#${order._id.toString().slice(-8).toUpperCase()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-size: 0.7rem; color: #888; letter-spacing: 1px; text-transform: uppercase;">Status</span>
            <span style="font-size: 0.7rem; font-weight: 700; color: #1a1a1a;">${order.status.toUpperCase()}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="font-size: 0.7rem; color: #888; letter-spacing: 1px; text-transform: uppercase;">Total Valuation</span>
            <span style="font-size: 0.7rem; font-weight: 700; color: #1a1a1a;">₦${order.totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
          <thead>
            <tr>
              <th style="padding: 10px 0; text-align: left; font-size: 0.65rem; color: #888; border-bottom: 1px solid #eee; text-transform: uppercase; letter-spacing: 1px;">Identified Units</th>
              <th style="padding: 10px 0; text-align: right; font-size: 0.65rem; color: #888; border-bottom: 1px solid #eee; text-transform: uppercase; letter-spacing: 1px;">Valuation</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 0.75rem; color: #888; font-style: italic;">Thank you for choosing Victoria Boutique for your neonatal requirements.</p>
            <p style="font-size: 0.6rem; color: #aaa; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px;">Victoria Baby Essentials &middot; Lagos Logistics Hub</p>
        </div>
      </div>
    </div>
  `;
};

const getPasswordResetTemplate = (resetUrl) => {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background: #fafafa; padding: 40px;">
      <div style="background: white; padding: 50px; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); border: 1px solid #eee;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #1a1a1a; font-size: 1.8rem; letter-spacing: 1px;">VICTORIA <span style="font-weight: 300; opacity: 0.5;">IDENTITY RESET</span></h1>
        </div>
        
        <p style="font-size: 1.1rem; text-align: center; color: #1a1a1a;">Authorization Token Required</p>
        <p style="text-align: center; font-size: 0.85rem; color: #888; line-height: 1.6; margin-bottom: 40px;">A request for a secure password reset has been initiated for your Victoria account.</p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${resetUrl}" style="background: #1a1a1a; color: white; padding: 18px 35px; text-decoration: none; border-radius: 4px; font-weight: 700; font-size: 0.8rem; letter-spacing: 2px;">AUTHORIZE RESET</a>
        </div>

        <p style="color: #aaa; font-size: 0.7rem; text-align: center; line-height: 1.6;">If you did not initiate this request, no further action is required. This link will expire in 10 minutes for security purposes.</p>
      </div>
    </div>
  `;
};

module.exports = { sendEmail, getOrderEmailTemplate, getPasswordResetTemplate };
