# 🎯 PREVIEW - Página Sales Analytics

## 📸 Visualização Completa da Página

```
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║  🟢 SU  Supply Unlimited                               [Logout]      ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
┌─────────────────┬─────────────────────────────────────────────────────┐
│                 │                                                     │
│  📁 Dashboard   │  Sales Analytics                                    │
│  📈 Sales ✓     │  Analyze company performance, revenue, and market   │
│  🏢 Companies   │                                                     │
│                 │  ┌───────────────────────────────────────────────┐ │
│                 │  │ 🔍 Search Company                             │ │
│                 │  │ Find detailed sales analytics and insights    │ │
│                 │  │                                               │ │
│                 │  │ [Company Name...] [Sector▼] [Country▼] [2026▼]│
│                 │  │                                     [Search]  │ │
│                 │  └───────────────────────────────────────────────┘ │
│                 │                                                     │
│                 │  ╔═══════════════════════════════════════════════╗ │
│                 │  ║ 🟢 TechCorp EU                      [Active]  ║ │
│                 │  ║ Technology • Germany                          ║ │
│                 │  ╚═══════════════════════════════════════════════╝ │
│                 │                                                     │
│                 │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│                 │  │ 💰 Revenue  │ │ 📊 Profit   │ │ ✨ Prediction│  │
│                 │  │   YTD       │ │   YTD       │ │   Next Year  │  │
│                 │  │             │ │             │ │              │  │
│                 │  │ €2,850,000  │ │ €520,000    │ │ €3,277,500   │  │
│                 │  │ +12.5% ↑    │ │ +8.3% ↑     │ │ +15.0% ↑     │  │
│                 │  │ ▓▓▓▓▓▓▓░░░  │ │ ▓▓▓▓▓▓░░░░  │ │ ▓▓▓▓▓▓▓▓░░  │  │
│                 │  └─────────────┘ └─────────────┘ └─────────────┘  │
│                 │                                                     │
│                 │  ┌───────────────────────────────────────────────┐ │
│                 │  │ 🏆 Market Position - Competitor Ranking       │ │
│                 │  ├────┬─────────────────┬──────────┬─────────────┤ │
│                 │  │ #  │ Company         │ Revenue  │ Market (%) ││ │
│                 │  ├────┼─────────────────┼──────────┼─────────────┤ │
│                 │  │ 🥇 │ [DI] Digital S. │ €3.2M    │ 28.8%      ││ │
│                 │  │ 🥈 │ [TE] TechCorp ✓ │ €2.85M   │ 25.5% [YOU]││ │
│                 │  │ 🥉 │ [IN] Innovation │ €2.1M    │ 18.9%      ││ │
│                 │  │ 4  │ [SM] Smart Sys. │ €1.8M    │ 16.2%      ││ │
│                 │  │ 5  │ [FU] FutureTech │ €1.2M    │ 10.6%      ││ │
│                 │  └────┴─────────────────┴──────────┴─────────────┘ │
│                 │                                                     │
│                 │  ┌───────────────────────────────────────────────┐ │
│                 │  │ 📦 Top Selling Products                       │ │
│                 │  ├───────────────────────────────────────────────┤ │
│                 │  │ 🏆 1  Industrial Drill Kit      1,000 €299,990│ │
│                 │  │ 🏆 2  Office Chair Premium        850 €161,075│ │
│                 │  │ 🏆 3  Laptop Stand Adjustable     700 €55,993 │ │
│                 │  │    4  Printer Paper A4            550 €7,144  │ │
│                 │  │    5  Cable Organizer Set         400 €15,996 │ │
│                 │  └───────────────────────────────────────────────┘ │
│                 │                                                     │
└─────────────────┴─────────────────────────────────────────────────────┘
```

---

## 🎨 Design Elements

### Color Scheme
- **Primary Green**: `#10b981` (Revenue, You badge)
- **Blue**: `#3b82f6` (Profit)
- **Orange**: `#f59e0b` (Prediction, Top rank)
- **White Background**: `#ffffff`
- **Light Gray**: `#f9fafb` (Page background)

### Icons (Lucide)
- 🔍 `search` - Search icon
- 💰 `euro` - Revenue
- 📊 `trending-up` - Profit & Growth
- ✨ `sparkles` - Prediction
- 🏆 `award` - Ranking header
- 📦 `package` - Products header
- 🏠 `home` - Dashboard menu
- 🏢 `building-2` - Companies menu

---

## 📋 Componentes da Página

### 1. Top Bar
```
┌────────────────────────────────────────────────┐
│ [SU] Supply Unlimited            [Logout Btn] │
└────────────────────────────────────────────────┘
```

### 2. Sidebar (Menu)
```
┌──────────────┐
│ 📁 Dashboard │
│ 📈 Sales ✓   │
│ 🏢 Companies │
└──────────────┘
```

