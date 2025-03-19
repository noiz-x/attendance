from django import forms
from mapwidgets.widgets import LeafletPointFieldWidget
from .models import Theatre
import json
from django.contrib.gis.geos import Polygon

class TheatreAdminForm(forms.ModelForm):
    # Optional: a text field to search for an address
    address_search = forms.CharField(
        required=False,
        help_text="Enter an address to locate it on the map.",
    )
    polygon_coordinates_text = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 4, 'cols': 40}),
        required=False,
        help_text="Enter polygon coordinates as JSON: [[lon, lat], [lon, lat], ...]"
    )
    
    class Meta:
        model = Theatre
        fields = '__all__'
        widgets = {
            'center': LeafletPointFieldWidget(),  # Use the interactive widget from django-map-widgets
            'geofence': LeafletPointFieldWidget(),  # You might replace this with a polygon widget if available
        }

    def clean_polygon_coordinates_text(self):
        data = self.cleaned_data.get('polygon_coordinates_text')
        if data:
            try:
                coords = json.loads(data)
            except json.JSONDecodeError:
                raise forms.ValidationError("Invalid JSON format for polygon coordinates.")
            if not isinstance(coords, list) or len(coords) < 3:
                raise forms.ValidationError("Polygon requires at least 3 coordinate pairs.")
            for pair in coords:
                if not isinstance(pair, (list, tuple)) or len(pair) != 2:
                    raise forms.ValidationError("Each coordinate must be a list or tuple of two numbers.")
            return coords
        return None

    def save(self, commit=True):
        instance = super().save(commit=False)
        coords = self.cleaned_data.get('polygon_coordinates_text')
        if coords:
            instance.geofence = Polygon(coords, srid=4326)
        if commit:
            instance.save()
        return instance
