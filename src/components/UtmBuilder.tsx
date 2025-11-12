import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Copy, Check, Info, LinkIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { toast } from "sonner";
import Header from "./Header";
import Footer from "./Footer";
import HeroSection from "./HeroSection";

interface UtmParams {
  baseUrl: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_id: string;
  utm_term: string;
  utm_content: string;
}

const tooltips = {
  baseUrl: "The full website URL (destination) where you want to send traffic",
  utm_source: "Identifies the source of traffic (e.g., google, newsletter, facebook)",
  utm_medium: "The marketing medium (e.g., cpc, email, social)",
  utm_campaign: "The specific campaign name (e.g., spring_sale, product_launch)",
  utm_id: "Campaign ID for tracking in analytics platforms",
  utm_term: "Paid search keywords or terms (for paid campaigns)",
  utm_content: "Differentiate similar content or links (e.g., header_link, sidebar_cta)",
};

const UtmBuilder = () => {
  const [params, setParams] = useState<UtmParams>({
    baseUrl: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_id: "",
    utm_term: "",
    utm_content: "",
  });

  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof UtmParams, string>>>({});

  useEffect(() => {
    generateUrl();
  }, [params]);

  const validateUrl = (url: string): boolean => {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const normalizeValue = (value: string): string => {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  };

  const generateUrl = () => {
    if (!params.baseUrl || !params.utm_source || !params.utm_medium || !params.utm_campaign) {
      setGeneratedUrl("");
      return;
    }

    if (!validateUrl(params.baseUrl)) {
      setGeneratedUrl("");
      return;
    }

    try {
      const url = new URL(params.baseUrl);
      
      // Add UTM parameters
      const utmParams: Record<string, string> = {
        utm_source: normalizeValue(params.utm_source),
        utm_medium: normalizeValue(params.utm_medium),
        utm_campaign: normalizeValue(params.utm_campaign),
      };

      if (params.utm_id) utmParams.utm_id = normalizeValue(params.utm_id);
      if (params.utm_term) utmParams.utm_term = normalizeValue(params.utm_term);
      if (params.utm_content) utmParams.utm_content = normalizeValue(params.utm_content);

      Object.entries(utmParams).forEach(([key, value]) => {
        if (value) {
          url.searchParams.set(key, value);
        }
      });

      setGeneratedUrl(url.toString());
    } catch (error) {
      setGeneratedUrl("");
    }
  };

  const handleCopy = async () => {
    if (!generatedUrl) {
      toast.error("Please generate a URL first");
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      toast.success("URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  };

  const handleInputChange = (field: keyof UtmParams, value: string) => {
    setParams((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        
        {/* Main Builder Section */}
        <section id="builder" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Build Your UTM Link
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Fill in the campaign details below to generate your tracking URL
              </p>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-8 animate-slide-up">
              {/* Input Form */}
              <Card className="p-6 shadow-xl border-border/50 hover:shadow-2xl transition-shadow duration-300 bg-card/80 backdrop-blur">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <LinkIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Campaign Details</h3>
                </div>
            
                <TooltipProvider>
                  <div className="space-y-5">
                    {/* Base URL */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="baseUrl" className="text-sm font-medium">
                          Base URL <span className="text-destructive">*</span>
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{tooltips.baseUrl}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="baseUrl"
                        placeholder="https://example.com/page"
                        value={params.baseUrl}
                        onChange={(e) => handleInputChange("baseUrl", e.target.value)}
                        className={errors.baseUrl ? "border-destructive" : ""}
                      />
                      {errors.baseUrl && (
                        <p className="text-xs text-destructive mt-1">{errors.baseUrl}</p>
                      )}
                    </div>

                    {/* UTM Source */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="utm_source" className="text-sm font-medium">
                          Campaign Source <span className="text-destructive">*</span>
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{tooltips.utm_source}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="utm_source"
                        placeholder="google, facebook, newsletter"
                        value={params.utm_source}
                        onChange={(e) => handleInputChange("utm_source", e.target.value)}
                        className={errors.utm_source ? "border-destructive" : ""}
                      />
                      {errors.utm_source && (
                        <p className="text-xs text-destructive mt-1">{errors.utm_source}</p>
                      )}
                    </div>

                    {/* UTM Medium */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="utm_medium" className="text-sm font-medium">
                          Campaign Medium <span className="text-destructive">*</span>
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{tooltips.utm_medium}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="utm_medium"
                        placeholder="cpc, email, social"
                        value={params.utm_medium}
                        onChange={(e) => handleInputChange("utm_medium", e.target.value)}
                        className={errors.utm_medium ? "border-destructive" : ""}
                      />
                      {errors.utm_medium && (
                        <p className="text-xs text-destructive mt-1">{errors.utm_medium}</p>
                      )}
                    </div>

                    {/* UTM Campaign */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="utm_campaign" className="text-sm font-medium">
                          Campaign Name <span className="text-destructive">*</span>
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{tooltips.utm_campaign}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="utm_campaign"
                        placeholder="spring_sale, product_launch"
                        value={params.utm_campaign}
                        onChange={(e) => handleInputChange("utm_campaign", e.target.value)}
                        className={errors.utm_campaign ? "border-destructive" : ""}
                      />
                      {errors.utm_campaign && (
                        <p className="text-xs text-destructive mt-1">{errors.utm_campaign}</p>
                      )}
                    </div>

                    {/* Optional Parameters */}
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
                        Optional Parameters
                      </h3>

                      <div className="space-y-4">
                        {/* UTM ID */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Label htmlFor="utm_id" className="text-sm font-medium">
                              Campaign ID
                            </Label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>{tooltips.utm_id}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            id="utm_id"
                            placeholder="campaign_123"
                            value={params.utm_id}
                            onChange={(e) => handleInputChange("utm_id", e.target.value)}
                          />
                        </div>

                        {/* UTM Term */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Label htmlFor="utm_term" className="text-sm font-medium">
                              Campaign Term
                            </Label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>{tooltips.utm_term}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            id="utm_term"
                            placeholder="running_shoes"
                            value={params.utm_term}
                            onChange={(e) => handleInputChange("utm_term", e.target.value)}
                          />
                        </div>

                        {/* UTM Content */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Label htmlFor="utm_content" className="text-sm font-medium">
                              Campaign Content
                            </Label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>{tooltips.utm_content}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            id="utm_content"
                            placeholder="header_link, sidebar_cta"
                            value={params.utm_content}
                            onChange={(e) => handleInputChange("utm_content", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TooltipProvider>
              </Card>

              {/* Preview Card */}
              <Card className="p-6 shadow-xl border-border/50 hover:shadow-2xl transition-shadow duration-300 bg-card/80 backdrop-blur">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <Copy className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Generated URL</h3>
                </div>
            
                {generatedUrl ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-secondary/10 p-4 rounded-lg border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <Check className="w-4 h-4 text-success" />
                        Your tagged URL:
                      </p>
                      <div className="break-all text-sm font-mono text-foreground bg-background p-3 rounded border border-border/50 shadow-inner">
                        {generatedUrl}
                      </div>
                    </div>

                    <Button
                      onClick={handleCopy}
                      className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                      size="lg"
                    >
                      {copied ? (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Copied to Clipboard!
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5 mr-2" />
                          Copy URL to Clipboard
                        </>
                      )}
                    </Button>

                    {/* URL Breakdown */}
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-semibold mb-3 text-muted-foreground">URL Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Base URL:</span>
                          <span className="font-medium text-foreground">{params.baseUrl}</span>
                        </div>
                        {params.utm_source && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Source:</span>
                            <span className="font-medium text-foreground">{normalizeValue(params.utm_source)}</span>
                          </div>
                        )}
                        {params.utm_medium && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Medium:</span>
                            <span className="font-medium text-foreground">{normalizeValue(params.utm_medium)}</span>
                          </div>
                        )}
                        {params.utm_campaign && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Campaign:</span>
                            <span className="font-medium text-foreground">{normalizeValue(params.utm_campaign)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <LinkIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground mb-2">Fill in the required fields to generate your URL</p>
                    <p className="text-sm text-muted-foreground">
                      Fields marked with <span className="text-destructive">*</span> are required
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section id="guide" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Card className="p-8 bg-gradient-to-br from-card/50 to-primary/5 border-primary/20 shadow-xl animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  Understanding UTM Parameters
                </h2>
                <p className="text-muted-foreground">
                  Learn how each parameter helps track your marketing campaigns
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <span className="text-xl">🎯</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-2">utm_source</h3>
                      <p className="text-sm text-muted-foreground">Identifies where your traffic is coming from (e.g., google, newsletter, facebook).</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <span className="text-xl">📱</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-accent mb-2">utm_medium</h3>
                      <p className="text-sm text-muted-foreground">The marketing medium (e.g., cpc for paid ads, email, social media).</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <span className="text-xl">🚀</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-success mb-2">utm_campaign</h3>
                      <p className="text-sm text-muted-foreground">The specific campaign name (e.g., spring_sale, product_launch_2025).</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <span className="text-xl">🔍</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-2">utm_term</h3>
                      <p className="text-sm text-muted-foreground">For paid search campaigns, track specific keywords that triggered your ads.</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <span className="text-xl">✨</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-accent mb-2">utm_content</h3>
                      <p className="text-sm text-muted-foreground">Differentiates similar content or links within the same ad (A/B testing).</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <span className="text-xl">🆔</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-success mb-2">utm_id</h3>
                      <p className="text-sm text-muted-foreground">Campaign ID for advanced tracking in analytics platforms and CRM systems.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UtmBuilder;
