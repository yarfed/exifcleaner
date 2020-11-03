const SMTPServer = require('smtp-server').SMTPServer;
const simpleParser = require('mailparser').simpleParser;
const fs = require('fs');
const sendmail = require('sendmail')();

const server = new SMTPServer({
    onData: (stream, session, callback) => {
        simpleParser(stream, {}, (err, parsed) => {
            if (parsed.attachments.length > 0) {
                var attachment = parsed.attachments[0];
                fs.writeFileSync(attachment.filename, attachment.content);
// put here commands
                sendmail({
                    from: 'no-reply@jarda.ru',
                    to: session.envelope.mailFrom.address,
                    subject: 'test sendmail',
                    html: 'Mail of test sendmail ',
                    attachments: [
                       
                        {   // filename and content type is derived from path
                            path: attachment.filename
                        }

                    ]
                }, function (err, reply) {
                    console.log(err && err.stack);
                    console.dir(reply);
                });

            }
        });
    },
    authOptional: true

});
server.listen(25);