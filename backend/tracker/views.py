from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Routine, DailyLog
from .serializers import RoutineSerializer, DailyLogSerializer
from django.shortcuts import get_object_or_404

class RoutineViewSet(viewsets.ModelViewSet):
    serializer_class = RoutineSerializer

    def get_queryset(self):
        return Routine.objects.filter(user=self.request.user)

    @action(detail=False, methods=['delete'])
    def delete_all(self, request):
        count, _ = self.get_queryset().delete()
        return Response({"message": f"{count} routines deleted"}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'])
    def reset_history(self, request):
        # Delete all logs for routines owned by the current user
        routines = self.get_queryset()
        count, _ = DailyLog.objects.filter(routine__in=routines).delete()
        return Response({"message": f"History reset. {count} logs deleted."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def log(self, request, pk=None):
        routine = self.get_object()
        date = request.data.get('date')
        if not date:
             return Response({"error": "Date is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Toggle functionality
        log, created = DailyLog.objects.get_or_create(routine=routine, date=date)
        if not created:
            log.status = not log.status
            log.save()
        else:
            log.status = True
            log.save()
            
        return Response(DailyLogSerializer(log).data)

    @action(detail=False, methods=['get'])
    def logs(self, request):
        # Return all logs for the current user's routines, optionally filtered by date
        routines = self.get_queryset()
        logs = DailyLog.objects.filter(routine__in=routines)
        
        date_param = request.query_params.get('date')
        if date_param:
            logs = logs.filter(date=date_param)
            
        # Structure: { date: { routineId: status } }
        data = {}
        for log in logs:
            date_str = str(log.date)
            if date_str not in data:
                data[date_str] = {}
            data[date_str][log.routine.id] = log.status
        return Response(data)
