from django.shortcuts import render

# Esta es tu nueva vista:
def game_screen(request):
    return render(request, 'game/screen.html')