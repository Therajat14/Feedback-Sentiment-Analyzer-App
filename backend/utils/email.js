import SibApiV3Sdk from "sib-api-v3-sdk";

export const sendEmail = async (to, subject, text) => {
  try {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY; // Your Brevo API key

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = {
      sender: { name: "Rajat Singh 👑", email: "8a5982001@smtp-brevo.com" },
      to: [{ email: to }],
      subject: subject,
      htmlContent: `<p>${text}</p>`,
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("✅ Email sent successfully to", to);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};
