const nodemailer = require('nodemailer');

let transporter = null;
let etherealAccount = null;

// Initialize mailer
async function initTransporter() {
  if (process.env.NODE_ENV === 'test') {
    transporter = {
      sendMail: async () => ({ messageId: 'test-simulated-id' })
    };
    return;
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    // Real SMTP (Gmail, SendGrid, etc.)
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    console.log('✓ Email service: Sử dụng máy chủ SMTP thực (' + process.env.SMTP_HOST + ')');
  } else {
    // Dev / Test mode with Ethereal test account fallback
    try {
      etherealAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: etherealAccount.smtp.host,
        port: etherealAccount.smtp.port,
        secure: etherealAccount.smtp.secure,
        auth: {
          user: etherealAccount.user,
          pass: etherealAccount.pass
        }
      });
      console.log('✓ Email service: Chế độ Test/Demo (Ethereal Mail)');
      console.log('  Tài khoản test:', etherealAccount.user);
    } catch (err) {
      // Fallback: console logger only
      console.warn('! Không thể tạo tài khoản Ethereal, hệ thống sẽ in trực tiếp thông tin email ra console.');
      transporter = {
        sendMail: async (opts) => {
          console.log('\n================ [EMAIL MÔ PHỎNG] ================');
          console.log('Người nhận:', opts.to);
          console.log('Tiêu đề:', opts.subject);
          console.log('Nội dung HTML tóm tắt:', opts.html.substring(0, 300) + '...');
          console.log('===================================================\n');
          return { messageId: 'simulated-' + Date.now() };
        }
      };
    }
  }
}

initTransporter().catch(console.error);

/**
 * Gửi email xác nhận đăng ký tài khoản
 */
async function sendVerificationEmail({ email, name, token, otp, clientBaseUrl }) {
  if (!transporter) await initTransporter();

  const verifyUrl = `${clientBaseUrl}/#verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 30px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">AURA FASHION</h1>
        <p style="color: #94a3b8; margin: 8px 0 0; font-size: 14px;">Thời Trang Phong Cách & Hiện Đại</p>
      </div>
      
      <div style="padding: 30px 24px; color: #334155;">
        <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Chào mừng ${name}!</h2>
        <p style="line-height: 1.6; font-size: 15px;">Cảm ơn bạn đã đăng ký tài khoản tại <strong>AURA FASHION</strong>. Để hoàn tất việc kích hoạt tài khoản, vui lòng xác nhận email của bạn.</p>
        
        <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
          <p style="margin: 0 0 10px; color: #64748b; font-size: 13px; text-transform: uppercase; font-weight: 600;">Mã xác nhận OTP (hiệu lực trong 24 giờ):</p>
          <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0284c7;">${otp}</div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background: #0284c7; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 15px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);">Xác Nhận Tài Khoản Ngay</a>
        </div>

        <p style="font-size: 13px; color: #64748b; line-height: 1.5;">Hoặc bạn có thể sao chép liên kết sau dán vào trình duyệt:<br>
          <a href="${verifyUrl}" style="color: #0284c7; word-break: break-all;">${verifyUrl}</a>
        </p>
      </div>

      <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0;">© 2026 AURA FASHION - Nhóm 4 (Phát triển phần mềm mã nguồn mở). Mọi quyền được bảo lưu.</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"AURA FASHION" <${process.env.SMTP_FROM || 'no-reply@aurafashion.vn'}>`,
      to: email,
      subject: `[AURA FASHION] Xác nhận kích hoạt tài khoản của bạn (${otp})`,
      html
    });

    let previewUrl = null;
    if (etherealAccount && nodemailer.getTestMessageUrl) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('✉ [Email Xác Nhận] Link xem trước Ethereal:', previewUrl);
    }

    return { success: true, messageId: info.messageId, previewUrl, otp, verifyUrl };
  } catch (error) {
    console.error('Lỗi khi gửi email xác nhận:', error);
    return { success: false, error: error.message, otp, verifyUrl };
  }
}

/**
 * Gửi email quên mật khẩu / tạo lại mật khẩu mới
 */
async function sendPasswordResetEmail({ email, name, token, otp, clientBaseUrl }) {
  if (!transporter) await initTransporter();

  const resetUrl = `${clientBaseUrl}/#reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 30px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">AURA FASHION</h1>
        <p style="color: #94a3b8; margin: 8px 0 0; font-size: 14px;">Yêu Cầu Đặt Lại Mật Khẩu</p>
      </div>
      
      <div style="padding: 30px 24px; color: #334155;">
        <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Xin chào ${name}!</h2>
        <p style="line-height: 1.6; font-size: 15px;">Hệ thống nhận được yêu cầu đặt lại mật khẩu cho tài khoản <strong>${email}</strong>. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
        
        <div style="background: #fef2f2; border: 2px dashed #fca5a5; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
          <p style="margin: 0 0 10px; color: #b91c1c; font-size: 13px; text-transform: uppercase; font-weight: 600;">Mã OTP khôi phục mật khẩu (hiệu lực trong 15 phút):</p>
          <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #dc2626;">${otp}</div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #dc2626; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 15px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);">Đặt Lại Mật Khẩu Ngay</a>
        </div>

        <p style="font-size: 13px; color: #64748b; line-height: 1.5;">Hoặc bạn có thể dán đường dẫn này vào trình duyệt:<br>
          <a href="${resetUrl}" style="color: #dc2626; word-break: break-all;">${resetUrl}</a>
        </p>
      </div>

      <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0;">© 2026 AURA FASHION - Nhóm 4 (Phát triển phần mềm mã nguồn mở). Mọi quyền được bảo lưu.</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"AURA FASHION" <${process.env.SMTP_FROM || 'no-reply@aurafashion.vn'}>`,
      to: email,
      subject: `[AURA FASHION] Yêu cầu đặt lại mật khẩu của bạn (${otp})`,
      html
    });

    let previewUrl = null;
    if (etherealAccount && nodemailer.getTestMessageUrl) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('✉ [Email Quên Mật Khẩu] Link xem trước Ethereal:', previewUrl);
    }

    return { success: true, messageId: info.messageId, previewUrl, otp, resetUrl };
  } catch (error) {
    console.error('Lỗi khi gửi email đặt lại mật khẩu:', error);
    return { success: false, error: error.message, otp, resetUrl };
  }
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};