### 3. Page Header
```
Sales Analytics
Analyze company performance, revenue, and market position
```

### 4. Search Section
```
┌──────────────────────────────────────────────────┐
│ 🔍 Search Company                                │
│ Find detailed sales analytics and market insights│
│                                                  │
│ ┌────────────┐ ┌───────┐ ┌────────┐ ┌────┐     │
│ │Company Name│ │Sector▼│ │Country▼│ │Year▼│ [🔍]│
│ └────────────┘ └───────┘ └────────┘ └────┘     │
└──────────────────────────────────────────────────┘

Filters:
- Sector: All / Technology / Industrial / Logistics
- Country: All / Germany / France / Italy / Spain / Netherlands
- Year: 2026 / 2025 / 2024
```

### 5. Company Banner (After Search)
```
╔════════════════════════════════════════════════╗
║ TechCorp EU                         [Active]  ║
║ Technology • Germany                          ║
╚════════════════════════════════════════════════╝

Background: Linear gradient green
Text: White
```

### 6. KPI Cards (3 Cards)
```
┌──────────────┐
│ 💰 Revenue   │
│   YTD        │
│              │
│ €2,850,000   │
│ +12.5% ↑     │
│ ▓▓▓▓▓▓▓░░░   │
└──────────────┘

Features:
- Icon with colored background
- Large number (36px)
- Change percentage with trend arrow
- Progress bar
- Hover effect (lift up)
```

### 7. Competitor Ranking Table
```
┌────┬──────────────────┬───────────┬─────────┬────────┬──────┐
│ #  │ Company          │ Revenue   │ Profit  │ Market │ Type │
├────┼──────────────────┼───────────┼─────────┼────────┼──────┤
│ 🥇 │ [DI] Digital Sol │ €3,200,000│ €580,000│ 28.8%  │      │
│ 🥈 │ [TE] TechCorp ✓  │ €2,850,000│ €520,000│ 25.5%  │ YOU  │
│ 🥉 │ [IN] Innovation  │ €2,100,000│ €380,000│ 18.9%  │      │
│ 4  │ [SM] Smart Sys   │ €1,800,000│ €320,000│ 16.2%  │      │
│ 5  │ [FU] FutureTech  │ €1,200,000│ €210,000│ 10.6%  │      │
└────┴──────────────────┴───────────┴─────────┴────────┴──────┘

Features:
- Rank medals (🥇 🥈 🥉) for top 3
- Avatar with company initials
- Your company highlighted with green background
- Badge "YOU" vs "Competitor"
- Sortable columns
```

### 8. Top Products List
```
┌─────────────────────────────────────────────┐
│ 📦 Top Selling Products                     │
├─────────────────────────────────────────────┤
│                                             │
│ [🏆 1] Industrial Drill Kit                 │
│        Electronics • SKU: SUP-001           │
│                           1,000   €299,990  │
│                                             │
│ [🏆 2] Office Chair Premium                 │
│        Furniture • SKU: SUP-002             │
│                             850   €161,075  │
│                                             │
│ [🏆 3] Laptop Stand Adjustable              │
│        Electronics • SKU: SUP-003           │
│                             700   €55,993   │
└─────────────────────────────────────────────┘

Features:
- Rank badge (gold for top 3)
- Product name and category
- SKU code
- Units sold (big green number)
- Revenue
- Hover effect (border changes, shifts right)
```

---

## 🔄 Interações

### Search Flow
```
1. User types company name: "TechCorp"
   ↓
2. Selects filters (optional):
   - Sector: Technology
   - Country: Germany
   - Year: 2026
   ↓
3. Clicks "Search" button
   ↓
4. JavaScript calls API:
   GET /api/sales/?company_name=TechCorp&sector=technology&country=Germany&year=2026
   ↓
5. API returns JSON with:
   - Company info
   - Metrics (revenue, profit, prediction)
   - Competitor ranking
   - Top products
   ↓
6. JavaScript displays results:
   - Shows results container
   - Populates company banner
   - Updates KPI cards
   - Renders ranking table
   - Renders product list
   ↓
7. Icons refresh (lucide.createIcons())
```

### Hover Effects
- **KPI Cards**: Lift up 4px, shadow increases
- **Product Items**: Border becomes green, shifts right 4px
- **Menu Items**: Background becomes light green

### Animations
- **Progress Bars**: Animate width on load
- **Results Container**: Fade in when displayed
- **Transitions**: 0.2s ease on all interactive elements

---

## 📊 Data Flow

### API Request
```javascript
GET /api/sales/?company_name=TechCorp&sector=Technology&country=Germany&year=2026
```

