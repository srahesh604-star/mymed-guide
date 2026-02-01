import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a medical expert AI assistant specialized in pharmaceutical analysis. When shown an image of medicine (pill, tablet, capsule, syrup, injection, or packaging), analyze it and provide comprehensive information.

IMPORTANT: Always respond in valid JSON format with this exact structure:
{
  "identified": true/false,
  "medicineName": "Name of the medicine",
  "genericName": "Generic/scientific name if different",
  "category": "Drug category (e.g., Antibiotic, Pain Reliever, etc.)",
  "purpose": "What this medicine is used for - main indications",
  "howItWorks": "Brief explanation of mechanism of action",
  "dosageInfo": "Common dosage information",
  "whoCanTake": ["List of who can safely take this medicine"],
  "whoShouldNot": ["List of people who should avoid this medicine - contraindications"],
  "benefits": ["List of key benefits"],
  "sideEffects": ["List of common side effects"],
  "seriousSideEffects": ["List of serious side effects requiring medical attention"],
  "warnings": ["Important warnings and precautions"],
  "interactions": ["Known drug interactions"],
  "storageInfo": "How to store the medicine properly",
  "disclaimer": "Medical disclaimer"
}

If you cannot identify the medicine clearly, set "identified" to false and provide general guidance about consulting a healthcare professional.

Be accurate, thorough, and always emphasize the importance of consulting healthcare professionals for personalized medical advice.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this medicine image and provide detailed information about it in JSON format.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response from the AI
    let medicineInfo;
    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      medicineInfo = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", content);
      medicineInfo = {
        identified: false,
        medicineName: "Unable to analyze",
        error: "Could not parse the analysis. Please try with a clearer image.",
        rawResponse: content,
      };
    }

    return new Response(
      JSON.stringify(medicineInfo),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error analyzing medicine:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
