**Quick helpful tip, if you are creating a NEW Django project on Windows:**

This command may not work on windows
`django-admin startproject {name_of_your_app}`

Equivalent command for windows is:
`python -m django startproject {name_of_your_app}`

*Group partners do not need to run these commands for this project. This is just a helpful tidbit for future projects.*

__________________________________________________________________________________

**Getting Started:**

First, you need to export the required Google and Bing API keys.
To simplify this, simply run the following:
`chmod +x export_keys.sh`
`./export_keys.sh`

If you do not do the above steps, users will encounter a 500 error
due to exceptions raised by 'views.py' as the keys won't be accessible.

Next, prepare your Django setup. You can do this with the help of 
'requirements.txt'
`python3 -m pip install requirements.txt`

Run the server... when you're in the parent directory:

`python3 manage.py runserver`

and then go to wherever your localhost server starts running

(i.e localhost:8000 or http://127.0.0.1:8000/ etc... )

Please note that this 'readme' is a quickstart.  For full instructions, see the 'Admin Guide' section of
the full GeoNews documentation offered through CMSC_495.  That section includes additional information
on deploying a public facing server, as well as troubleshooting recommendations for common mistakes. 
