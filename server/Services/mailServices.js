const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  ervice: "gmail",
  auth: {
    user: "fypimsac@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
  port: 465,
  host: "smtp.gmail.com",
});

function sendEmail(email, otp) {
    
    const mailOptions = {
        from: "no-reply-IMSAC@gmail.com",
        to: email,
        subject: "One-Time Password (OTP) Verification",
        text: `Your OTP is: ${otp}`,
        html: `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f2f2f2;
                            padding: 20px;
                        }
                        h1 {
                            color: #333;
                            text-align: center;
                        }
                        .otp-container {
                            background-color: #fff;
                            border-radius: 5px;
                            padding: 20px;
                            margin: 0 auto;
                            max-width: 400px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        }
                        .otp {
                            font-size: 24px;
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .expiration {
                            font-size: 14px;
                            text-align: center;
                            margin-top: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="otp-container">
                        <h1>One-Time Password (OTP) Verification</h1>
                        <p class="otp">Your OTP is: ${otp}</p>
                        <p class="expiration">Please note that the OTP will expire after 5 minutes.</p>
                    </div>
                </body>
            </html>
        `,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                reject(error);
            } else {
                console.log("OTP sent successfully:", info.response);
                resolve(info);
            }
        });
    });
}

module.exports = sendEmail;