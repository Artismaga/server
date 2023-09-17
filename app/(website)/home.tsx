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
  createStyles,
  rem,
  px,
} from '@mantine/core';
import isMobile from '@/helpers/isMobile';
import { useEffect, useState } from 'react';

const useStyles = createStyles((theme) => ({
    categoryList: {
        height: rem(90),
        padding: rem(5),

        [theme.fn.smallerThan('sm')]: {
            height: 'auto',
        },
    },

    categoryTitle: {
        textShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
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
    }
}));

function CategoryButton({
    name,
    image,
    href,
    onMobile,
}: {
    name: string;
    image: string;
    href: string;
    onMobile: boolean;
}) {
    const { classes } = useStyles();

    return (
        <Anchor underline={false} w={onMobile ? '100%' : 'auto'} h="100%" href={href}>
            <Paper h="100%" radius={4}>
                <Center h="100%" pos={"relative"} sx={{overflow: 'hidden', borderRadius: 4, backdropFilter: 'blur(2px)'}}>
                    <Image height={rem(80)} imageProps={{style: {objectPosition: '0 20%'}}} className={classes.categoryButtonImage} radius={4} src={image} />
                    <Stack sx={{pointerEvents: 'none'}}>
                        <Title className={classes.categoryTitle} order={1} color='white' sx={{pointerEvents: 'none'}}>{name}</Title>
                    </Stack>
                </Center>
            </Paper>
        </Anchor>
    )
}

export default function Home() {
    const { classes } = useStyles();
    const [onMobile, setOM] = useState(false);
    if (typeof window !== 'undefined') {
        useEffect(() => {
            setOM(isMobile());

            const updateOM = () => {
                setOM(isMobile());
            }

            window.addEventListener('resize', updateOM);

            return () => window.removeEventListener('resize', updateOM);
        }, []);
    }

    return (
        <main>
            <Group className={classes.categoryList} spacing={rem(5)} grow={!onMobile}>
                <CategoryButton onMobile={onMobile} name="Art" image="/categories/art.png" href="/art" />
                <CategoryButton onMobile={onMobile} name="Comics" image="/categories/comics.png" href="/comics" />
                <CategoryButton onMobile={onMobile} name="Novels" image="/categories/novels.png" href="/novels" />
            </Group>
        </main>
    )
}  