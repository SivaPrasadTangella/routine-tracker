from django.contrib import admin
from django.http import HttpResponse
from .models import Routine, DailyLog
import csv
from datetime import datetime

def export_to_csv(modeladmin, request, queryset):
    meta = modeladmin.model._meta
    field_names = [field.name for field in meta.fields]

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename={meta.verbose_name}_{datetime.now().strftime("%Y%m%d")}.csv'
    
    writer = csv.writer(response)
    writer.writerow(field_names)
    
    for obj in queryset:
        row = writer.writerow([getattr(obj, field) for field in field_names])

    return response

export_to_csv.short_description = 'Export Selected to CSV'

@admin.register(Routine)
class RoutineAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'created_at')
    list_filter = ('user', 'created_at')
    search_fields = ('name', 'user__username')
    actions = [export_to_csv]

@admin.register(DailyLog)
class DailyLogAdmin(admin.ModelAdmin):
    list_display = ('routine', 'get_user', 'date', 'status')
    list_filter = ('date', 'routine__user', 'status')
    actions = [export_to_csv]

    def get_user(self, obj):
        return obj.routine.user
    get_user.short_description = 'User'
    get_user.admin_order_field = 'routine__user'
