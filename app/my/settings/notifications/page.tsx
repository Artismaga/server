"use client";
import { Button, Modal, createStyles, rem, Group, PinInput, Divider, Paper,
    Text, Select, Switch, Center, Loader, ScrollArea, Input, Title, Slider
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const useStyles = createStyles((theme) => ({
    settingsArea: {
        width: '65%',
        paddingLeft: theme.spacing.xs,
        paddingRight: theme.spacing.xs,
        paddingTop: theme.spacing.xl,
    },

    settingsContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: theme.spacing.md
    },
}));

export default function Page() {
    const session = useSession();
    const { classes, theme } = useStyles();

    const user = session.data?.user;
    const [settings, setSettings] = useState(user?.settings || {});

    if (session.status !== 'authenticated') {
        return (
            <Center h="100%">
                <Loader size={120} variant="dots" />
            </Center>
        )
    }
    return (
        <>
            <ScrollArea h="100%">
                <div className={classes.settingsContainer}>
                    <div className={classes.settingsArea}>
                        <Title>Push Notifications</Title>
                        <Switch
                            label="Work notifications"
                            description="Receive notifications when a work you bookmarked has been updated."
                            checked={(settings.workNotifications !== undefined) ? settings.workNotifications : true}
                            onChange={(value) => {
                                setSettings(prev => ({ ...prev, workNotifications: value.currentTarget.checked }));
                            }}
                            mt="sm"
                        />
                        <Switch
                            label="Studio notifications"
                            description="Receive studio-related notifications for works you are a part of."
                            checked={settings.studioNotifications || false}
                            onChange={(value) => {
                                setSettings(prev => ({ ...prev, studioNotifications: value.currentTarget.checked }));
                            }}
                            mt="sm"
                        />
                        <Title>Email Notifications</Title>
                        <Switch
                            label="Announcement emails"
                            description="Receive emails when new announcements are posted."
                            checked={(settings.announcementEmails !== undefined) ? settings.announcementEmails : true}
                            onChange={(value) => {
                                setSettings(prev => ({ ...prev, announcementEmails: value.currentTarget.checked }));
                            }}
                            mt="sm"
                        />
                        <Select
                            label="Work emails"
                            description="Receive emails when a work you bookmarked has been updated."
                            data={[
                                { value: 'never', label: 'Never' },
                                { value: 'hourly', label: 'Hourly' },
                                { value: 'daily', label: 'Daily' },
                                { value: 'weekly', label: 'Weekly' },
                            ]}
                            value={settings.workEmails || 'hourly'}
                            onChange={(value) => {
                                setSettings(prev => ({ ...prev, workEmails: value }));
                            }}
                            mt="sm"
                        />
                        <Select
                            label="Work recommendation emails"
                            description="Receive emails recommending works we think you may be interested in"
                            data={[
                                { value: 'never', label: 'Never' },
                                { value: 'daily', label: 'Daily' },
                                { value: 'weekly', label: 'Weekly' },
                            ]}
                            value={settings.workRecommendations || 'daily'}
                            onChange={(value) => {
                                setSettings(prev => ({ ...prev, workRecommendations: value }));
                            }}
                            mt="sm"
                        />
                        <Select
                            label="Work milestone emails"
                            description="Receive emails when a work you are a part of reaches a milestone"
                            data={[
                                { value: 'never', label: 'Never' },
                                { value: 'daily', label: 'Daily' },
                                { value: 'weekly', label: 'Weekly' },
                            ]}
                            value={settings.workMilestones || 'daily'}
                            onChange={(value) => {
                                setSettings(prev => ({ ...prev, workMilestones: value }));
                            }}
                            mt="sm"
                        />
                    </div>
                </div>
            </ScrollArea>
        </>
    )
}