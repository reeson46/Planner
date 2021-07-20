import random
import string

from .models import UserAccount


def randomString(stringLength):
    letters = string.ascii_letters
    return "".join(random.choice(letters) for i in range(stringLength))


def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[-1].strip()
    elif request.META.get("HTTP_X_REAL_IP"):
        ip = request.META.get("HTTP_X_REAL_IP")
    else:
        ip = request.META.get("REMOTE_ADDR")
    return ip


class Account:
    def __init__(self, request):
        self.request = request

    def getUser(self):

        if not self.request.user.is_authenticated:
            ip = get_client_ip(self.request)

            if UserAccount.objects.filter(ip_address=ip).exists():
                return UserAccount.objects.get(ip_address=ip)

            random_username = f"{randomString(10)}_guest"
            random_email = f"{randomString(5)}_guest@example.com"

            guest_user = UserAccount.objects.create(
                username=random_username,
                email=random_email,
                ip_address=ip,
                is_active=False,
            )

            return guest_user
        else:
            return self.request.user
