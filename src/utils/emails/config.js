import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
       user: '3cbbbf286bca24',
       pass: '3194ec1c524556'
    }
  });

export default transport