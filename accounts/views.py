import os
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
    
    # From hosting server, export the API keys as environ variables, like this:
    # export GOOGLE_API_KEY = <googlemapkey>
    # export BING_API_KEY = <bingkey>
    if not os.environ.get("GOOGLE_API_KEY"):
        raise RuntimeError("GOOGLE_API_KEY not set\nFrom CLI: \n$ export GOOGLE_API_KEY = <googlemapkey>")        
    if not os.environ.get("BING_API_KEY"):
        raise RuntimeError("BING_API_KEY not set\nFrom CLI: \n$ export BING_API_KEY = <bingkey>")
        
    # These keys should be set from hosting OS before running the server.
    GMAPKEY = os.environ.get("GOOGLE_API_KEY")    
    BNEWSKEY = os.environ.get("BING_API_KEY")       
    
    print("User has", Marker.objects.filter(user=request.user).count(), " bookmarks ")   

    if request.method == 'POST':
        #print(request.POST)
        #basically saying if there is a parameter 'delete' in the POST request.
        if request.POST.get('delete'):  
            
            checklist = request.POST.getlist('marker_ids')
            for item in checklist:
                request.user.markers.remove(item)

            """for item in request.user.markers.all():
                if 'bmt' + str(item.id) in request.POST.keys():
                    request.user.markers.remove(item)"""
                
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
        return render(request, 'homepage.html', {'bookmarks': Marker.objects.filter(user=request.user), 'coordinates': bookmarks_data_arr, 'Google_API_Keys': GMAPKEY, 'Bing_API_Keys': BNEWSKEY})
    else:
        bookmarks_data_arr = get_bookmark_coordinates(request.user) #calling helper method
        return render(request, 'homepage.html', {'bookmarks': Marker.objects.filter(user=request.user), 'coordinates': bookmarks_data_arr, 'Google_API_Keys': GMAPKEY, 'Bing_API_Keys': BNEWSKEY})

# helper method to return json bookmark coordinates array
def get_bookmark_coordinates(current_user):
    bookmarks_data_arr = []
    bookmarks_data = Marker.objects.filter(user=current_user)
    for obj in bookmarks_data:
        bookmarks_data_arr.append(obj.coordinates)
    bookmarks_data_arr = dumps(bookmarks_data_arr)
    return bookmarks_data_arr 

