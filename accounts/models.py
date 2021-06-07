from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.models.fields.related import OneToOneField

# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self,username,password=None,active=True, is_staff=False,is_admin=False,):
        if not username:
            raise ValueError("User must have a username")
        if not password:
            raise ValueError("Users must have a password")
        user_obj = self.model(
            username = username
        )
        user_obj.set_password(password) #change user password
        user_obj.staff = is_staff
        user_obj.admin = is_admin
        user_obj.active = active
        user_obj.save(using=self._db)
        return user_obj

    def create_staffuser(self, username, password=None, ):
        user = self.create_user(
            username,
            password = password,
            is_staff = True
        )
        return user

    def create_superuser(self, username, password=None, ):
        user = self.create_user(
            username,
            password = password,
            is_staff=True,
            is_admin=True
        )
        return user


class User(AbstractBaseUser):
    username = models.CharField(unique = True, max_length=255)
    active = models.BooleanField(default=True)
    staff = models.BooleanField(default=False)
    admin = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)


    USERNAME_FIELD = 'username'
    #USERNAME_FIELD and password required by default
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.username

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self,app_label):
        return True

    @property
    def is_staff(self):
        return self.staff

    @property
    def is_admin(self):
        return self.admin

    @property
    def is_active(self):
        return self.active

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    #extend user
