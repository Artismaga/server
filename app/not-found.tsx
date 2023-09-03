import { NothingFound } from './error-pages';

export default function NotFound() {
  return (
    <div style={{height: 'calc(100vh - 60px - 66px)'}}>
        <NothingFound />
        <title>Not Found - Artismaga</title>
    </div>
  );
}