
import time
import os
import django
from datetime import datetime, timedelta

# 1. Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.core.management import call_command

print("===================================================")
print("   RoutineTracker Notification Service Started     ")
print("   Running... (Press Ctrl+C to stop)               ")
print("===================================================")

while True:
    # 2. Run the reminder check
    try:
        # We manually print the timestamp so you know it's alive
        now = datetime.now().strftime('%H:%M:%S')
        # call_command('send_reminders') # Uncomment this if you want noisy output
        
        # We run it and capture output to avoid cluttering unless there is a match
        from io import StringIO
        out = StringIO()
        call_command('send_reminders', stdout=out)
        
        output = out.getvalue().strip()
        if "No reminders scheduled" not in output:
             print(f"[{now}] {output}") # Print only if something happened
        else:
             print(f"[{now}] Checked. Nothing due.", end='\r')

    except Exception as e:
        print(f"\nError: {e}")

    # 3. Calculate time until next minute
    now = datetime.now()
    next_minute = (now + timedelta(minutes=1)).replace(second=0, microsecond=0)
    sleep_seconds = (next_minute - now).total_seconds()
    
    # Sleep tight
    time.sleep(sleep_seconds)
