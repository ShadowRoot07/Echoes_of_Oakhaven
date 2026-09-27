from django.shortcuts import render

def game_screen(request):
    """Renderiza la pantalla del canvas para Echoes of Oakhaven."""
    return render(request, 'game/screen.html')