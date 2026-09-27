"""
apps/world/models.py - Modelos para Mapas, Celdas (Tiles), Puertas y Cofres.
"""
from django.db import models


class MapRegion(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nombre de la Región")
    width = models.PositiveIntegerField(default=16, help_text="Número de celdas a lo ancho")
    height = models.PositiveIntegerField(default=11, help_text="Número de celdas a lo alto")
    is_dungeon = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Tile(models.Model):
    TILE_TYPES = (
        ('GRASS', 'Césped (Transitable)'),
        ('WALL', 'Pared/Roca (Bloqueado)'),
        ('WATER', 'Agua (Bloqueado)'),
        ('DOOR', 'Puerta/Entrada'),
        ('CHEST', 'Cofre de Tesoro'),
    )

    map_region = models.ForeignKey(MapRegion, on_delete=models.CASCADE, related_name='tiles')
    x = models.PositiveIntegerField()
    y = models.PositiveIntegerField()
    tile_type = models.CharField(max_length=20, choices=TILE_TYPES, default='GRASS')
    is_walkable = models.BooleanField(default=True)

    class Meta:
        unique_together = ('map_region', 'x', 'y')

    def __str__(self):
        return f"{self.map_region.name} - [{self.x}, {self.y}] ({self.tile_type})"


class Door(models.Model):
    tile = models.OneToOneField(Tile, on_delete=models.CASCADE, related_name='door_data')
    is_locked = models.BooleanField(default=True)
    # Referencia mediante string 'heroes.Item' en lugar de importación directa
    required_key = models.ForeignKey('heroes.Item', on_delete=models.SET_NULL, null=True, blank=True)
    
    destination_map = models.ForeignKey(MapRegion, on_delete=models.SET_NULL, null=True, related_name='doors_to_here')
    destination_x = models.PositiveIntegerField(default=0)
    destination_y = models.PositiveIntegerField(default=0)

    def __str__(self):
        estado = "Bloqueada" if self.is_locked else "Abierta"
        return f"Puerta en {self.tile} - Status: {estado}"


class Chest(models.Model):
    tile = models.OneToOneField(Tile, on_delete=models.CASCADE, related_name='chest_data')
    # Referencia mediante string 'heroes.Item'
    contained_item = models.ForeignKey('heroes.Item', on_delete=models.CASCADE)
    is_opened = models.BooleanField(default=False)

    def __str__(self):
        return f"Cofre con {self.contained_item.name} en {self.tile}"