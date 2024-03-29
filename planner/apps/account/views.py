from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.sites.shortcuts import get_current_site
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode

from planner.apps.account.models import UserAccount

from .account import Account
from .forms import UserLoginForm, UserProfileForm, UserRegistrationForm
from .token import account_activation_token


def account_register(request):
    if request.user.is_authenticated:
        return redirect("/")

    if request.method == "POST":
        form = UserRegistrationForm(request.POST)
        if form.is_valid():

            account = Account(request)
            user = account.getUser()
            user.ip_address = None
            user.email = form.cleaned_data["email"]
            user.username = form.cleaned_data["username"]
            user.set_password(form.cleaned_data["password"])
            user.is_active = False
            user.save()

            # Setup email
            current_site = get_current_site(request)
            subject = "Acctivate you Account"
            message = render_to_string(
                "account/registration/account_activation_email.html",
                {
                    "user": user,
                    "domain": current_site.domain,
                    "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                    "token": account_activation_token.make_token(user),
                },
            )
            user.email_user(subject=subject, message=message)
            return render(request, "account/registration/registration_successful.html")
    else:
        form = UserRegistrationForm()

    return render(request, "account/registration/register.html", {"form": form})


def account_activate(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = UserAccount.objects.get(pk=uid)
    except ():
        pass
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        login(request, user)

        return render(request, "account/registration/activation_successful.html")
    else:
        return render(request, "account/registration/activation_invalid.html")


def account_login(request):
    if request.method == "POST":
        form = UserLoginForm(request.POST)

        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        if user is not None:
            request.session.clear()
            login(request, user)
            return redirect("/")
        else:
            HttpResponse("Error")
    else:
        form = UserLoginForm()

    return render(request, "account/login.html", {"form": form})


@login_required
def update_account(request):

    user = request.user

    if request.method == "POST":
        form = UserProfileForm(data=request.POST, user=user, instance=user)
        if form.is_valid():
            form.save()
            messages.success(request, "You account was successfully updated.")
            return redirect("account:update_account")
        else:
            print(form.errors)

    else:
        form = UserProfileForm(instance=user)

    return render(request, "account/account.html", {"form": form})
