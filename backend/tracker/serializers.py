from rest_framework import serializers
from .models import Routine, DailyLog

class DailyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyLog
        fields = ['id', 'date', 'status']

class RoutineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Routine
        fields = ['id', 'name', 'color', 'description', 'priority', 'reminder_time', 'notify_email', 'notify_sms', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        user = self.context['request'].user
        routine = Routine.objects.create(user=user, **validated_data)
        return routine
