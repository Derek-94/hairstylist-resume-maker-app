import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { RefObject } from 'react';
import { View } from 'react-native';

export async function saveResumeImages(
  name: string,
  page1Ref: RefObject<View | null>,
  page2Ref?: RefObject<View | null>,
): Promise<string[]> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') throw new Error('PHOTOS_PERMISSION_DENIED');

  const uris: string[] = [];

  if (page1Ref.current) {
    const uri = await captureRef(page1Ref, { format: 'png', quality: 1, scale: 2 });
    await MediaLibrary.saveToLibraryAsync(uri);
    uris.push(uri);
  }

  if (page2Ref?.current) {
    const uri = await captureRef(page2Ref, { format: 'png', quality: 1, scale: 2 });
    await MediaLibrary.saveToLibraryAsync(uri);
    uris.push(uri);
  }

  return uris;
}
