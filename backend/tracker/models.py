from django.db import models
from django.conf import settings

class Routine(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='routines')
    name = models.CharField(max_length=255)
    color = models.CharField(max_length=50, default='bg-indigo-500')
    description = models.TextField(blank=True, null=True)
    priority = models.IntegerField(default=3) # 1=Low, 5=High
    reminder_time = models.TimeField(blank=True, null=True)
    notify_email = models.BooleanField(default=False)
    notify_sms = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class DailyLog(models.Model):
    routine = models.ForeignKey(Routine, on_delete=models.CASCADE, related_name='logs')
    date = models.DateField()
    status = models.BooleanField(default=False)

    class Meta:
        unique_together = ('routine', 'date')

    def __str__(self):
        return f"{self.routine.name} - {self.date} - {self.status}"
