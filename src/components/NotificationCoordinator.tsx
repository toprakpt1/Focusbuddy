import { useEffect } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useTimerStore } from '../stores/useTimerStore';
import { useUserStore } from '../stores/useUserStore';
import {
    cancelAllAppNotifications,
    cancelTimerCompletionNotifications,
    scheduleStreakReminder,
    scheduleTimerCompletionNotification,
} from '../services/localNotifications';

export function NotificationCoordinator() {
    const notificationsEnabled = useSettingsStore((state) => state.notificationsEnabled);
    const keepScreenOn = useSettingsStore((state) => state.keepScreenOn);
    const timerStatus = useTimerStore((state) => state.status);
    const timerPhase = useTimerStore((state) => state.phase);
    const timerStartTimestamp = useTimerStore((state) => state.startTimestamp);
    const history = useUserStore((state) => state.history);
    const streak = useUserStore((state) => state.streak);

    useEffect(() => {
        if (!notificationsEnabled) {
            cancelAllAppNotifications();
            return;
        }

        scheduleStreakReminder({ history, streak });
    }, [history, notificationsEnabled, streak]);

    useEffect(() => {
        if (!notificationsEnabled || keepScreenOn || timerStatus !== 'running') {
            cancelTimerCompletionNotifications();
            return;
        }

        const timeLeft = useTimerStore.getState().timeLeft;

        scheduleTimerCompletionNotification({
            phase: timerPhase,
            secondsUntilTrigger: timeLeft,
        });
    }, [keepScreenOn, notificationsEnabled, timerPhase, timerStartTimestamp, timerStatus]);

    return null;
}
