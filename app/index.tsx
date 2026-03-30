import { Redirect } from 'expo-router';

// Root entry: send users into the auth stack first; AuthLayout redirects to tabs when already signed in.
export default function Index() {
  return <Redirect href="/(auth)" />;
}
