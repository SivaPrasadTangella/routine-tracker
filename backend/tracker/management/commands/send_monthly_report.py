from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from tracker.models import Routine, DailyLog

User = get_user_model()

class Command(BaseCommand):
    help = 'Sends a monthly analysis report to all users'

    def handle(self, *args, **options):
        self.stdout.write("Starting monthly report generation...")
        
        users = User.objects.all()
        today = timezone.now().date()
        # Calculate last month's range
        first_day_this_month = today.replace(day=1)
        last_day_prev_month = first_day_this_month - timedelta(days=1)
        first_day_prev_month = last_day_prev_month.replace(day=1)
        
        month_name = first_day_prev_month.strftime('%B %Y')
        
        for user in users:
            routines = Routine.objects.filter(user=user)
            if not routines.exists():
                continue
                
            # Calculate stats
            total_routines = routines.count()
            total_completed = 0
            
            # Simple stats for the email
            routine_stats = []
            for routine in routines:
                # Count True status logs for this routine in the previous month
                logs_count = DailyLog.objects.filter(
                    routine=routine,
                    date__gte=first_day_prev_month,
                    date__lte=last_day_prev_month,
                    status=True
                ).count()
                
                total_completed += logs_count
                routine_stats.append(f"- {routine.name}: {logs_count} times")
            
            # Email Content
            subject = f'Your Monthly Routine Report - {month_name}'
            message = f"""
Hello {user.username},

Here is your routine summary for {month_name}:

Total Routines: {total_routines}
Total Completions: {total_completed}

Breakdown:
{chr(10).join(routine_stats)}

Keep up the great work!

Best,
The RoutineTracker Team
            """
            
            try:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email or f"{user.username}@example.com"], # Fallback for dev
                    fail_silently=False,
                )
                self.stdout.write(self.style.SUCCESS(f"Sent email to {user.username}"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to send to {user.username}: {e}"))
                
        self.stdout.write(self.style.SUCCESS("Monthly reports sent successfully!"))
