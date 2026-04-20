import nodemailer from 'nodemailer';

export async function sendPurchaseEmail(userEmail: string, generatedCode: string, itemName: string = "Your Access Code") {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // A beautiful, professional HTML template for the digital receipt
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-w-md: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #1e293b; text-align: center;">Payment Successful! 🎉</h2>
        <p style="color: #475569; font-size: 16px;">Hi there,</p>
        <p style="color: #475569; font-size: 16px;">Thank you for your purchase. Here is your generated code. Please keep it safe!</p>
        
        <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
          <p style="margin: 0; color: #64748b; font-size: 14px; text-transform: uppercase; font-weight: bold;">${itemName}</p>
          <h1 style="color: #4f46e5; font-size: 36px; margin: 10px 0; letter-spacing: 2px;">${generatedCode}</h1>
        </div>

        <p style="color: #475569; font-size: 14px;">If you experience any issues, please email sleepstreamngn@zohomail.com to contact support.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Sleepstream. All rights reserved.</p>
      </div>
    `;

    await transporter.sendMail({
      from: '"Sleepstream" <support@sleepstream.com.ng>', // Your verified domain!
      to: userEmail,
      subject: 'Your Sleepstream Code is Here! 🚀',
      html: htmlTemplate,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send purchase email:", error);
    return { success: false, error };
  }
}