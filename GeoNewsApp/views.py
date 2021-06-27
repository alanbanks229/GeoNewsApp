import pdb
import re
from accounts.models import Marker, User
from django.http import HttpResponse
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from json import dumps

# this will render our custom templates inside "../html_templates"
from django.shortcuts import render

# main site homepage... with google map
@login_required(login_url='/accounts/login')
def homepage(request):
    print("User has", Marker.objects.filter(user=request.user).count(), " bookmarks ")

    # pdb.set_trace()

    if request.method == 'POST':
        
        #basically saying if there is a parameter 'delete' in the POST request.
        if request.POST.get('delete'):
            for item in request.user.markers.all():
                if request.POST.get( str(item.id) == "clicked"):
                    target_marker = Marker.objects.get(id = item.id)
                    request.user.marker_set.remove(target_marker)
            return render(request, 'homepage.html', {'bookmarks': Marker.objects.filter(user=request.user), 'coordinates': get_bookmark_coordinates(request.user)})
        
        # At this point there is no delete parameter detected, program will assess what to do with bookmark information.
        target_address = request.POST['address']
        target_coords = request.POST['coordinates']
        
        # Regex command which will take in a target string, and return an array of float values
        target_coords_arr = re.findall(r"[-+]?\d*\.\d+|\d+", target_coords)
        # pdb.set_trace()

        # Taking the resulting float values and pushing a map representation of coordinates to the Bookmarks model
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

        bookmarks_data_arr = get_bookmark_coordinates(request.user) #calling helper method
        return render(request, 'homepage.html', {'bookmarks': Marker.objects.filter(user=request.user), 'coordinates': bookmarks_data_arr})
    else:
        bookmarks_data_arr = get_bookmark_coordinates(request.user) #calling helper method
        return render(request, 'homepage.html', {'bookmarks': Marker.objects.filter(user=request.user), 'coordinates': bookmarks_data_arr})

# helper method to return json bookmark coordinates array
def get_bookmark_coordinates(current_user):
    bookmarks_data_arr = []
    bookmarks_data = Marker.objects.filter(user=current_user)
    for obj in bookmarks_data:
        bookmarks_data_arr.append(obj.coordinates)
    bookmarks_data_arr = dumps(bookmarks_data_arr)
    return bookmarks_data_arr 


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