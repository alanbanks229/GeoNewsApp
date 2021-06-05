from django.http import HttpResponse
#User Authentication imports
from django.contrib import auth
from django.contrib.auth.models import User


# this will render our custom templates inside "../html_templates"
from django.shortcuts import render, redirect

def signup(request):
    if request.method == 'POST':
        #User has given info on signup page and wants to make account
        if request.POST['password'] == request.POST['confpassword']:
            try:
                user = User.objects.get(username = request.POST['username'])
                return render(request, 'accounts/signup.html', {'error': 'Username has already been taken.'})
            except User.DoesNotExist:
                user = User.objects.create_user(request.POST['username'],password = request.POST['password'])
                auth.login(request,user)
                return redirect('homepage')
        else:
            return render(request, 'accounts/signup.html', {'error':'Passwords must match' })
    else:
        #User Wants to proceed to signup page
        return render(request, 'accounts/signup.html')

def login(request):
    return render(request, 'accounts/login.html')

#Still needs logout functionality
def logout(request):
    return render(request, 'homepage.html')
