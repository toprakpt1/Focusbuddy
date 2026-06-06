import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Switch, Linking, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '../src/components/ui/Text';
import { Card } from '../src/components/ui/Card';
import { useSettingsStore, type FocusDuration } from '../src/stores/useSettingsStore';
import { useTimerStore } from '../src/stores/useTimerStore';
import { useTheme } from '../src/constants/theme';
import { cancelAllAppNotifications, ensureNotificationPermissions } from '../src/services/notifications';
import {
    Globe,
    Bell,
    BellOff,
    Monitor,
    Clock,
    Wrench,
    Lightbulb,
    Info,
    FileText,
    ChevronLeft
} from 'lucide-react-native';

const FOCUS_OPTIONS: { value: FocusDuration; labelKey: string }[] = [
    { value: 0.16666666666666666, labelKey: 'settings.duration_10s' },
    { value: 25, labelKey: 'settings.duration_25' },
    { value: 45, labelKey: 'settings.duration_45' },
    { value: 60, labelKey: 'settings.duration_60' },
];

export default function SettingsScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { t } = useTranslation();
    const {
        language,
        setLanguage,
        notificationsEnabled,
        setNotificationsEnabled,
        keepScreenOn,
        setKeepScreenOn,
        focusDuration,
        setFocusDuration,
        appVersion,
    } = useSettingsStore();
    const { status, setPhase } = useTimerStore();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.backgrounds.main,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md,
            gap: theme.spacing.lg,
            backgroundColor: theme.colors.backgrounds.cardSolid,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.ui.border,
        },
        backButton: {
            padding: theme.spacing.sm,
            borderRadius: theme.radius.full,
            backgroundColor: theme.colors.backgrounds.subtle,
            borderWidth: 1,
            borderColor: theme.colors.ui.border,
        },
        headerTitle: {
            flex: 1,
        },
        content: {
            padding: theme.spacing.lg,
            gap: theme.spacing.lg,
        },
        section: {
            gap: theme.spacing.md,
        },
        sectionTitle: {
            marginLeft: theme.spacing.sm,
            letterSpacing: 1.2,
        },
        card: {
            gap: theme.spacing.md,
        },
        settingRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: theme.spacing.md,
        },
        settingLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.md,
        },
        iconWrapper: {
            width: 40,
            height: 40,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.backgrounds.subtle,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.colors.ui.border,
        },
        divider: {
            height: 1,
            backgroundColor: theme.colors.ui.border,
            marginVertical: theme.spacing.xs,
        },
        optionsRow: {
            flexDirection: 'row',
            gap: theme.spacing.sm,
            marginTop: theme.spacing.sm,
        },
        pillsRow: {
            flexDirection: 'row',
            flexWrap: 'wrap' as const,
            gap: theme.spacing.sm,
            marginTop: theme.spacing.sm,
        },
        optionButton: {
            flex: 1,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.sm,
            borderRadius: theme.radius.lg,
            borderWidth: 2,
            borderColor: 'transparent',
            alignItems: 'center',
            backgroundColor: theme.colors.backgrounds.subtle,
        },
        optionButtonSelected: {
            borderColor: theme.colors.primary.cat,
            backgroundColor: theme.colors.backgrounds.cardSolid,
        },
        pill: {
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: theme.radius.full,
            borderWidth: 1,
            borderColor: theme.colors.ui.border,
            backgroundColor: theme.colors.backgrounds.subtle,
        },
        pillSelected: {
            borderColor: theme.colors.primary.cat,
            backgroundColor: theme.colors.backgrounds.cardSolid,
        },
        chip: {
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: theme.radius.full,
            borderWidth: 1,
            borderColor: theme.colors.ui.border,
            backgroundColor: theme.colors.backgrounds.subtle,
        },
        chipSelected: {
            borderColor: theme.colors.primary.cat,
            backgroundColor: theme.colors.backgrounds.cardSolid,
        },
        actionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.md,
            paddingVertical: theme.spacing.md,
        },
        premiumCard: {
            gap: theme.spacing.md,
            paddingVertical: theme.spacing.lg,
            borderWidth: 1,
            borderColor: theme.colors.ui.border,
            backgroundColor: theme.colors.backgrounds.cardSolid,
        },
        premiumHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        premiumHeaderLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.md,
            flex: 1,
        },
        premiumBadge: {
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: theme.radius.full,
            backgroundColor: theme.colors.backgrounds.subtle,
            borderWidth: 1,
            borderColor: theme.colors.accents.xp,
        },
        benefits: {
            gap: 10,
        },
        benefitRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        ctaRow: {
            marginTop: theme.spacing.sm,
        },
    }), [theme]);

    const handleContactSupport = () => {
        const subject = language === 'tr' ? 'Sorun+Bildirimi' : 'Issue+Report';
        Linking.openURL(`mailto:toprakpt1@protonmail.com?subject=${subject}`);
    };

    const handleSuggestFeature = () => {
        const subject = language === 'tr' ? 'Öneri' : 'Feature+Suggestion';
        Linking.openURL(`mailto:toprakpt1@protonmail.com?subject=${subject}`);
    };

    const handleTermsOfUse = () => {
        router.push('/terms');
    };

    const handleOpenGithub = () => {
        Linking.openURL('https://github.com/toprakpt1');
    };

    const handleNotificationsChange = async (value: boolean) => {
        if (value) {
            const granted = await ensureNotificationPermissions();

            if (!granted) {
                Alert.alert(
                    t('settings.notifications_denied_title'),
                    t('settings.notifications_denied_desc')
                );
                setNotificationsEnabled(false);
                return;
            }

            setNotificationsEnabled(true);
            return;
        }

        setNotificationsEnabled(false);
        if (!keepScreenOn) {
            setKeepScreenOn(true);
        }
        await cancelAllAppNotifications();
    };

    const handleKeepScreenOnChange = async (value: boolean) => {
        if (value) {
            setKeepScreenOn(true);
            return;
        }

        if (!notificationsEnabled) {
            const granted = await ensureNotificationPermissions();

            if (!granted) {
                Alert.alert(
                    t('settings.notifications_required_title'),
                    t('settings.notifications_required_desc')
                );
                return;
            }

            setNotificationsEnabled(true);
        }

        setKeepScreenOn(false);
    };

    const handleSetFocusDuration = (value: FocusDuration) => {
        if (value === focusDuration) return;

        if (status !== 'idle' && status !== 'completed') {
            Alert.alert(
                t('settings.timer_not_finished_title'),
                t('settings.timer_not_finished_desc'),
                [
                    { text: t('common.cancel'), style: 'cancel' },
                    {
                        text: t('settings.yes_set'),
                        onPress: () => {
                            setFocusDuration(value);
                            setPhase('work');
                        },
                    },
                ]
            );
        } else {
            setFocusDuration(value);
            setPhase('work');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color={theme.colors.text.primary} />
                </Pressable>
                <View style={styles.headerTitle}>
                    <Text size="xl" weight="bold">
                        {t('common.settings')}
                    </Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Genel Ayarlar */}
                <View style={styles.section}>
                    <Text size="sm" weight="semibold" color={theme.colors.text.secondary} style={styles.sectionTitle}>
                        {t('settings.general')}
                    </Text>
                    <Card style={styles.card}>
                        {/* Dil */}
                        <View style={styles.settingRow}>
                            <View style={styles.settingLeft}>
                                <View style={styles.iconWrapper}>
                                    <Globe size={20} color={theme.colors.primary.cat} />
                                </View>
                                <View>
                                    <Text weight="semibold">{t('settings.language')}</Text>
                                    <Text size="sm" color={theme.colors.text.secondary}>
                                        {language === 'tr' ? t('settings.lang_tr') : t('settings.lang_en')}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.optionsRow}>
                                <Pressable
                                    onPress={() => setLanguage('tr')}
                                    hitSlop={6}
                                    style={[
                                        styles.chip,
                                        language === 'tr' && styles.chipSelected,
                                    ]}
                                >
                                    <Text
                                        size="sm"
                                        weight={language === 'tr' ? 'semibold' : 'medium'}
                                        color={language === 'tr' ? theme.colors.primary.cat : theme.colors.text.secondary}
                                    >
                                        TR
                                    </Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => setLanguage('en')}
                                    hitSlop={6}
                                    style={[
                                        styles.chip,
                                        language === 'en' && styles.chipSelected,
                                    ]}
                                >
                                    <Text
                                        size="sm"
                                        weight={language === 'en' ? 'semibold' : 'medium'}
                                        color={language === 'en' ? theme.colors.primary.cat : theme.colors.text.secondary}
                                    >
                                        EN
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Odaklanma Suresi */}
                        <View>
                            <View style={styles.settingRow}>
                                <View style={styles.settingLeft}>
                                    <View style={styles.iconWrapper}>
                                        <Clock size={20} color={theme.colors.primary.cat} />
                                    </View>
                                    <Text weight="semibold">{t('settings.focus_duration')}</Text>
                                </View>
                            </View>
                            <View style={styles.pillsRow}>
                                {FOCUS_OPTIONS.map((opt) => (
                                    <Pressable
                                        key={opt.value}
                                        onPress={() => handleSetFocusDuration(opt.value)}
                                        hitSlop={6}
                                        style={({ pressed }) => ([
                                            styles.pill,
                                            focusDuration === opt.value && styles.pillSelected,
                                            pressed && { opacity: 0.85 },
                                        ])}
                                    >
                                        <Text
                                            size="sm"
                                            weight={focusDuration === opt.value ? 'semibold' : 'medium'}
                                            color={focusDuration === opt.value ? theme.colors.primary.cat : theme.colors.text.secondary}
                                            align="center"
                                        >
                                            {t(opt.labelKey)}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Bildirimler */}
                        <View style={styles.settingRow}>
                            <View style={styles.settingLeft}>
                                <View style={styles.iconWrapper}>
                                    {notificationsEnabled ? (
                                        <Bell size={20} color={theme.colors.primary.cat} />
                                    ) : (
                                        <BellOff size={20} color={theme.colors.text.secondary} />
                                    )}
                                </View>
                                <View>
                                    <Text weight="semibold">{t('settings.notifications')}</Text>
                                    <Text size="sm" color={theme.colors.text.secondary}>
                                        {t('settings.notifications_desc')}
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={handleNotificationsChange}
                                trackColor={{ false: theme.colors.ui.disabled, true: theme.colors.primary.cat }}
                                thumbColor={'#ffffff'}
                            />
                        </View>

                        <View style={styles.divider} />

                        {/* Ekran Hep Acik */}
                        <View style={styles.settingRow}>
                            <View style={styles.settingLeft}>
                                <View style={styles.iconWrapper}>
                                    <Monitor size={20} color={theme.colors.primary.cat} />
                                </View>
                                <View>
                                    <Text weight="semibold">{t('settings.screen_always_on')}</Text>
                                    <Text size="sm" color={theme.colors.text.secondary}>
                                        {t('settings.screen_always_on_desc')}
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={keepScreenOn}
                                onValueChange={handleKeepScreenOnChange}
                                trackColor={{ false: theme.colors.ui.disabled, true: theme.colors.primary.cat }}
                                thumbColor={'#ffffff'}
                            />
                        </View>
                    </Card>
                </View>

                {/* Destek & Geri Bildirim */}
                <View style={styles.section}>
                    <Text size="sm" weight="semibold" color={theme.colors.text.secondary} style={styles.sectionTitle}>
                        {t('settings.support_feedback')}
                    </Text>
                    <Card style={styles.card}>
                        {/* Sorun Bildir */}
                        <Pressable onPress={handleContactSupport} style={styles.actionButton}>
                            <View style={styles.iconWrapper}>
                                <Wrench size={20} color={theme.colors.primary.cat} />
                            </View>
                            <Text weight="semibold">{t('settings.report_issue')}</Text>
                        </Pressable>

                        <View style={styles.divider} />

                        {/* Öneride Bulun */}
                        <Pressable onPress={handleSuggestFeature} style={styles.actionButton}>
                            <View style={styles.iconWrapper}>
                                <Lightbulb size={20} color={theme.colors.accents.xp} />
                            </View>
                            <Text weight="semibold">{t('settings.suggest_feature')}</Text>
                        </Pressable>
                    </Card>
                </View>

                {/* Hakkinda */}
                <View style={styles.section}>
                    <Text size="sm" weight="semibold" color={theme.colors.text.secondary} style={styles.sectionTitle}>
                        {t('settings.about')}
                    </Text>
                    <Card style={styles.card}>
                        {/* Surum */}
                        <View style={styles.settingRow}>
                            <View style={styles.settingLeft}>
                                <View style={styles.iconWrapper}>
                                    <Info size={20} color={theme.colors.primary.cat} />
                                </View>
                                <Text weight="semibold">{t('settings.version')}</Text>
                            </View>
                            <Text color={theme.colors.text.secondary}>V{appVersion}</Text>
                        </View>

                        <View style={styles.divider} />

                        {/* Kullanim Kosullari */}
                        <Pressable onPress={handleTermsOfUse} style={styles.actionButton}>
                            <View style={styles.iconWrapper}>
                                <FileText size={20} color={theme.colors.primary.cat} />
                            </View>
                            <Text weight="semibold">{t('settings.terms')}</Text>
                        </Pressable>

                        <View style={styles.divider} />

                        <Pressable onPress={handleOpenGithub} style={styles.actionButton}>
                            <View style={styles.iconWrapper}>
                                <Globe size={20} color={theme.colors.primary.cat} />
                            </View>
                            <Text weight="semibold">{t('settings.github')}</Text>
                        </Pressable>
                    </Card>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
