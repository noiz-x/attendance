from django import forms
from django.contrib.gis import forms as geoforms
from .models import Theatre

class TheatreAdminForm(forms.ModelForm):
    class Meta:
        model = Theatre
        fields = '__all__'
        widgets = {
            'center': geoforms.OSMWidget(attrs={'map_width': 800, 'map_height': 500}),
        }
