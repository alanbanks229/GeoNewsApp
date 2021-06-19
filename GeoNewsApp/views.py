import pdb
import re
from accounts.models import Marker, User
from django.http import HttpResponse
from django.contrib import auth
from django.contrib.auth.decorators import login_required

# this will render our custom templates inside "../html_templates"
from django.shortcuts import render

# from django.contrib.auth import get_user_model
# User = get_user_model()

# main site homepage... with google map
@login_required(login_url='/accounts/login')
def homepage(request):
    print("User has", Marker.objects.filter(user=request.user).count(), " bookmarks ")
    if request.method == 'POST':
        # Jordan, request.POST will contain a dictionary containing a key 'address'
        # With the value of whatever the input field was.
        target_address = request.POST['address']
        target_coords = request.POST['coordinates']
        target_coords_arr = re.findall(r"[-+]?\d*\.\d+|\d+", target_coords)
        json_result = "{lat: " + target_coords_arr[0] + "," + " lng: " + target_coords_arr[1] + "}"
        try:
            newMarker = Marker.objects.get(address = target_address)    #Check to see if ANY marker ANYWHERE contains the address searched by user
            try:
                usermarker = User.objects.get(username = request.user.username, markers = newMarker)    #Check to see if THIS particular user already has that Address in their marker list

            except request.user.DoesNotExist:   #if THIS particular user does not, add that marker to their list
                request.user.markers.add(newMarker)
                request.user.save()


        except Marker.DoesNotExist: #If marker doesn't exist ANYWHERE create it in list of markers, and add it to THIS user's marker list
            newMarker = Marker(address = target_address, coordinates = json_result)
            newMarker.save()
            request.user.markers.add(newMarker)
            request.user.save()
        #Instead of re Rendering the page, save the book mark, and add a html button that refreshes the page for the purpose of refreshing bookmarks.
        return render(request, 'homepage.html', {'bookmarks': Marker.objects.filter(user=request.user)})
    else:
        return render(request, 'homepage.html', {'bookmarks': Marker.objects.filter(user=request.user)})

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