from django.urls import reverse
from django.conf import settings

def generate_verification_url(user):
    token = user.custom_uid

    # Get the user’s primary key (uid)
    username = user.username

    # Create the URL using Django's `reverse` function
    verification_url = reverse('verify_email', kwargs={'username': username, 'token': token})

    # Combine it with your base domain/URL (this could be a frontend URL)
    full_url = f"http://localhost:8000{verification_url}"
    
    return full_url
    