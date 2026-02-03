import urllib.request
import json

# Fazer requisição para a API
try:
    with urllib.request.urlopen('http://localhost:8000/api/inventory/?store=all') as response:
        data = json.loads(response.read().decode())
    
    # Extrair países únicos
    countries = set()
    for item in data.get('data', []):
        countries.add(item['store'])
    
    print("Países encontrados no Live Stock Inventory:")
    for country in sorted(countries):
        print(f"  - {country}")
except Exception as e:
    print(f"Erro: {e}")
