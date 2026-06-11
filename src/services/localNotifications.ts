import { NativeModules, Platform } from 'react-native';
import i18n from '../translate/i18n';

const NATIVE = NativeModules.NotificationScheduler;

const DEFAULT_CHANNEL_ID = 'default';
const DEFAULT_CHANNEL_NAME = 'General';
const TIMER_NOTIFICATION_ID = 1000;
const STREAK_NOTIFICATION_ID = 2000;

type TimerNotificationPhase = 'work' | 'shortBreak' | 'longBreak';
type DailyHistory = Record<string, { count: number; duration: number }>;

// ── Helpers ──────────────────────────────────────────────────────────────────

function getNotificationBodyForPhase(phase: TimerNotificationPhase) {
    if (phase === 'work') {
        return {
            title: i18n.t('notifications.focus_complete_title'),
            body: i18n.t('notifications.focus_complete_body'),
        };
    }
    return {
        title: i18n.t('notifications.break_complete_title'),
        body: i18n.t(
            phase === 'longBreak'
                ? 'notifications.long_break_complete_body'
                : 'notifications.short_break_complete_body'
        ),
    };
}

const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// ── Public API ───────────────────────────────────────────────────────────────

export async function ensureNotificationPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android' || !NATIVE) return false;

    const granted = await NATIVE.checkPermission();
    if (granted) {
        await NATIVE.createChannel(DEFAULT_CHANNEL_ID, DEFAULT_CHANNEL_NAME);
        return true;
    }

    const result = await NATIVE.requestPermission();
    if (result) {
        await NATIVE.createChannel(DEFAULT_CHANNEL_ID, DEFAULT_CHANNEL_NAME);
    }
    return result;
}

export async function scheduleTimerCompletionNotification({
    phase,
    secondsUntilTrigger,
}: {
    phase: TimerNotificationPhase;
    secondsUntilTrigger: number;
}): Promise<void> {
    if (Platform.OS !== 'android' || !NATIVE) return;
    if (secondsUntilTrigger <= 0) return;

    const hasPermission = await ensureNotificationPermissions();
    if (!hasPermission) return;

    // Cancel any existing timer notification first
    await NATIVE.cancel(TIMER_NOTIFICATION_ID);

    const content = getNotificationBodyForPhase(phase);

    await NATIVE.schedule(
        TIMER_NOTIFICATION_ID,
        content.title,
        content.body,
        DEFAULT_CHANNEL_ID,
        secondsUntilTrigger * 1000
    );
}

export async function cancelTimerCompletionNotifications(): Promise<void> {
    if (Platform.OS !== 'android' || !NATIVE) return;
    await NATIVE.cancel(TIMER_NOTIFICATION_ID);
}

export async function scheduleStreakReminder({
    history,
    streak,
}: {
    history: DailyHistory;
    streak: number;
}): Promise<void> {
    if (Platform.OS !== 'android' || !NATIVE) return;

    // Cancel any existing streak reminder
    await NATIVE.cancel(STREAK_NOTIFICATION_ID);

    if (streak <= 0) return;

    const hasPermission = await ensureNotificationPermissions();
    if (!hasPermission) return;

    const today = new Date();
    const todayKey = formatDateKey(today);
    const hasFocusedToday = (history[todayKey]?.count ?? 0) > 0;

    const reminderAt = new Date();
    reminderAt.setHours(20, 0, 0, 0); // 8 PM

    if (hasFocusedToday || reminderAt.getTime() <= Date.now()) {
        reminderAt.setDate(reminderAt.getDate() + 1);
    }

    const delayMs = reminderAt.getTime() - Date.now();
    if (delayMs <= 0) return;

    await NATIVE.schedule(
        STREAK_NOTIFICATION_ID,
        i18n.t('notifications.streak_title'),
        i18n.t('notifications.streak_body', { streak }),
        DEFAULT_CHANNEL_ID,
        delayMs
    );
}

export async function cancelAllAppNotifications(): Promise<void> {
    if (Platform.OS !== 'android' || !NATIVE) return;
    await NATIVE.cancelAll();
}
