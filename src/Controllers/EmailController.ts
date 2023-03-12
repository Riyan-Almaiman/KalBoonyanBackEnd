import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{

        user: "Kalboonyanmarsoos@gmail.com",
        pass: "kmsawlnlqaeymazn" //actual password is tuwaiq123 this pass is used for node
    }


})


const options = {

    from: "Kalboonyanmarsoos@gmail.com",
    to: "Kalboonyanmarsoos@gmail.com",
    subject: "nodemailer test",
    text: "nodemailer test"
}

transporter.sendMail(options)