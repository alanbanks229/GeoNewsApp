from django.contrib import admin
from django.contrib.auth import get_user_model
from .forms import UserAdminChangeForm,UserAdminCreationForm
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Marker

#from .models import 
User = get_user_model()

# Remove Group Model from admin. We're not using it.
admin.site.unregister(Group)

class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserAdminChangeForm
    add_form = UserAdminCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ['username', 'admin', 'display_markers']
    list_filter = ['admin','staff','active']
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Markers', {'fields': ('markers',)}),
        ('Permissions', {'fields': ('admin','staff', 'active')}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2')}
        ),
    )
    search_fields = ['username']
    ordering = ['username']
    filter_horizontal = ()

#@admin.register(Marker)
class MarkerAdmin(admin.ModelAdmin):
    list_display = ['address', 'coordinates']
    fieldsets= (
        (None, {'fields': ('address', 'coordinates')}),

    )

    search_fields = ['address']
    ordering = ['address']
    filter_horizontal = ()




admin.site.register(User,UserAdmin)
admin.site.register(Marker,MarkerAdmin)
# Register your models here.


