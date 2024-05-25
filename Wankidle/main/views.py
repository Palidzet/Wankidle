from django.http import HttpResponse
from django.shortcuts import render
from .models import Database
from django.http import JsonResponse

from random import randint
    
                

        
from django.http import JsonResponse
from .models import Database

def search_videos(request):
    query = request.GET.get('q', '')
    if query:
        videos = Database.objects.filter(title__icontains=query)
    else:
        videos = Database.objects.all()
    results = [{'title': video.title} for video in videos]
    return JsonResponse(results, safe=False)
from random import randint
oui = randint(1, Database.objects.count())
def main(request):
    
    dataprint = Database.objects.filter(index=oui)
    print(dataprint)
    if request.method == 'POST':
        search_str = request.POST.get('testname', '')
        if search_str:
            data = Database.objects.filter(title__icontains=search_str)
            
            if data.count()== 1:
                datatrue = Database.objects.filter(index=oui)
                return render(request, 'main/templates.html', {'data': data, 'datatrue': datatrue})
            else:
                return render(request, 'main/templates.html', {'data': None})
    else:
        return render(request, 'main/templates.html', {'data': None})
