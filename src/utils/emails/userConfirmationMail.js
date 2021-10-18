import * as response from '../response';
import statusCodes from '../statusCodes';
import * as messages from '../customMessages';
import transport from './config';

const { userSignupSuccess } = messages
console.log(process.env.SENDGRID_API_KEY)
const {successResponse, errorResponse} = response;

function userRegistrationConfirmationEmailHtml(userName, url) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:Arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"><head> <meta charset="UTF-8"> <meta content="width=device-width, initial-scale=1" name="viewport"> <meta name="x-apple-disable-message-reformatting"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta content="telephone=no" name="format-detection"> <title>New email template 2021-02-21</title> <style type="text/css"> .card { background-color: #fafafa; border:0; border-radius: 4px; width:100%; padding:24px; } .card .company-name { text-transform: capitalize; font-weight: 700; padding-bottom: 8px; color: teal; } .card p .name { color: teal; } </style></head> <body style="width:100%;font-family:Arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;color:#3e5660"><div class="card"> <h3 class="company-name">Company Name</h3> <p>hi <span class="name">${userName}</span>,<br/> you've been successfully registered, welcome to Company name</p><p>Confirm below:</p><a href="${url}">${url}</a></div></body></html>`;
}

function getMessage(emailParams, url) {
  return {
    to: emailParams.email,
    from: 'markjoker73@gmail.com',
    subject: 'registration successfully, confirm',
    html: userRegistrationConfirmationEmailHtml(`${emailParams.firstName} ${emailParams.lastName}`, url),
  };
}

async function sendUserRegistrationConfirmationEmail(res, result, url, token) {
  transport.sendMail(getMessage(result, url), function(err, info) {
    if (err) {
      console.log(err)
    } else {
      return successResponse(res, statusCodes.created, userSignupSuccess, result, token)
    }
});
}

export default sendUserRegistrationConfirmationEmail;