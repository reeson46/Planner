from django import forms
from django.contrib.auth.forms import (AuthenticationForm, PasswordResetForm,
                                       SetPasswordForm)

from .models import UserAccount


class UserProfileForm(forms.ModelForm):
    username = forms.CharField(
        label="Username", min_length=4, max_length=50, help_text="Required"
    )
    email = forms.EmailField(
        label="Email",
        max_length=100,
        help_text="Required",
        error_messages={"required": "Sorry, you will need an email"},
    )
    password = forms.CharField(label="Password", widget=forms.PasswordInput)

    class Meta:
        model = UserAccount
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "about",
        ]

    def __init__(self, user=None, *args, **kwargs):
        super(UserProfileForm, self).__init__(*args, **kwargs)
        self.user = user

        self.fields["username"].widget.attrs.update(
            {
                "class": "card bg-dark text-light form-control mb-3",
                "id": "profile-username",
            }
        )
        self.fields["email"].widget.attrs.update(
            {
                "class": "card bg-dark text-light form-control mb-3",
                "id": "profile-email",
            }
        )

        self.fields["first_name"].widget.attrs.update(
            {
                "class": "card bg-dark text-light form-control mb-3",
                "id": "profile-first_name",
            }
        )
        self.fields["last_name"].widget.attrs.update(
            {
                "class": "card bg-dark text-light form-control mb-3",
                "id": "profile-last_name",
            }
        )
        self.fields["about"].widget.attrs.update(
            {
                "class": "card bg-dark text-light form-control mb-3",
                "id": "profile-about",
            }
        )
        self.fields["password"].widget.attrs.update(
            {
                "class": "card bg-dark text-light form-control mb-3",
                "placeholder": "To save your changes, enter your password",
                "id": "profile-password",
            }
        )

    def clean_password(self):
        valid = self.user.check_password(self.cleaned_data["password"])
        if not valid:
            raise forms.ValidationError("Incorrect password")


class UserLoginForm(AuthenticationForm):
    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "class": "card bg-dark text-light form-control mb-3",
                "placeholder": "Email address",
                "id": "login-username",
            }
        )
    )
    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "class": "card bg-dark text-light form-control mb-3",
                "placeholder": "Password",
                "id": "login-password",
            }
        )
    )


class UserRegistrationForm(forms.ModelForm):
    username = forms.CharField(
        label="Username", min_length=4, max_length=50, help_text="Required"
    )
    email = forms.EmailField(
        label="Email",
        max_length=100,
        help_text="Required",
        error_messages={"required": "Sorry, you will need an email"},
    )
    password = forms.CharField(label="Password", widget=forms.PasswordInput)
    password2 = forms.CharField(label="Repeat password", widget=forms.PasswordInput)

    class Meta:
        model = UserAccount
        fields = ["username", "email"]

    def clean_username(self):
        username = self.cleaned_data["username"].lower()
        r = UserAccount.objects.filter(username=username)
        if r.count():
            raise forms.ValidationError("Username already exists")
        return username

    def clean_password2(self):
        cd = self.cleaned_data
        if cd["password"] != cd["password2"]:
            raise forms.ValidationError("Passwords do not match")
        return cd["password2"]

    def clean_email(self):
        email = self.cleaned_data["email"]
        if UserAccount.objects.filter(email=email).exists():
            raise forms.ValidationError("This email is already taken")
        return email

    def __init__(self, *args, **kwargs):
        super(UserRegistrationForm, self).__init__(*args, **kwargs)

        self.fields["username"].widget.attrs.update(
            {
                "class": "card bg-dark text-light form-control mb-3",
                "placeholder": "Enter username",
            }
        )
        self.fields["email"].widget.attrs.update(
            {
                "class": "card bg-dark text-light form-control mb-3",
                "placeholder": "Enter email",
            }
        )
        self.fields["password"].widget.attrs.update(
            {
                "class": "card bg-dark text-light form-control mb-3",
                "placeholder": "Enter password",
            }
        )
        self.fields["password2"].widget.attrs.update(
            {
                "class": "card bg-dark text-light form-control mb-3",
                "placeholder": "Repeat password",
            }
        )


class PwdResetForm(PasswordResetForm):
    email = forms.EmailField(
        max_length=254,
        widget=forms.TextInput(
            attrs={
                "class": "card bg-dark text-light form-control mb-3",
                "placeholder": "Enter your email",
                "id": "pwdreset-email",
            }
        ),
    )

    def clean_email(self):
        email = self.cleaned_data["email"]
        u = UserAccount.objects.filter(email=email)
        if not u:
            raise forms.ValidationError("Email address does not exist.")
        return email


class PwdResetConfirmForm(SetPasswordForm):
    new_password1 = forms.CharField(
        label="New password",
        widget=forms.PasswordInput(
            attrs={
                "class": "card bg-dark text-light form-control mb-3",
                "placeholder": "New Password",
                "id": "form-newpass",
            }
        ),
    )
    new_password2 = forms.CharField(
        label="Repeat password",
        widget=forms.PasswordInput(
            attrs={
                "class": "card bg-dark text-light form-control mb-3",
                "placeholder": "Repeat Password",
                "id": "form-new-pass2",
            }
        ),
    )
