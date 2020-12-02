import Sendgrid from '@sendgrid/mail'

if (process.env.SENDGRID_API_KEY) {
  Sendgrid.setApiKey(process.env.SENDGRID_API_KEY)
}

export default class Mail {
  static async send(to: string, subject: string, text: string) {
    const payload = {
      to,
      from: 'team@dishapp.com',
      subject,
      text,
      //html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    try {
      await Sendgrid.send(payload)
    } catch (error) {
      console.error(error)
      if (error.response) {
        console.error(error.response.body)
      }
    }
  }
}
