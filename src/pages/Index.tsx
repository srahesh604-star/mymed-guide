import { useState } from "react";
import { Header } from "@/components/Header";
import { MedicineUploader } from "@/components/MedicineUploader";
import { MedicineResults } from "@/components/MedicineResults";
import { Features } from "@/components/Features";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<MedicineInfo | null>(null);

  const handleImageSelected = async (base64: string) => {
    setIsAnalyzing(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-medicine", {
        body: { imageBase64: base64 },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        toast.error(data.error);
        setResults({ identified: false, error: data.error });
      } else {
        setResults(data);
        if (data.identified) {
          toast.success(`Identified: ${data.medicineName}`);
        }
      }
    } catch (error) {
      console.error("Error analyzing medicine:", error);
      toast.error("Failed to analyze medicine. Please try again.");
      setResults({
        identified: false,
        error: "Failed to analyze the image. Please try again with a clearer photo.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-12 sm:py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-10 sm:mb-14 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
                Know Your{" "}
                <span className="text-gradient">Medicine</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Upload a photo of any medicine and get instant, AI-powered insights about 
                its uses, benefits, side effects, and safety information.
              </p>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <MedicineUploader
                onImageSelected={handleImageSelected}
                isAnalyzing={isAnalyzing}
              />
            </div>
          </div>
        </section>

        {/* Results Section */}
        {results && (
          <section className="py-8 sm:py-12 px-4 bg-secondary/20">
            <div className="container mx-auto">
              <MedicineResults data={results} />
            </div>
          </section>
        )}

        {/* Features Section */}
        {!results && <Features />}

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-border/50 bg-card/50">
          <div className="container mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Disclaimer:</strong> This tool is for informational purposes only. 
              Always consult a healthcare professional for medical advice.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              © 2026 Hospital at Home. Powered by AI.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
