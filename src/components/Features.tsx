import { Camera, Zap, Shield, BookOpen } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Snap & Analyze",
    description: "Simply take a photo of any medicine to get instant information",
  },
  {
    icon: Zap,
    title: "AI-Powered",
    description: "Advanced AI technology identifies medicines and provides detailed insights",
  },
  {
    icon: Shield,
    title: "Safety First",
    description: "Learn about side effects, contraindications, and who should avoid certain medicines",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Info",
    description: "Get complete details including dosage, benefits, and drug interactions",
  },
];

export function Features() {
  return (
    <section className="py-16 px-4 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Get comprehensive medicine information in seconds
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-xl p-6 shadow-soft hover:shadow-card transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
