import Mail from './Mailer'

if (!process.env.TO) throw 'remember to set TO=email@address.com'

const to = process.env.TO

Mail.send(to, 'testing', 'mail body')
