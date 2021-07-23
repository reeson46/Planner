from django.conf import settings
from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager,
                                        PermissionsMixin)
from django.core.mail import send_mail
from django.db import models
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, first_name, password, **other_fields):

        if not email:
            raise ValueError(_("You must provide an email address"))

        email = self.normalize_email(email)
        user = self.model(
            email=email, username=username, first_name=first_name, **other_fields
        )
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, username, first_name, password, **other_fields):
        other_fields.setdefault("is_superuser", True)
        other_fields.setdefault("is_staff", True)
        other_fields.setdefault("is_active", True)

        if other_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True"))

        if other_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True"))

        return self.create_user(email, username, first_name, password, **other_fields)


class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_("email address"), unique=True)
    username = models.CharField(_("user name"), max_length=150, unique=True)
    first_name = models.CharField(_("first name"), max_length=50, blank=True)
    last_name = models.CharField(_("last name"), max_length=50, blank=True)
    about = models.TextField(_("about"), max_length=400, blank=True)
    date_created = models.DateTimeField(_("date created"), auto_now_add=True)
    date_updated = models.DateTimeField(_("date updated"), auto_now=True)
    is_active = models.BooleanField(_("active"), default=False)
    is_staff = models.BooleanField(_("staff"), default=False)
    ip_address = models.GenericIPAddressField(null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "first_name"]

    class Meta:
        verbose_name = _("User account")
        verbose_name_plural = _("User accounts")

    def email_user(self, subject, message):
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [self.email],
            fail_silently=False,
        )

    def __str__(self):
        return self.username
