import type { RefObject } from 'react';
import { Text, Group, Button, rem, createStyles } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
    wrapper: {
        position: 'relative',
        marginBottom: rem(30),
    },

    dropzone: {
        borderWidth: rem(1),
        paddingBottom: rem(50),
    },

    icon: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
    },

    control: {
        position: 'absolute',
        width: rem(250),
        left: `calc(50% - ${rem(125)})`,
        bottom: rem(-20),
    },
}));

export default function DropzoneButton(
    { openRef, accept, rejectMessage, idleMessage, message, onDrop, maxSize, multiple, loading=false }:
    { openRef: RefObject<() => void>, accept?: string[], rejectMessage: string, idleMessage: string, message: string,
        onDrop?: (files: File[]) => void, maxSize?: number, multiple?: boolean, loading?: boolean 
    }
) {
    const { theme, classes } = useStyles();

    return (
        <div className={classes.wrapper}>
            <Dropzone
                openRef={openRef}
                onDrop={onDrop ? onDrop : () => {}}
                className={classes.dropzone}
                radius="md"
                accept={accept || IMAGE_MIME_TYPE}
                maxSize={maxSize || 30 * 1024 ** 2}
                multiple={multiple !== undefined ? multiple : true}
                loading={loading}
            >
                <div style={{ pointerEvents: 'none' }}>
                <Group position="center">
                    <Dropzone.Accept>
                    <IconDownload
                        style={{ width: rem(50), height: rem(50) }}
                        color={theme.colors.blue[6]}
                        stroke={1.5}
                    />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                    <IconX
                        style={{ width: rem(50), height: rem(50) }}
                        color={theme.colors.red[6]}
                        stroke={1.5}
                    />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                    <IconCloudUpload style={{ width: rem(50), height: rem(50) }} stroke={1.5} />
                    </Dropzone.Idle>
                </Group>
        
                <Text ta="center" fw={700} fz="lg" mt="xl">
                    <Dropzone.Accept>Drop files here</Dropzone.Accept>
                    <Dropzone.Reject>{ rejectMessage }</Dropzone.Reject>
                    <Dropzone.Idle>{ idleMessage }</Dropzone.Idle>
                </Text>
                <Text ta="center" fz="sm" mt="xs" c="dimmed">
                    { message }
                </Text>
                </div>
            </Dropzone>
        
            <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
                Select files
            </Button>
        </div>
    )
}