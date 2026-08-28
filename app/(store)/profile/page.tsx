import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getFullUserProfileDataAction } from '@/app/actions/profile.actions';
import { ProfileClientView } from '@/components/profile/profile-client-view';

export const metadata: Metadata = {
  title: 'Mi Perfil Gamer | ViniGames',
  description: 'Gestiona tu perfil, nivel de experiencia, biblioteca de juegos y Gamer DNA en ViniGames.',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?returnUrl=/profile');
  }

  const profileData = await getFullUserProfileDataAction();

  if (!profileData) {
    redirect('/login?returnUrl=/profile');
  }

  return (
    <div className="min-h-screen bg-[#080A13] pb-16">
      <ProfileClientView initialData={profileData} />
    </div>
  );
}
