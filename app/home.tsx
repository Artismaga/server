'use client';
import {
  Text,
  Paper,
  Group,
  Anchor,
  Stack,
  Center,
  Title,
  Image,
  BackgroundImage,
  createStyles,
  rem,
} from '@mantine/core';

const useStyles = createStyles((theme) => ({
    categoryList: {
        height: rem(120),
        padding: rem(5),
    },

    categoryButtonImage: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        transition: 'transform .3s ease-in-out',
        zIndex: -1,
        filter: 'blur(3px)',
        transform: 'scale(1.02)',

        '&:hover': {
            transform: 'scale(1.1)',
        },

        '&:after': {
            position: 'absolute',
            content: '""',
            height: '100%',
            width: '100%',
            top: 0,
            backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6) 75%)',
            transition: 'transform .3s ease-in-out',
            transform: 'translateY(100%)',
        },

        '&:hover:after': {
            transform: 'translateY(0%)',
        }
    }
}));

function CategoryButton({
    name,
    image,
    href,
}: {
    name: string;
    image: string;
    href: string;
}) {
    const { classes } = useStyles();

    return (
        <Anchor underline={false} h="100%" href={href}>
            <Paper h="100%" radius={4}>
                <Center h="100%" pos={"relative"} sx={{overflow: 'hidden', borderRadius: 4, backdropFilter: 'blur(2px)'}}>
                    <Image height={rem(110)} imageProps={{style: {objectPosition: '0 20%'}}} className={classes.categoryButtonImage} radius={4} src={image} />
                    <Stack sx={{pointerEvents: 'none'}}>
                        <Title order={1} color='white' sx={{pointerEvents: 'none'}}>{name}</Title>
                    </Stack>
                </Center>
            </Paper>
        </Anchor>
    )
}

export default function Home() {
    const { classes } = useStyles();

    return (
        <main>
            <Group className={classes.categoryList} spacing={rem(5)} grow>
                <CategoryButton name="Art" image="/categories/art.png" href="/art" />
                <CategoryButton name="Comics" image="/categories/comics.png" href="/comics" />
                <CategoryButton name="Novels" image="/categories/novels.png" href="/novels" />
            </Group>
        </main>
    )
}  