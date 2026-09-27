"""
apps/dialogues/models.py - Modelos para NPCs y Cadenas de Diálogos.
"""
from django.db import models


class NPC(models.Model):
    name = models.CharField(max_length=50)
    sprite = models.CharField(max_length=100, default='old_man.png')
    
    # Referencia mediante string 'world.MapRegion'
    map_region = models.ForeignKey('world.MapRegion', on_delete=models.CASCADE, related_name='npcs')
    pos_x = models.PositiveIntegerField()
    pos_y = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.name} ({self.map_region.name} [{self.pos_x},{self.pos_y}])"


class DialogueNode(models.Model):
    npc = models.ForeignKey(NPC, on_delete=models.CASCADE, related_name='dialogues')
    text = models.TextField(verbose_name="Texto del Diálogo")
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.npc.name} - Línea {self.order}: {self.text[:30]}..."