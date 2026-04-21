import * as Sharing from 'expo-sharing';

export async function shareFile(uri: string): Promise<void> {
  const available = await Sharing.isAvailableAsync();
  if (!available) throw new Error('공유 기능을 사용할 수 없어요');
  await Sharing.shareAsync(uri, { UTI: uri.endsWith('.pdf') ? 'com.adobe.pdf' : 'public.image' });
}
