import {
  Pill,
  Heart,
  AlertTriangle,
  Users,
  UserX,
  Sparkles,
  ShieldAlert,
  Beaker,
  Thermometer,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MedicineInfo {
  identified: boolean;
  medicineName?: string;
  genericName?: string;
  category?: string;
  purpose?: string;
  howItWorks?: string;
  dosageInfo?: string;
  whoCanTake?: string[];
  whoShouldNot?: string[];
  benefits?: string[];
  sideEffects?: string[];
  seriousSideEffects?: string[];
  warnings?: string[];
  interactions?: string[];
  storageInfo?: string;
  disclaimer?: string;
  error?: string;
}

interface MedicineResultsProps {
  data: MedicineInfo;
}

function ResultCard({
  title,
  icon: Icon,
  children,
  variant = "default",
  className,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}) {
  const variants = {
    default: "bg-card border-border",
    success: "bg-medical-green-light border-medical-green/30",
    warning: "bg-warning-light border-warning/30",
    danger: "bg-destructive/10 border-destructive/30",
  };

  const iconVariants = {
    default: "text-primary",
    success: "text-medical-green",
    warning: "text-warning",
    danger: "text-destructive",
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-5 shadow-soft animate-fade-in",
        variants[variant],
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("p-2 rounded-lg bg-background/80", iconVariants[variant])}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ListItems({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-current mt-2 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function MedicineResults({ data }: MedicineResultsProps) {
  if (!data.identified) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <div className="rounded-2xl border border-warning/30 bg-warning-light p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-warning" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Could Not Identify Medicine
          </h3>
          <p className="text-muted-foreground mb-4">
            {data.error || "Please try uploading a clearer image of the medicine or its packaging."}
          </p>
          <p className="text-sm text-muted-foreground">
            Always consult a healthcare professional for accurate medical information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-3 pb-6 border-b border-border">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-medical-teal-light text-primary font-medium">
          <Pill className="h-4 w-4" />
          {data.category || "Medicine"}
        </div>
        <h2 className="text-3xl font-bold text-foreground">{data.medicineName}</h2>
        {data.genericName && data.genericName !== data.medicineName && (
          <p className="text-muted-foreground">Generic: {data.genericName}</p>
        )}
      </div>

      {/* Purpose & How it Works */}
      {(data.purpose || data.howItWorks) && (
        <div className="grid md:grid-cols-2 gap-4">
          {data.purpose && (
            <ResultCard title="Purpose" icon={Heart}>
              <p className="text-sm text-muted-foreground">{data.purpose}</p>
            </ResultCard>
          )}
          {data.howItWorks && (
            <ResultCard title="How It Works" icon={Beaker}>
              <p className="text-sm text-muted-foreground">{data.howItWorks}</p>
            </ResultCard>
          )}
        </div>
      )}

      {/* Dosage */}
      {data.dosageInfo && (
        <ResultCard title="Dosage Information" icon={Info}>
          <p className="text-sm text-muted-foreground">{data.dosageInfo}</p>
        </ResultCard>
      )}

      {/* Who Can Take / Who Should Not */}
      <div className="grid md:grid-cols-2 gap-4">
        {data.whoCanTake && data.whoCanTake.length > 0 && (
          <ResultCard title="Who Can Take This" icon={Users} variant="success">
            <ListItems items={data.whoCanTake} />
          </ResultCard>
        )}
        {data.whoShouldNot && data.whoShouldNot.length > 0 && (
          <ResultCard title="Who Should NOT Take This" icon={UserX} variant="danger">
            <ListItems items={data.whoShouldNot} />
          </ResultCard>
        )}
      </div>

      {/* Benefits */}
      {data.benefits && data.benefits.length > 0 && (
        <ResultCard title="Benefits" icon={Sparkles} variant="success">
          <ListItems items={data.benefits} />
        </ResultCard>
      )}

      {/* Side Effects */}
      <div className="grid md:grid-cols-2 gap-4">
        {data.sideEffects && data.sideEffects.length > 0 && (
          <ResultCard title="Common Side Effects" icon={AlertTriangle} variant="warning">
            <ListItems items={data.sideEffects} />
          </ResultCard>
        )}
        {data.seriousSideEffects && data.seriousSideEffects.length > 0 && (
          <ResultCard title="Serious Side Effects" icon={ShieldAlert} variant="danger">
            <ListItems items={data.seriousSideEffects} />
          </ResultCard>
        )}
      </div>

      {/* Warnings */}
      {data.warnings && data.warnings.length > 0 && (
        <ResultCard title="Warnings & Precautions" icon={AlertTriangle} variant="warning">
          <ListItems items={data.warnings} />
        </ResultCard>
      )}

      {/* Interactions */}
      {data.interactions && data.interactions.length > 0 && (
        <ResultCard title="Drug Interactions" icon={Beaker}>
          <ListItems items={data.interactions} />
        </ResultCard>
      )}

      {/* Storage */}
      {data.storageInfo && (
        <ResultCard title="Storage Instructions" icon={Thermometer}>
          <p className="text-sm text-muted-foreground">{data.storageInfo}</p>
        </ResultCard>
      )}

      {/* Disclaimer */}
      <div className="rounded-xl bg-muted/50 border border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Medical Disclaimer:</strong>{" "}
          {data.disclaimer ||
            "This information is for educational purposes only and should not replace professional medical advice. Always consult a healthcare provider before taking any medication."}
        </p>
      </div>
    </div>
  );
}
