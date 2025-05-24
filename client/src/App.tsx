import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MenuPage from "@/pages/menu";
import AdminPage from "@/pages/admin";
import NotFound from "@/pages/not-found";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Utensils, Settings } from "lucide-react";

function Navigation() {
  const [activeTab, setActiveTab] = useState<"menu" | "admin">("menu");

  return (
    <>
      {/* Fixed Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-golden/20">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex space-x-1 bg-white/80 rounded-xl p-1 shadow-lg">
            <Button
              variant={activeTab === "menu" ? "default" : "ghost"}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === "menu" 
                  ? "bg-saffron text-white hover:bg-saffron/90" 
                  : "text-saffron hover:bg-saffron/10"
              }`}
              onClick={() => setActiveTab("menu")}
            >
              <Utensils className="w-4 h-4 mr-2" />
              Menu
            </Button>
            <Button
              variant={activeTab === "admin" ? "default" : "ghost"}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === "admin" 
                  ? "bg-saffron text-white hover:bg-saffron/90" 
                  : "text-saffron hover:bg-saffron/10"
              }`}
              onClick={() => setActiveTab("admin")}
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </div>
        </div>
      </div>

      {/* Content with top padding for fixed nav */}
      <div className="pt-20">
        {activeTab === "menu" ? <MenuPage /> : <AdminPage />}
      </div>
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Navigation} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
