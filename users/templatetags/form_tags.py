from django import template

register = template.Library()

@register.filter(name='add_class')
def add_class(field, css_class):
    """
    Adiciona uma classe CSS a um field do formulário.
    Uso no template: {{ form.username|add_class:"form-input" }}
    """
    return field.as_widget(attrs={"class": css_class})