"use client";
import { createEmotionCache, MantineProvider, ColorSchemeProvider, ColorScheme, Text, Loader } from "@mantine/core";
import { createStyles, Header, Group, Button, Autocomplete, Burger, Drawer, Divider, ScrollArea, Box, Anchor, ActionIcon } from "@mantine/core";
import { UnstyledButton, Avatar, Menu, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { IconLogin, IconSearch, IconBrandTwitter } from "@tabler/icons-react";
import { useServerInsertedHTML } from "next/navigation";
import { ColorSchemeToggle } from "@/components/color-scheme-toggle";
import { SessionProvider, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import {
  IconLogout,
  IconEdit,
  IconSettings,
  IconBookmark,
} from '@tabler/icons-react';

const cache = createEmotionCache({ key: 'mantine' })
cache.compat = true

const useStyles = createStyles((theme) => ({
  link: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,
    borderRadius: theme.radius.sm,

    [theme.fn.smallerThan('sm')]: {
      height: 42,
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },

    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    }),
  },

  footer: {
    borderTop: `1 solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  footerInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${theme.spacing.md} ${theme.spacing.md}`,

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
    },
  },

  footerLinks: {
    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
  },

  hiddenMobile: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  user: {
    display: 'block',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    borderRadius: theme.radius.sm,
    padding: rem(3),
    paddingRight: theme.spacing.sm,
    
    [theme.fn.smallerThan('sm')]: {
      flexGrow: 1,
    },

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  userContainer: {
    paddingY: theme.spacing.xs,
  },
}));

function UserDetails() {
  const { classes, theme } = useStyles();
  const { data: session, status } = useSession();

  if (status == 'authenticated') {
    return (
      <div className={classes.userContainer}>
        <Menu
          withArrow
          width={300}
          position="bottom"
          transitionProps={{ transition: 'pop' }}
          withinPortal
        >
          <Menu.Target>
            <UnstyledButton className={classes.user}>
              <Group>
                <Avatar src={session?.user?.profilePicture} radius="xl" size={rem(35)} />

                <div style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>
                    {session?.user?.displayName}
                  </Text>

                  <Text c="dimmed" size="xs">
                    {session?.user?.id}
                  </Text>
                </div>
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              rightSection={<IconBookmark style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              component={Link}
              href="/my/bookmarks"
            >
              Bookmarked works
            </Menu.Item>
            <Menu.Item
              rightSection={<IconEdit style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              component={Link}
              href="/my/works"
            >
              Your works
            </Menu.Item>

            <Menu.Label>Settings</Menu.Label>
            <Menu.Item
              rightSection={<IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              component={Link}
              href="/my/settings"
            >
              Account settings
            </Menu.Item>
            <Menu.Item
              color="red"
              rightSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              onClick={() => signOut()}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    )
  } else if (status == 'loading') {
    return (
      <Loader />
    )
  } else {
    return (
      <Button sx={{textDecoration: 'none !important', [theme.fn.smallerThan('sm')]: {flexGrow: 1}}} onClick={() => signIn()} leftIcon={<IconLogin />}>Sign in</Button>
    )
  }
}

export function SiteHeader() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const { classes, theme } = useStyles();

  const links = (
    <>
      <Link href="/art" className={classes.link}>
        Art
      </Link>
      <Link href="/novels" className={classes.link}>
        Novels
      </Link>
      <Link href="/comics" className={classes.link}>
        Comics
      </Link>
    </>
  )
  const rightmost = (
    <>
      <Autocomplete
        placeholder="Search"
        icon={<IconSearch size="1rem" stroke={1.5} />}
        data={['Test']}
        withinPortal
        sx={{
          [theme.fn.smallerThan('sm')]: {
            width: '100%',
          }
        }}
      />
      <Group sx={{
        [theme.fn.smallerThan('sm')]: {
          width: '100%',
        }
      }}>
        <ColorSchemeToggle />
        <UserDetails />
      </Group>
    </>
  )

  return (
    <Box pb={0}>
      <Header height={60} px="md">
        <Group position="apart" sx={{ height: '100%' }}>
          <Group h={"50%"}>
            <Anchor component={Link} underline={false} href="/">
              <Text color={theme.colorScheme === 'dark' ? theme.white : theme.black} weight={600}>Artismaga</Text>
            </Anchor>

            <Group sx={{ height: '100%' }} spacing={0} className={classes.hiddenMobile}>
              {links}
            </Group>
          </Group>

          <Group className={classes.hiddenMobile}>
            {rightmost}
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} />
        </Group>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - 60)`} mx="-md">
          <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />

          {links}

          <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />

          <Group dir="row" w="100%" px={theme.spacing.xs} spacing={theme.spacing.md}>
            {rightmost}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}

export function SiteFooter() {
  const { classes } = useStyles();
  const links = [
    { label: 'Privacy', link: '/privacy' },
    { label: 'Terms', link: '/terms' },
    { label: 'Contact', link: '/contact' },
  ]
  const items = links.map((link) => (
    <Anchor<'a'>
      color="dimmed"
      key={link.label}
      href={link.link}
      sx={{ lineHeight: 1 }}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.footerInner}>
        <Text weight={600}>Artismaga</Text>

        <Group className={classes.footerLinks}>{items}</Group>

        <Group spacing="xs" position="right" noWrap>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandTwitter size="1.05rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
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

  // make sure the color-scheme cookie never expires
  const colorSchemeExpiry = getCookie('color-scheme-expires');
  if (colorSchemeExpiry === undefined || new Date().getTime() > Number.parseInt(colorSchemeExpiry as string)) {
    setCookie('color-scheme', colorScheme, {
      maxAge: 60 * 60 * 24 * 400, // 400 days
    });
    setCookie('color-scheme-expires', new Date().getTime() + (60 * 60 * 24 * 400) * 1000, {
      maxAge: 60 * 60 * 24 * 2, // have it refresh 2 days after being set
    });
  }

  useServerInsertedHTML(() => (
		<style
			data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
			dangerouslySetInnerHTML={{
				__html: Object.values(cache.inserted).join(' '),
			}}
		/>
	))

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS emotionCache={cache}>
        <Notifications />
        <ModalsProvider>
          <SessionProvider>
            {!isPageOnly && <SiteHeader />}
            {children}
            {!isPageOnly && <SiteFooter />}
          </SessionProvider>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}