import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import catchAsync from './catchAsync.js';
import AppError from './appError.js';

export const sendEmail = catchAsync(async (req, res, next) => {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
        },
    });

    let MailGenerator = new Mailgen({
        theme: 'salted',
        product: {
            name: 'Event Hub',
            link: 'https://mailgen.js',
        },
    });

    let response = {
        body: {
            name: 'Shahzeb',
            intro: 'Your bill has arrived',
            table: {
                data: [
                    {
                        item: 'Nodemailer',
                        description: 'Your purchase has been successful',
                        price: '$10.99',
                    },
                ],
            },
            outro: 'Looking forward to do more business',
        },
    };

    let mail = MailGenerator.generate(response);

    let message = {
        from: process.env.EMAIL,
        to: 'khizr772@gmail.com',
        subject: 'Order placement',
        html: mail,
    };

    transport
        .sendMail(message)
        .then(() => {
            return res.status(201).json({
                msg: 'you should receive an email heh',
            });
        })
        .catch((error) => {
            console.log(error);
            return next(new AppError('Mail could not be sent'));
        });
});
