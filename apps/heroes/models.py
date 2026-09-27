"""
apps/heroes/models.py - Modelos para el Héroe, Inventario y Equipamiento.
"""
from django.db import models
from django.contrib.auth.models import User


class Item(models.Model):
    ITEM_TYPES = (
        ('EQUIPMENT', 'Equipamiento'),
        ('KEY', 'Llave de Mazmorra'),
        ('CONSUMABLE', 'Consumible'),
        ('QUEST', 'Objeto de Misión'),
    )

    name = models.CharField(max_length=100, verbose_name="Nombre")
    description = models.TextField(blank=True, verbose_name="Descripción")
    item_type = models.CharField(max_length=20, choices=ITEM_TYPES, default='EQUIPMENT')
    sprite_icon = models.CharField(max_length=100, default='default_item.png', help_text="Identificador del sprite")

    def __str__(self):
        return f"{self.name} ({self.get_item_type_display()})"


class Hero(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='hero')
    name = models.CharField(max_length=50, default="Link", verbose_name="Nombre del Héroe")

    max_health = models.IntegerField(default=6, help_text="Salud máxima en medios corazones (6 = 3 corazones completos)")
    current_health = models.IntegerField(default=6)

    # Referencia mediante string 'world.MapRegion'
    current_map = models.ForeignKey('world.MapRegion', on_delete=models.SET_NULL, null=True, blank=True)
    pos_x = models.IntegerField(default=5)
    pos_y = models.IntegerField(default=5)

    equipped_weapon = models.ForeignKey(
        Item, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='equipped_by_heroes',
        limit_choices_to={'item_type': 'EQUIPMENT'}
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (HP: {self.current_health}/{self.max_health})"


class Inventory(models.Model):
    hero = models.ForeignKey(Hero, on_delete=models.CASCADE, related_name='inventory_items')
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('hero', 'item')
        verbose_name_plural = "Inventarios"

    def __str__(self):
        return f"{self.hero.name} - {self.item.name} x{self.quantity}"