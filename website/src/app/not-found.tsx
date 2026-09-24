import { ButtonLink, Container } from "@/components/ui";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// GitHub Pages serves this page for every unknown URL. The demo app lives under
// /app/ and routes on the client, so a refresh on e.g. /app/report/r1 lands
// here — send those visitors back into the demo.
const demoRedirect = `(function(){var p=${JSON.stringify(`${basePath}/app/`)};var l=window.location;if(l.pathname.indexOf(p)===0&&l.pathname!==p){l.replace(p);}})();`;

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <script dangerouslySetInnerHTML={{ __html: demoRedirect }} />
      <p className="text-sm font-semibold text-blue-700">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-3 text-slate-600">The page you&apos;re looking for doesn&apos;t exist.</p>
      <ButtonLink href="/" className="mt-8">
        Back to home
      </ButtonLink>
    </Container>
  );
}
