import nodemailer from 'nodemailer'




export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{

        user: "Kalboonyanmarsoos@gmail.com",
        pass: "kmsawlnlqaeymazn" //actual password is tuwaiq123 this pass is used for node
    }


})

//const options = {

    //from: "Kalboonyanmarsoos@gmail.com",
    //to: "ralmaiman@gmail.com",
    //subject: "nodemailer test",
   // text: "Your Session has been"

//}

//transporter.sendMail(options)