### API Response
```json
{
  "success": true,
  "company": {
    "name": "TechCorp EU",
    "sector": "Technology",
    "country": "Germany"
  },
  "metrics": {
    "revenue_ytd": 2850000.00,
    "profit_ytd": 520000.00,
    "prediction_next_ytd": 3277500.00,
    "revenue_change": 12.5,
    "profit_change": 8.3,
    "prediction_growth": 15.0
  },
  "ranking": [
    {
      "name": "Digital Solutions AG",
      "country": "Germany",
      "revenue_ytd": 3200000.00,
      "profit_ytd": 580000.00,
      "market_share": 28.8,
      "is_our_company": false
    },
    {
      "name": "TechCorp EU",
      "country": "Germany",
      "revenue_ytd": 2850000.00,
      "profit_ytd": 520000.00,
      "market_share": 25.5,
      "is_our_company": true
    },
    ...
  ],
  "top_products": [
    {
      "name": "Industrial Drill Kit",
      "sku": "SUP-001",
      "category": "Electronics",
      "units_sold": 1000,
      "revenue": 299990.00
    },
    ...
  ]
}
```

---

## 🎯 Casos de Uso

### Caso 1: Buscar Empresa TechCorp
```
Input: "TechCorp" + "Technology" + "Germany" + "2026"
↓
Output:
- Revenue YTD: €2,850,000 (+12.5%)
- Profit YTD: €520,000 (+8.3%)
- Prediction: €3,277,500 (+15.0%)
- Ranking: #2 of 5 (28.8% market share)
- Top Product: Industrial Drill Kit (1,000 units)
```

### Caso 2: Comparar com Concorrentes
```
Visualização:
#1 Digital Solutions AG - €3.2M (28.8%)
#2 TechCorp EU [YOU] - €2.85M (25.5%) ← Highlighted
#3 Innovation Tech - €2.1M (18.9%)

Insights:
- Você está em 2º lugar
- Diferença para #1: -€350,000 (-10.9%)
- Diferença para #3: +€750,000 (+35.7%)
```

### Caso 3: Analisar Produtos
```
Top 5 Produtos:
1. Industrial Drill Kit - 1,000 units (33.4% of sales)
2. Office Chair Premium - 850 units (28.4% of sales)
3. Laptop Stand - 700 units (23.3% of sales)
4. Printer Paper - 550 units (18.3% of sales)
5. Cable Organizer - 400 units (13.3% of sales)

Insight: Top 3 produtos representam 85.1% das vendas
```

---

## 💻 Código Principal

### HTML Structure
```html
<div class="search-section">
  <form onsubmit="searchCompany(event)">
    <!-- Search inputs -->
  </form>
</div>

<div id="resultsContainer" class="results-container">
  <div class="company-banner">
    <!-- Company info -->
  </div>
  
  <div class="kpi-grid">
    <!-- 3 KPI cards -->
  </div>
  
  <div class="ranking-section">
    <div id="rankingTable">
      <!-- Competitor ranking -->
    </div>
  </div>
  
  <div class="products-section">
    <div id="productList">
      <!-- Top products -->
    </div>
  </div>
</div>
```

### JavaScript Functions
```javascript
async function searchCompany(event)
  → Fetch API data

function displayResults(data)
  → Update all sections

function displayRanking(ranking)
  → Render competitor table

function displayProducts(products)
  → Render product list
```

---

## ✅ Funcionalidades Completas

- [x] Busca por nome da empresa
- [x] Filtros: Setor, País, Ano
- [x] KPI Revenue YTD com percentual
- [x] KPI Profit YTD com percentual
- [x] KPI Prediction Next YTD
- [x] Ranking de concorrentes
- [x] Destaque visual para sua empresa
- [x] Top 5 produtos mais vendidos
- [x] Design responsivo
- [x] Animações suaves
- [x] Icons Lucide
- [x] API RESTful completa
- [x] Error handling

---

## 📱 Responsividade

### Desktop (> 1024px)
- Layout completo com sidebar
- 3 KPI cards em linha
- Tabela de ranking completa

### Tablet (768px - 1024px)
- Sidebar compacta
- KPI cards adaptam grid
- Tabela ajusta colunas

### Mobile (< 768px)
- Menu hamburger
- KPI cards empilhados
- Tabela com scroll horizontal

---

## 🎨 CSS Classes Principais

```css
.search-section          # Container de busca
.kpi-card               # Cards de KPIs
.kpi-card.revenue       # Card verde
.kpi-card.profit        # Card azul
.kpi-card.prediction    # Card laranja
.ranking-row            # Linha do ranking
.ranking-row.highlight  # Sua empresa
.product-item           # Item de produto
.product-rank.top       # Top 3 badge
.company-banner         # Banner verde da empresa
```

---

**Página Sales Analytics está 100% funcional e pronta para uso! 🚀**

Para testar:
1. `python manage.py runserver`
2. Acesse: `http://localhost:8000/sales/`
3. Digite: "TechCorp"
4. Clique em "Search"
5. Veja os resultados! ✨
