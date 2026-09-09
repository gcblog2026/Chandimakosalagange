import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PortfolioPage from "@/pages/Portfolio";
import BlogPage from "@/pages/Blog";
import InstagramPage from "@/pages/Instagram";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Switch>
            <Route path="/" component={PortfolioPage} />
            <Route path="/blog" component={BlogPage} />
            <Route path="/instagram" component={InstagramPage} />
            <Route component={PortfolioPage} />
          </Switch>
        </Router>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
