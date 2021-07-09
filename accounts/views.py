from django.contrib.auth import authenticate, login
from django.views.generic import CreateView, FormView
from .forms import LoginForm, RegisterForm
from django.shortcuts import redirect
from django import forms

class LoginView(FormView):
    form_class = LoginForm
    template_name = 'accounts/login.html'
    success_url = '/'

    def form_valid(self, form):
        request = self.request
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password')
        user = authenticate(request,username = username, password = password)
        try:
            if user is not None:
                login(request, user)
                return redirect("/")
            raise forms.ValidationError("Invalid Login")
        except forms.ValidationError:
            return super(LoginView, self).form_invalid(form)
            
class RegisterView(CreateView):
    form_class = RegisterForm
    template_name = 'accounts/signup.html'
    success_url = 'login'