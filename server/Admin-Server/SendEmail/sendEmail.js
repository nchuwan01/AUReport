const nodemailer = require('nodemailer');
const axios = require('axios'); // For fetching the image from the URL
const path = require('path'); // To get file extension


async function sendEmail(emailTo, subject, message, imageURl) {
    //this is imageURL=https://firebasestorage.googleapis.com/v0/b/au-report-bbe7d.appspot.com/o/images%2F1711981792944?alt=media&token=29f2c30a-5398-4417-b7c8-15accfdba812
    // Create a transporter
    console.log("recieved in email");
    let transporter = nodemailer.createTransport({
        service: 'gmail', // Gmail service
        auth: {
            user: 'au.reportaproblem@gmail.com', // Your Gmail email address
            pass: 'uoem vrmr uyif huap' // Your Gmail App Password
        },
        tls: {
            rejectUnauthorized: false // Bypass the self-signed certificate error
        }
    });
     let imageResponse = await axios.get(imageURl, {
        responseType: 'arraybuffer' // Ensure binary data
    });

    // Determine file extension
    let fileExtension = 'jpg'; // Default to jpg
    //console.log("This is file extension ");
    console.log(fileExtension);

    // Email options
    let mailOptions = {
        from: 'au.reportaproblem@gmail.com', // Sender email address
        to: emailTo, // Recipient email address
        subject: subject, // Subject line
        text: message,
        attachments: [{
            filename: `image.${fileExtension}`,
            content: imageResponse.data,
            encoding: 'base64'
        }]
    };

    try {
        // Send email
        
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.log('Error occurred:', error);
        return { success: false, message: 'Failed to send email' };
    }
}

// Export the sendEmail function
module.exports = sendEmail;