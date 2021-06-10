from planner.apps.account.models import UserAccount
from django.shortcuts import redirect, render
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.contrib.auth import login
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_text
from .forms import RegistrationForm
from .token import account_activation_token


def account_register(request):
    if request.user.is_authenticated:
        return redirect('/')

    if request.method == "POST":
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.email = form.cleaned_data["email"]
            user.user_name = form.cleaned_data["user_name"]
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
            return redirect('/')
    else:
        form = RegistrationForm()

    return render(request, "account/registration/register.html", {"form": form})


def account_activate(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = UserAccount.objects.get(pk=uid)
    except():
        pass
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        login(request, user)

        return redirect('/')
    else:
        return render(request, 'account/registration/activation_invalid.html')