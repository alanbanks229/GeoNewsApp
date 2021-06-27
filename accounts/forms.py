from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.contrib.auth.hashers import check_password

User = get_user_model()

class UserAdminCreationForm(forms.ModelForm):
    """
    A form for creating new users. Includes all the required
    fields, plus a repeated password.
    """
    password = forms.CharField(widget=forms.PasswordInput)
    password_2 = forms.CharField(label='Confirm Password', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ['username']

    def clean(self):
        '''
        Verify both passwords match.
        '''
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        password_2 = cleaned_data.get("password_2")
        if password is not None and password != password_2:
            self.add_error("password_2", "Your passwords must match")
        return cleaned_data

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user


class UserAdminChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = User
        fields = ['username', 'markers', 'password', 'active', 'admin']

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]


    
    #Actual website page forms

   

class LoginForm(forms.Form):
    username = forms.CharField(label = 'Username')
    password = forms.CharField(label = 'Password', widget= forms.PasswordInput)

    def clean(self):
       
        cleaned_data = super().clean()
        username = self.cleaned_data.get("username")
        password = self.cleaned_data.get("password")
        
        
        try:
            qs = User.objects.get(username= username)
            if not qs.check_password(password):
                raise forms.ValidationError("Invalid Login")
            return cleaned_data
        except:
            raise forms.ValidationError('Invalid Login')
        return cleaned_data
    
    
        

class RegisterForm(forms.ModelForm):         
    username = forms.CharField(widget = forms.TextInput)
    password1 = forms.CharField(label = 'Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Confirm Password', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ['username']

    def clean_username(self):
        '''
        Verify username is available.
        '''
        username = self.cleaned_data.get('username')
        #qs = User.objects.get(username= username)
        if User.objects.filter(username= username).exists():
            raise forms.ValidationError("username is taken")
        return username

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self,commit= True):
        # Save user pass in hashed format
        user = super(RegisterForm,self).save(commit= False)
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user