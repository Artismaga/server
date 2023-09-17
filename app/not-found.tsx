import { NothingFound } from '@/components/error-pages';
import { SiteHeader, SiteFooter } from './providers';

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <div style={{height: 'calc(100vh - 60px - 66px)'}}>
          <NothingFound />
          <title>Not Found - Artismaga</title>
      </div>
      <SiteFooter />
    </>
  );
}