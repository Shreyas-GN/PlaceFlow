import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import BackgroundTasks
import os

class EmailService:
    @staticmethod
    def send_email(to_email: str, subject: str, body: str):
        # In a real app, you'd use os.getenv("SMTP_SERVER"), etc.
        # For now, we simulate sending by printing to console.
        print(f"📧 [EMAIL SENT] To: {to_email} | Subject: {subject} | Body: {body}")
        
        # MOCKED SMTP LOGIC (to show how it would look)
        """
        try:
            smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
            smtp_port = int(os.getenv("SMTP_PORT", "587"))
            sender_email = os.getenv("SENDER_EMAIL")
            sender_password = os.getenv("SENDER_PASSWORD")

            if not sender_email or not sender_password:
                return

            msg = MIMEMultipart()
            msg['From'] = f"PlaceFlow <{sender_email}>"
            msg['To'] = to_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))

            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
            server.quit()
        except Exception as e:
            print(f"❌ Failed to send email: {e}")
        """

    @staticmethod
    def send_status_update_email(background_tasks: BackgroundTasks, to_email: str, company_name: str, new_status: str):
        subject = f"Application Status Update: {company_name}"
        body = f"Hello,\n\nYour application status for {company_name} has been updated to: {new_status}.\n\nPlease check your dashboard for more details.\n\nBest regards,\nPlaceFlow Team"
        
        background_tasks.add_task(EmailService.send_email, to_email, subject, body)

    @staticmethod
    def send_application_confirmed_email(background_tasks: BackgroundTasks, to_email: str, company_name: str):
        subject = f"Application Confirmed: {company_name}"
        body = f"Hello,\n\nYou have successfully applied to {company_name}.\n\nGood luck with your application!\n\nBest regards,\nPlaceFlow Team"
        
        background_tasks.add_task(EmailService.send_email, to_email, subject, body)
