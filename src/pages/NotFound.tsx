import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-8">
        <BrandMark />
      </div>
      <p className="font-mono text-xs text-muted-foreground mb-2">404 · NOT FOUND</p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
        Page does not exist
      </h1>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        The route <code className="font-mono text-foreground">{location.pathname}</code> could not
        be found.
      </p>
      <Link to="/">
        <Button variant="outline" size="sm">
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Return Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
