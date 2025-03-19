# attendance/forms.py
from django import forms
from .models import Theatre
import json

class TheatreAdminForm(forms.ModelForm):
    class Meta:
        model = Theatre
        fields = '__all__'
        widgets = {
            'polygon_coordinates': forms.Textarea(attrs={'rows': 4, 'cols': 40}),
        }

    def clean_polygon_coordinates(self):
        data = self.cleaned_data.get('polygon_coordinates')
        # If data is provided as a string, attempt to parse it as JSON.
        if data and isinstance(data, str):
            try:
                data = json.loads(data)
            except json.JSONDecodeError:
                raise forms.ValidationError("Invalid JSON format for polygon coordinates.")
        return data
