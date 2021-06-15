from django.contrib.auth import authenticate, login
from django.views.generic import CreateView, FormView
from .forms import LoginForm, RegisterForm
from django.shortcuts import redirect


"""def signup(request):
    if request.method == 'POST':
        #User has given info on signup page and wants to make account
        if request.POST['password'] == request.POST['confpassword']:
            try:
                user = User.objects.get(username = request.POST['username'])
                return render(request, 'accounts/signup.html', {'error': 'Username has already been taken.'})
            except User.DoesNotExist:
                user = User.objects.create_user(request.POST['username'],password = request.POST['password'])
                auth.login(request,user)
                return redirect('homepage') #Redirect user to homepage after successfully creatin account
        else:
            return render(request, 'accounts/signup.html', {'error':'Passwords must match' })
    else:
        #User Wants to proceed to signup page
        return render(request, 'accounts/signup.html')

def login(request):
    if request.method == 'POST':    #User is trying to submit log in information
        user = auth.authenticate(username=request.POST['username'],password=request.POST['password'])
        if user is not None:
            auth.login(request,user)
            return render(request, 'homepage.html')
        else:
            return render(request, 'accounts/login.html', {'error': 'username or password is incorrect'}) #generic error message better for security 
    else:   #User is trying to access the log in page
        return render(request, 'accounts/login.html')


def logout(request):
    if request.method == 'POST':
        auth.logout(request)
        return render(request, 'homepage.html')"""




class LoginView(FormView):
    form_class = LoginForm
    template_name = 'accounts/login.html'
    success_url = '/'

    def form_valid(self, form):
        request = self.request
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password')
        user = authenticate(request,username = username, password = password)

        if user is not None:
            login(request, user)
            return redirect("/")
        return super(LoginView, self).form_invalid(form)

class RegisterView(CreateView):
    form_class = RegisterForm
    template_name = 'accounts/signup.html'
    success_url = 'login'