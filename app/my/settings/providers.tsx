"use client";
import { createStyles, Header, Group, Button, Autocomplete, Burger, Drawer, Divider, ScrollArea, Box, Anchor, ActionIcon, ColorScheme, rem, Title } from "@mantine/core";
import { getCookie, setCookie } from "cookies-next";
import { usePathname } from 'next/navigation';
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Link from 'next/link';
import {
    IconBellRinging,
    IconFingerprint,
    IconKey,
    IconSettings,
    Icon2fa,
    IconDatabaseImport,
    IconReceipt2,
    IconLogout,
    IconUser,
    IconCreditCard,
} from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
    logo: {
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },

    navbar: {
        height: '100%',
        width: rem(300),
        padding: theme.spacing.md,
        display: 'flex',
        flexDirection: 'column',
        borderRight: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    },

    navbarMain: {
        flex: 1,
    },

    header: {
        paddingBottom: theme.spacing.md,
        marginBottom: `calc(${theme.spacing.md} * 1.5)`,
        borderBottom: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    },

    footer: {
        paddingTop: theme.spacing.md,
        marginTop: theme.spacing.md,
        borderTop: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    },

    link: {
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        fontSize: theme.fontSizes.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,

            linkIcon: {
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            },
        },

        '&[data-active]': {
            '&, &:hover': {
                backgroundColor: theme.colors.blue[6],
                color: theme.white,

                linkIcon: {
                    color: theme.white,
                },
            },
        },
    },

    linkIcon: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
        marginRight: theme.spacing.sm,
        width: rem(25),
        height: rem(25),
    },
}));

const navList = [
    { link: '/my/settings', label: 'Account', icon: IconUser },
    { link: '/my/settings/security', label: 'Security', icon: IconFingerprint },
    { link: '/my/settings/notifications', label: 'Notifications', icon: IconBellRinging },
    { link: '/my/settings/billing', label: 'Billing', icon: IconCreditCard },
    { link: '/my/settings', label: 'Other Settings', icon: IconSettings },
];

function NavBar() {
    const { classes } = useStyles();
    const pathname = usePathname();
    const active = navList[navList.findIndex((item) => item.link === pathname)].label;

    const links = navList.map((item) => (
        <Link
            className={classes.link}
            data-active={item.label === active || undefined}
            href={item.link}
            key={item.label}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </Link>
    ));

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Group className={classes.header} sx={{justifyContent: "space-between"}}>
                    <Link className={classes.logo} href="/"><Title order={2}>Artismaga</Title></Link>
                </Group>
                {links}
            </div>

            <div className={classes.footer}>
                <a style={{cursor: "pointer"}} className={classes.link} onClick={(event) => {
                    event.preventDefault();
                    signOut();
                }}>
                <IconLogout className={classes.linkIcon} stroke={1.5} />
                <span>Logout</span>
                </a>
            </div>
        </nav>
    )
}

export default function RootStyleRegistry({ children, serverColorScheme, isPageOnly=false }: { children: React.ReactElement, serverColorScheme: ColorScheme | null, isPageOnly? : boolean }) {
    const initialColorScheme = (serverColorScheme || getCookie('color-scheme') || 'light') as ColorScheme;
    const [colorScheme, setColorScheme] = useState<ColorScheme>(initialColorScheme);
    const toggleColorScheme = (value?: ColorScheme) => {
      const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
      setColorScheme(nextColorScheme);
      setCookie('color-scheme', nextColorScheme, {
        maxAge: 60 * 60 * 24 * 400, // 400 days
      });
      setCookie('color-scheme-expires', new Date().getTime() + (60 * 60 * 24 * 400) * 1000, {
        maxAge: 60 * 60 * 24 * 2, // have it refresh 2 days after being set
      });
    }
  
    return (
      <Group
        sx={{
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
        }}
        spacing={0}
        align="start"
    >
        <NavBar />
        <main style={{
            height: '100vh',
            maxWidth: `calc(100vw - ${rem(300)})`,
            flexGrow: 1,
        }}>
            {children}
        </main>
      </Group>
    )
  }