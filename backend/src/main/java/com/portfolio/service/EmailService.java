package com.portfolio.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public void sendInviteEmail(String toEmail, String token) {
        String setupLink = frontendUrl + "/setup-account?token=" + token;

        System.out.println("==================================================================");
        System.out.println(">>> CUSTOMER INVITE LINK GENERATED <<<");
        System.out.println("Recipient Email : " + toEmail);
        System.out.println("Account Setup Link: " + setupLink);
        System.out.println("==================================================================");

        if (mailSender != null) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setTo(toEmail);
                helper.setSubject("You are invited to build your Portfolio on Portfolio Generator");

                String htmlBody = "<html><body style='font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 20px;'>"
                        + "<div style='max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e0e0e0;'>"
                        + "<h2 style='color: #4f46e5; margin-top: 0;'>Welcome to Portfolio Generator!</h2>"
                        + "<p>You have been invited by the administrator to build your personal portfolio website.</p>"
                        + "<p>Click the button below to set up your name, password, and activate your account:</p>"
                        + "<div style='text-align: center; margin: 30px 0;'>"
                        + "<a href='" + setupLink + "' style='background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;'>Set Up Account</a>"
                        + "</div>"
                        + "<p style='color: #6b7280; font-size: 0.9em;'>This link is valid for 48 hours. If the button doesn't work, copy and paste this URL into your browser:</p>"
                        + "<p style='color: #4f46e5; word-break: break-all; font-size: 0.9em;'>" + setupLink + "</p>"
                        + "</div>"
                        + "</body></html>";

                helper.setText(htmlBody, true);
                mailSender.send(message);
                System.out.println(">>> EMAIL SENT SUCCESSFULLY TO " + toEmail + " <<<");
            } catch (Exception e) {
                System.err.println("Failed to send SMTP email: " + e.getMessage() + " (Use console setup link above for testing)");
            }
        }
    }
}
