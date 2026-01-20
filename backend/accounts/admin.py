from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'mobile', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'mobile')

admin.site.register(User, CustomUserAdmin)
