import { TrendingUp, TrendingDown, Package, Euro, ShoppingCart } from "lucide-react";

export function DashboardCards() {
  const cards = [
    {
      title: "Total Revenue",
      value: "€245,890",
      change: "+12.5%",
      trend: "up",
      icon: Euro,
      color: "green",
    },
    {
      title: "Active Orders",
      value: "1,429",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "blue",
    },
    {
      title: "Stock Items",
      value: "8,456",
      change: "-3.1%",
      trend: "down",
      icon: Package,
      color: "purple",
    },
    {
      title: "Conversion Rate",
      value: "3.24%",
      change: "+1.8%",
      trend: "up",
      icon: TrendingUp,
      color: "orange",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: "bg-green-100 text-green-700",
      blue: "bg-blue-100 text-blue-700",
      purple: "bg-purple-100 text-purple-700",
      orange: "bg-orange-100 text-orange-700",
    };
    return colors[color as keyof typeof colors] || colors.green;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.trend === "up" ? TrendingUp : TrendingDown;

        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${getColorClasses(card.color)}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm ${
                  card.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                <TrendIcon className="w-4 h-4" />
                <span>{card.change}</span>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}
