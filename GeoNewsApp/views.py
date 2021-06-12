import pdb
from accounts.models import Marker
from django.http import HttpResponse
from django.contrib import auth

# this will render our custom templates inside "../html_templates"
from django.shortcuts import render

# main site homepage... with google map
def homepage(request):
    if request.method == 'POST':
        # Jordan, request.POST will contain a dictionary containing a key 'address'
        # With the value of whatever the input field was.
        target_address = request.POST['address']
        newMarker = Marker(address = target_address)
        newMarker.save()
        request.user.markers.add(newMarker)

        print(request.POST)
        # pdb.set_trace()
        # return
    return render(request, 'homepage.html')

# Django tutorial Count Homepage.
def count_homepage(request):
    # return HttpResponse('Hello')
    return render(request, 'count_homepage.html', {'greeting': "Why hello there mah dude"})


def count(request):

    user_input = request.GET['fulltext']

    word_dictionary_mapping = {}
    wordlist = user_input.split()

    for word in wordlist:
        if word in word_dictionary_mapping:
            #Increase
            word_dictionary_mapping[word] +=1
        else:
            #add to dictionary
            word_dictionary_mapping[word] = 1
    print(user_input)
    return render(
        request,
        'count.html',
        {
            'user_input': user_input,
            'count':len(wordlist),
            'mapping':word_dictionary_mapping.items()
        }
    )