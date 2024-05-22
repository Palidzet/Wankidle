from django.contrib import admin

from .models import Database

class DatabaseAdmin(admin.ModelAdmin):
    ordering = ['index']

admin.site.register(Database,DatabaseAdmin)