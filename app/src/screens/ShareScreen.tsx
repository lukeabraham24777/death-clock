import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Share,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import { theme } from '../theme';
import { RootStackParamList } from '../types';
import ShareCard from '../components/ShareCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Share'>;

export default function ShareScreen({ navigation, route }: Props) {
  const { prediction } = route.params;
  const [copied, setCopied] = useState(false);

  const deathDate = new Date(prediction.deathDate);
  const formattedDate = deathDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Build the share message
  const shareText =
    `My predicted death date is ${formattedDate}.\n` +
    `${prediction.daysRemaining.toLocaleString()} days remaining.\n` +
    `Longevity score: ${prediction.longevityScore}/100\n\n` +
    `How long will you live? Find out with Death Clock.`;

  // Share via native share sheet (works in Expo Go on iOS/Android)
  const handleShare = async () => {
    try {
      await Share.share({
        message: shareText,
        title: 'My Death Clock Result',
      });
    } catch (error) {
      // Fallback to clipboard if share fails
      await handleCopy();
    }
  };

  // Copy to clipboard (works everywhere including web)
  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      if (Platform.OS !== 'web') {
        Alert.alert('Copied!', 'Your result has been copied to clipboard.');
      }
    } catch {
      Alert.alert('Error', 'Failed to copy. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SHARE YOUR RESULT</Text>
      <Text style={styles.subtitle}>
        Show your friends how much time you have left
      </Text>

      {/* Visual preview of the share card */}
      <View style={styles.cardWrapper}>
        <ShareCard prediction={prediction} />
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Text style={styles.shareButtonText}>SHARE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.copyButton}
          onPress={handleCopy}
          activeOpacity={0.8}
        >
          <Text style={styles.copyButtonText}>
            {copied ? 'COPIED!' : 'COPY TO CLIPBOARD'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>BACK TO DASHBOARD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    letterSpacing: 4,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  cardWrapper: {
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  actions: {
    marginTop: theme.spacing.xl,
  },
  shareButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  shareButtonText: {
    color: theme.colors.background,
    fontWeight: '700',
    fontSize: theme.fontSize.md,
    letterSpacing: 2,
  },
  copyButton: {
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  copyButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: theme.fontSize.sm,
    letterSpacing: 2,
  },
  backButton: {
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  backButtonText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
    fontSize: theme.fontSize.sm,
    letterSpacing: 2,
  },
});
