"use client";
import { Button, Modal, createStyles, rem, Group, PinInput, Divider, Paper,
    Text, Select, Switch, Center, Loader, ScrollArea, Input, Title, Slider
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { IconAlertCircle } from "@tabler/icons-react";

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

    const [sessions, setSessions] = useState([{
        id: 'THIS_SESSION',
        platform: 'Browser on Windows',
        location: 'Unknown',
        lastUsed: new Date().toISOString(),
    }])

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
                        <Title order={2}>2 Factor Authentication</Title>
                        <Paper
                            p="sm"
                            withBorder
                            mt="sm"
                            mb="sm"
                        >
                            <Text>Introduce an extra layer of security for your account with 2 Factor Authentication at login, account recovery, and during critical tasks</Text>
                            <br/>
                            <Group dir="row" position="apart">
                                <IconAlertCircle size={rem(30)} color={theme.colors.red[6]} />
                                <Text weight={800} size="md" w={`calc(100% - calc(${rem(30)} + 1rem))`}>Never share your security codes with anyone. This can include things like screensharing, texting your code, etc.
                                Do not change security settings at someone else's request. We will never ask you for your codes or to change settings to prove
                                account ownership.</Text>
                            </Group>
                        </Paper>
                        <Paper
                            p="sm"
                            withBorder
                            mt="sm"
                            mb="sm"
                        >
                            <Switch
                                label="Authenticator App"
                                description="Download an app on your phone to generate unique security codes. We suggest apps like Google Authenticator, Microsoft Authenticator, and Twilio's Authy."
                                checked={settings.authenticatorApp}
                                onChange={(value) => {
                                    // TODO: Prompt authenticator setup if enabling
                                    // TODO: Prompt authenticator if removing
                                    setSettings({ ...settings, authenticatorApp: value.currentTarget.checked });
                                }}
                            />
                        </Paper>
                        <Paper
                            p="sm"
                            withBorder
                            mt="sm"
                            mb="sm"
                        >
                            <Switch
                                label="Email"
                                description="Send a unique code to your email address to verify your account."
                                checked={settings.emailSecurity}
                                onChange={(value) => {
                                    setSettings({ ...settings, emailSecurity: value.currentTarget.checked });
                                }}
                            />
                        </Paper>
                        <Paper
                            p="sm"
                            withBorder
                            mt="sm"
                            mb="sm"
                        >
                            <Title order={3}>Security Keys</Title>
                            <Group w="100%">
                                <Text sx={{flexGrow: 1}}>A hardware security key or device's biometrics like fingerprint or facial recognition.</Text>
                                <Button
                                    variant="subtle"
                                >
                                    Manage Keys
                                </Button>
                            </Group>
                        </Paper>
                        <Paper
                            p="sm"
                            withBorder
                            mt="sm"
                            mb="sm"
                        >
                            <Title order={3}>Backup Codes</Title>
                            <Text size="xs" color="dimmed" mb="xl">You have 0 unused backup codes</Text>
                            <Group w="100%">
                                <Text sx={{flexGrow: 1}}>Generate and use backup codes in case you lose access to your 2 Factor Authentication option.<br/>Never share these backup codes with anyone.</Text>
                                <Button
                                    variant="subtle"
                                >
                                    Generate
                                </Button>
                            </Group>
                        </Paper>
                        <Title order={2}>Active Sessions</Title>
                        <Text color="dimmed">These are all of the sessions that are currently active for your account.</Text>
                        {
                            sessions.map((sess) => {
                                return (
                                    <Paper
                                        p="sm"
                                        withBorder
                                        mt="sm"
                                        mb="sm"
                                    >
                                        <Title order={4}>{sess.platform}</Title>
                                        <Text mt="sm" color="dimmed">{sess.location}</Text>
                                        <Group w="100%" dir="row">
                                            <Text sx={{flexGrow: 1}} color="dimmed">{new Date(sess.lastUsed).toLocaleString()}</Text>
                                            <Button color="red" variant="subtle">Revoke</Button>
                                        </Group>
                                    </Paper>
                                )
                            })
                        }
                    </div>
                </div>
            </ScrollArea>
        </>
    )
}