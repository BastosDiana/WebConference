/** to allow the email to be sent **/
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

function sendMail() {
  const name = req.sanitize('name').escape();
  const email = req.sanitize('email').escape();
  const subject = req.sanitize('subject').escape();
  req.checkBody("email", "insert text only", 'pt-PT').matches(/^[a-z ]+$/i);
  const errors = req.validationErrors();
  if(errors) {
    res.send(errors);
    return;
  }

  /** email body **/
  if(typeof(email) != "undefined" && typeof(subject) != "undefined" && typeof(name) != 'undefined') {
    let bodyContent = "";
    bodyContent +='Dear ' + req.body.name + ',<br>' + '<br';
    bodyContent +='Thank you for your contact ' + '<br' + 'Thank you!' + '<br>' + '<br';
    bodyContent +='Message sent: <bloquecote><i>';
    bodyContent +=req.body.subject + '<br>' + '<br' + 'message sent by: ' + req.body.name;
    bodyContent +=' with email <a href="mailto:' + req.body.email + '" target="_top">' + req.body.email + '</a>';
    bodyContent +='</i></bloquecote>';

    //to include images
    bodyContent +='<img src="https://fcawebbook.herokuapp.com/assets/images/mail.png" alt="mail.icon" height="42" width="42">';
    console.log('bodyContent: ', bodyContent);

    /** email server - transport **/
    const transporter = nodemailer.createTransport(smtpTransport({
      service: 'Gmail',
      auth: {
        user: 'mailserverpw',
        pass: "password"
      }
    }));

    /** verify if the server is active and if doesn't exist errors **/
    transporter.verify(function(error, success) {
      if(error) {
        console.log('error: ', error);
        res.status(jsonMessages.mail.serverError.status).send(jsonMessages.mail.serverError);
      } else {
        console.log('Server is ready to take our messages');
      }
    });

    /** set up sender, receiver, subject and content **/
    const mailOptions = {
      from: req.body.email,
      to: 'mailserverpw@gmail.com',
      cc: req.body.email,
      subject: 'FAC Book - site contact',
      html: bodycontent
    }

    transporter.sendMail(mailOptions, function(error, info) {
      if(error) {
        console.log('error: ', error);
        res.status(jsonMessages.mail.mailError.status).send(jsonMessages.mail.mailError);
      } else {
        console.log('Email sent: ' + info.response);
        res.status(jsonMessages.mail.mailSent.status).send(jsonMessages.mail.mailSent);
      }
    });
  } else {
    //if the required fields are missing a message will be sent to the customer
    res.status(jsonMessages.mail.requiredData.status).send(jsonMessages.mail.requiredData);
  }
}

module.exports = {
 send: sendMail
};
