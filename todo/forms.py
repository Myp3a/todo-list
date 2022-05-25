from django import forms

class NewCardForm(forms.Form):
    name = forms.CharField(label="Task name", max_length=100)
    description = forms.CharField(label="Description", widget=forms.Textarea)
    imgfile = forms.FileField(label="Task image", required=False)