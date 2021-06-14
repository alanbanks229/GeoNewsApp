import pdb
import json
from accounts.models import Marker, User
from django.http import HttpResponse
from django.contrib import auth

# this will render our custom templates inside "../html_templates"
from django.shortcuts import render

# main site homepage... with google map
def homepage(request):
    if request.method == 'POST':
        # Jordan, request.POST will contain a dictionary containing a key 'address'
        # With the value of whatever the input field was.
        request_data = json.loads(request.body)
        # pdb.set_trace()
        target_address = request_data['address']
        target_coordinates = request_data['coords']
        try:
            newMarker = Marker.objects.get(address = target_address, coordinates = target_coordinates)    #Check to see if ANY marker ANYWHERE contains the address searched by user
            try:
                usermarker = User.objects.get(username = request.user.username, markers = newMarker)    #Check to see if THIS particular user already has that Address in their marker list

            except request.user.DoesNotExist:   #if THIS particular user does not, add that marker to their list
                request.user.markers.add(newMarker)
                request.user.save()
            
        except Marker.DoesNotExist: #If marker doesn't exist ANYWHERE create it in list of markers, and add it to THIS user's marker list
            newMarker = Marker(address = target_address, coordinates = target_coordinates)
            newMarker.save()
            request.user.markers.add(newMarker)
            request.user.save()

        
        
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