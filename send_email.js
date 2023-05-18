const nodemailer = require("nodemailer");
const ejs = require("ejs");

async function postSendMail(req, res) {
  try {
    const { email, subject, message, greeting, type } = req.body;
    if (email && subject && message) {
      //   const testAccount = await nodemailer.createTestAccount();
      let template;
      if (type === "register") {
        console.log("in register template");
        template = await ejs.renderFile(__dirname + "/views/register.ejs", {
          subject,
          email,
          message,
          greeting,
        });
      }
      if (type === "pay") {
        template = await ejs.renderFile(__dirname + "/views/pay.ejs", {
          subject,
          email,
          message,
          greeting,
        });
      }

      let transporter = nodemailer.createTransport({//Recibe los datos de la persona que va a enviar el email
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "mauriciogastonluquez@gmail.com", // generated user
          pass: "pniguzjtqwicrtya", // generated password
        },
      });

      let mailOptions = {//Datos de donde viene
        from: "test.app@test.com",
        to: email, //vendria del front
        subject,
        text: message,
        html: template,// "<div><h1>Hola mundo</h1></div>" //aca es el template
      };
      transporter.verify(function (error, success) {
        if (error) console.log(error);
        console.log("Server is ready", success);
      });
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) res.status(404).json({ message: error });
        else {
          // console.log("---transporter: ---> ", transporter)
          // console.log("---sendMail info: ---> ", info)
          // // console.log(nodemailer.getTestMessageUrl(info))
          res.status(200).json({ message: "Email enviado con éxito" });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

module.exports = {
  postSendMail,
};
