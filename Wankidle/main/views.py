from django.http import HttpResponse
from django.shortcuts import render
from .models import Database
from django.http import JsonResponse

from random import randint
import datetime as dt   
from django.http import JsonResponse
from .models import Database 
import queue
def hash(date):
 
    
    result = 0
    s = ""
    s+=str(date)
    dateenstring = s[0]+s[1]+s[2]+s[3]+s[5]+s[6]+s[8]+s[9]
    intdate = int(dateenstring)
    intdate *=2
    intdate/=6
    nbresvideos = Database.objects.count()
    result = intdate % nbresvideos
    return int(result)


    
        

test = []
def search_in_database(elt , database):
    for i in range(len(database)):
        print(i)
        print(elt)
        print(database[0][0])
        if database[i][0]==elt:
            
            return True
    return False
def search_videos(request):
    query = request.GET.get('q', '')
    if query:
        videos = Database.objects.filter(title__icontains=query)
    else:
        videos = Database.objects.all()
    results = [{'title': video.title} for video in videos]
    return JsonResponse(results, safe=False)

def main(request):
    
   
    current_date_and_time = dt.datetime.now()
    oui = hash(current_date_and_time)
    print(oui)
    
    if request.method == 'POST':
        search_str = request.POST.get('testname', '')
        if search_str:
            data = Database.objects.filter(title__icontains=search_str)
            
            if data.count()== 1:
                datatrue = Database.objects.filter(index=oui)
                if test!=[]:
                    
                    if search_in_database(data[0] , test)==False:
                        
                        test.insert(0 , data)
                else:
                    if test==[]:
                        print("jappend")
                        test.insert(0 , data)
                
                return render(request, 'main/templates.html', {'data': test, 'datatrue': datatrue})
            else:
                return render(request, 'main/templates.html', {'data': None})
    else:
        return render(request, 'main/templates.html', {'data': None})
