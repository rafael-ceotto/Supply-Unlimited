from django import template

register = template.Library()

@register.filter(name='add_class')
def add_class(field, css_class):
    """
    Adiciona uma classe CSS a um field do formulário.
    Uso no template: {{ form.username|add_class:"form-input" }}
    """
    return field.as_widget(attrs={"class": css_class})

@register.filter(name='european_format')
def european_format(value, decimal_places=2):
    """
    Formata um número no padrão americano.
    Separador de milhares: vírgula (,)
    Separador de decimais: ponto (.)
    
    Uso no template: {{ metrics.total_revenue|european_format:2 }}
    Resultado: 245,820.50
    """
    try:
        # Converter para float se necessário
        if isinstance(value, str):
            value = float(value.replace(',', '.'))
        else:
            value = float(value)
        
        # Formatar com vírgulas como separador de milhares e ponto como decimal
        return f"{value:,.{decimal_places}f}"
    except (ValueError, TypeError, AttributeError):
        return value