// This is the root page, which will now be part of a route group
// to apply the main layout. We are redirecting it to the new home page.
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/home');
}
