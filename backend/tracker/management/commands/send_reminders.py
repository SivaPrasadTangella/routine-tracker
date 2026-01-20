from django.core.management.base import BaseCommand
from tracker.models import Routine
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
import requests
import datetime

class Command(BaseCommand):
    help = 'Send real reminders for routines via Email and Telegram'

    def handle(self, *args, **options):
        # Use local system time to match user's perspective/input
        now = datetime.datetime.now().time()
        routines = Routine.objects.filter(reminder_time__isnull=False)
        
        self.stdout.write(self.style.SUCCESS(f"Processing reminders at {now.strftime('%H:%M:%S')}..."))
        
        count = 0
        for routine in routines:
            # Check if expectation matches reality (Simple minute matching)
            # We convert to minutes to allow a small window if needed
            r_time = routine.reminder_time
            
            # Match only if hour and minute are exact (Strict Mode)
            if r_time.hour == now.hour and r_time.minute == now.minute:
                if routine.notify_email or routine.notify_sms:
                    msg = f"Reminder: It's time for '{routine.name}'!"
                    
                    # Send Email
                    if routine.notify_email and routine.user.email:
                        try:
                            send_mail(
                                'Routine Reminder',
                                msg,
                                settings.DEFAULT_FROM_EMAIL,
                                [routine.user.email],
                                fail_silently=False,
                            )
                            self.stdout.write(self.style.SUCCESS(f"[EMAIL] Sent to {routine.user.email}"))
                        except Exception as e:
                            self.stdout.write(self.style.ERROR(f"[EMAIL] Failed: {e}"))

                    # Send Telegram
                    if routine.notify_sms:
                        bot_token = settings.TELEGRAM_BOT_TOKEN
                        chat_id = settings.TELEGRAM_CHAT_ID
                        
                        if bot_token and chat_id:
                            try:
                                url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
                                payload = {'chat_id': chat_id, 'text': msg}
                                requests.post(url, json=payload)
                                self.stdout.write(self.style.SUCCESS(f"[TELEGRAM] Sent to chat {chat_id}"))
                            except Exception as e:
                                self.stdout.write(self.style.ERROR(f"[TELEGRAM] Failed: {e}"))
                        else:
                             self.stdout.write(self.style.WARNING(f"[TELEGRAM] Skipped: Missing Token or Chat ID"))

                    count += 1

        if count == 0:
            self.stdout.write(self.style.WARNING("No reminders scheduled for this exact minute."))
