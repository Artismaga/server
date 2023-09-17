import { NothingFound } from '@/app/error-pages';
import Home from '../home';

export default function Page({ params }: { params: { user: string } }) {
  const user = decodeURIComponent(params.user);

  if (!user.startsWith('@')) {
    return (
        <div style={{height: 'calc(100vh - 60px - 66px)'}}>
            <NothingFound />
            <title>Not Found - Artismaga</title>
        </div>
    )
  } else {
    return <Home /> // User profiles not yet implemented
  }
}
