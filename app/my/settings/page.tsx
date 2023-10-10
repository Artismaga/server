"use client";
import { Avatar, Button, Image as MantineImage, Overlay, Modal, createStyles, getStylesRef, rem, Group,
    TextInput, Divider, PasswordInput, Paper, Text, Select, Checkbox, Center, Loader, ScrollArea,
    Input, Title, Slider
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAlertCircle, IconEdit, IconPhoto, IconUserCircle } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { DateInput } from '@mantine/dates';
import { useCallback, useEffect, useRef, useState } from "react";
import { modals } from '@mantine/modals';
import Dropzone from "@/components/dropzone";
import ISO6391 from "iso-639-1";

const PROFILE_PICTURE_SIZE = 150;
const BANNER_HEIGHT = 200;

const useStyles = createStyles((theme) => ({
    bannerEdit: {
        position: 'absolute',
        top: rem(`calc(${rem(BANNER_HEIGHT)} - ${rem(40)})`),
        right: rem(5),
        opacity: 0,
        transition: 'opacity .15s ease-in-out',

        [`.bannerContainer:hover &`]: {
            opacity: 1,
        }
    },

    profilePicture: {
        ref: getStylesRef('profilePicture'),
        position: 'relative',
        top: rem(-PROFILE_PICTURE_SIZE/2 - 55),
        left: rem(20),
        width: rem(PROFILE_PICTURE_SIZE),
        cursor: 'pointer',
    },

    avatar: {
        width: rem(PROFILE_PICTURE_SIZE),
        height: rem(PROFILE_PICTURE_SIZE),
    },

    editOverlay: {
        width: rem(PROFILE_PICTURE_SIZE),
        height: rem(PROFILE_PICTURE_SIZE),
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        opacity: 0,
        transition: 'opacity .15s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        pointerEvents: 'none',

        [`.${getStylesRef('profilePicture')}:hover &`]: {
            opacity: 1,
        },
    },

    settingsArea: {
        width: '65%',
        paddingLeft: theme.spacing.xs,
        paddingRight: theme.spacing.xs,
    },

    settingsContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: theme.spacing.md
    },
}));

function dataURItoBlob(dataURI: string) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
}

function ImageUploadModal(
    { cropMode, cropShape='square', open, onAccept, onClose, title, rejectMessage, idleMessage, message }:
    { cropMode?: 'square' | number, open: boolean, onAccept: (file: File[]) => void, onClose: () => void,
        title: string, rejectMessage: string, idleMessage: string, message: string,
        cropShape?: 'circle' | 'square',
    },
) {
    const { classes, theme } = useStyles();
    const openRef = useRef<() => void>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [zoom, setZoom] = useState(0);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [size, setSize] = useState({ width: 0, height: 0 });
    const [imageURL, setURL] = useState('');
    const [mouseDragPos, setDP] = useState({ x: 0, y: 0, down: false });
    const [initialCrop, setIC] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const viewportHeight = (percentage: number) => {
        return (typeof window !== 'undefined' && window.innerHeight || 0) * (percentage / 100);
    }

    const [offsetWidth, setOW] = useState(canvasRef?.current?.offsetWidth);
    const canvasWidth = offsetWidth || viewportHeight(45);

    let scaledSize = {
        width: Math.max(size.width, canvasWidth),
        height: size.height * (canvasWidth / size.width),
    };
    if (size.width > canvasWidth) {
        scaledSize = {
            width: size.width * (viewportHeight(45) / size.height),
            height: viewportHeight(45),
        };
    }

    useEffect(() => {
        setOW(canvasRef?.current?.offsetWidth);
    }, [canvasRef?.current?.offsetWidth]);

    const close = () => {
        URL.revokeObjectURL(imageURL);
        setURL('');
        setFiles([]);
        setCrop({ x: 0, y: 0 });
        setZoom(0);
        onClose();
    }

    const mouseDown = (_event: any) => {
        let event: MouseEvent = _event as MouseEvent
        setDP({ x: event.clientX, y: event.clientY, down: true });
        setIC({ x: crop.x, y: crop.y });
    }

    const mouseLeave = (_event: any) => {
        setDP({ x: 0, y: 0, down: false });
        setIC({ x: 0, y: 0 });
    }

    const mouseUp = () => {
        setDP({ x: 0, y: 0, down: false });
        setIC({ x: 0, y: 0 });
    }

    const mouseDrag = useCallback((_event: any) => {
        let event: MouseEvent = _event as MouseEvent
        if (mouseDragPos.down) {
            setCrop(
                {
                    x: Math.max(
                        Math.min(
                            initialCrop.x - ((event.clientX - mouseDragPos.x) / canvasWidth) * 100 / (scaledSize.width * .0015),
                            100),
                        0
                    ),
                    y: Math.max(
                        Math.min(
                            initialCrop.y - ((event.clientY - mouseDragPos.y) / viewportHeight(45)) * 100 / (scaledSize.height * .0015),
                            100),
                        0
                    )
                }
            );
        }
    }, [mouseDragPos, initialCrop, size]);

    const mouseWheel = useCallback((_event: any) => {
        let event: WheelEvent = _event as WheelEvent
        setZoom(
            Math.max(
                Math.min(
                    Math.round((zoom + (-event.deltaY / viewportHeight(45)) * .25) * 100) / 100,
                    1.5),
                0)
        );
    }, [zoom]);

    useEffect(() => {
        if (canvasRef.current == null) return;
        const canvas = canvasRef.current as HTMLCanvasElement;
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;

        context.clearRect(0, 0, canvas.width, canvas.height);
        const zoomedSize = {
            width: scaledSize.width * (1 + zoom),
            height: scaledSize.height * (1 + zoom),
        };
        const bounds = {
            width: Math.abs(zoomedSize.width - canvas.width),
            height: Math.abs(zoomedSize.height - canvas.height),
        };
        const image = new Image;
        image.src = imageURL;
        context.drawImage(
            image,
            -(crop.x / 100) * bounds.width,
            -(crop.y / 100) * bounds.height,
            zoomedSize.width,
            zoomedSize.height,
        );
    }, [imageURL, crop, zoom, size, canvasRef, scaledSize]);

    return (
        <Modal
            opened={open}
            onClose={close}
            title={title}
            size="auto"
        >
            {
                cropMode !== undefined && files.length > 0 && (
                    <>
                        <div style={{
                            aspectRatio: typeof cropMode === 'number' && `${cropMode} / 1` || cropMode === 'square' && "1 / 1" || undefined,
                            overflow: "hidden",
                            borderRadius: theme.radius.sm,
                            cursor: "move",
                            userSelect: "none",
                            marginBottom: theme.spacing.sm,
                            height: "45vh",
                            width: "auto",
                            position: "relative",
                        }}
                            onMouseDown={mouseDown}
                            onMouseMove={mouseDrag}
                            onMouseUp={mouseUp}
                            onMouseLeave={mouseLeave}
                            onWheel={mouseWheel}
                        >
                            <canvas
                                ref={canvasRef}
                                width={canvasWidth}
                                height={viewportHeight(45)}
                                style={{
                                    height: "45vh",
                                    width: "100%",
                                    pointerEvents: "none",
                                }}
                            />
                            <div style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "45vh",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <div style={{
                                    height: "auto",
                                    width: "100%",
                                    aspectRatio: typeof cropMode === 'number' && `${cropMode} / 1` || cropMode === 'square' && "1 / 1" || undefined,
                                    borderRadius: cropShape === 'square' ? 0 : '50%',
                                    border: "solid 3px rgb(255, 255, 255)",
                                    boxShadow: "0 0 0 1600px rgba(0, 0, 0, 0.5)",
                                }} />
                            </div>
                        </div>
                        <Group>
                            <IconPhoto size={15} />
                            <Slider
                                min={0}
                                max={1.5}
                                step={0.01}
                                precision={2}
                                value={zoom}
                                onChange={setZoom}
                                size="lg"
                                sx={{
                                    flexGrow: 1,
                                }}
                            />
                            <IconPhoto size={20} />
                        </Group>
                    </>
                ) || (
                    <Dropzone
                        openRef={openRef}
                        onDrop={(files) => {
                            setFiles(files);

                            const imgUrl = URL.createObjectURL(files[0]);
                            const img = new Image;
                            img.onload = () => {
                                setSize({ width: img.width, height: img.height });
                                setCrop({ x: 50, y: 50 });
                            }

                            img.src = imgUrl;

                            setURL(imgUrl);
                        }}
                        rejectMessage={rejectMessage}
                        idleMessage={idleMessage}
                        message={message}
                        multiple={false}
                    />
                )
            }
            <Group position="center" mt={theme.spacing.sm}>
                <Button
                    variant="default"
                    onClick={() => {
                        if (files.length > 0) {
                            if (cropMode !== undefined && canvasRef.current) {
                                const canvas = canvasRef.current;
                                const origFile = files[0];
                                const newFiles = [
                                    new File([dataURItoBlob(canvas.toDataURL())], origFile.name, origFile)
                                ];
                                onAccept(newFiles);
                            } else {
                                onAccept(files);
                            }
                            close();
                        }
                    }}
                    disabled={files.length === 0}
                >
                    Upload
                </Button>
                <Button
                    variant="subtle"
                    onClick={close}
                >
                    Cancel
                </Button>
            </Group>
        </Modal>
    );
}

function anonymizeEmail(email: string) {
    const [local, domain] = email.split('@');
    return `${'*'.repeat(local.length)}@${domain}`;
}

function generateLanguages() {
    let langs = [];
    const isoLangs = ISO6391.getLanguages(ISO6391.getAllCodes());

    for (let lang of isoLangs) {
        langs.push({
            value: lang.code as string,
            label: lang.nativeName,
        });
    }

    return langs;
}

function getDefaultLanguage() {
    const langs = generateLanguages();
    const browserLangs = navigator.languages;

    for (let lang of browserLangs) {
        for (let l of langs) {
            if (l.value === lang)
                return l.value;
        }
    }
}

export default function Page() {
    const session = useSession();
    const { classes, theme } = useStyles();

    const user = session.data?.user;
    const [settings, setSettings] = useState(user?.settings || {});

    const [pfpOpen, { open: openPFP, close: closePFP }] = useDisclosure(false);
    const [bannerOpen, { open: openBanner, close: closeBanner }] = useDisclosure(false);

    const [profilePicture, setPFP] = useState(user?.profilePicture);
    const [profileBanner, setBanner] = useState(user?.profileBanner);
    const [pendingChanges, setPC] = useState<{[key: string]: boolean}>({});

    const setPending = (key: string, pending: boolean) => {
        setPC(prev => ({ ...prev, [key]: pending }));
    }

    const confirmDelete = () => modals.openConfirmModal({
        title: 'Are you sure you want to delete your account?',
        children: ( // TODO: Add 2fa confirmations once 2fa is implemented
            <>
                <Text size="sm">
                    This action cannot be undone, and no new account can ever be created on this instance using your name again.
                </Text>
            </>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onCancel: () => console.log('Delete account cancelled'),
        onConfirm: () => {
            // Account deletion not implemented yet, only sign the user out
            signOut();
        },
    });

    useEffect(() => {
        if (!pendingChanges?.profilePicture)
            setPFP(user?.profilePicture);
        if (!pendingChanges?.profileBanner)
            setBanner(user?.profileBanner);
    }, [user]);

    if (session.status !== 'authenticated') {
        return (
            <Center h="100%">
                <Loader size={120} variant="dots" />
            </Center>
        )
    }

    return (
        <>
            <ImageUploadModal
                cropMode="square"
                cropShape="circle"
                open={pfpOpen}
                onAccept={(files) => {
                    if (files.length > 0) {
                        // Nothing exists yet to upload files
                        setPending('profilePicture', true);
                        const imgUrl = URL.createObjectURL(files[0]);
                        setPFP(imgUrl);
                    }
                }}
                onClose={closePFP}
                title="Upload Profile Picture"
                rejectMessage="File not accepted"
                idleMessage="Drag and drop your image here"
                message="Or select a file"
            />
            <ImageUploadModal
                cropMode={3}
                open={bannerOpen}
                onAccept={(files) => {
                    if (files.length > 0) {
                        // Nothing exists yet to upload files
                        setPending('profileBanner', true);
                        const imgUrl = URL.createObjectURL(files[0]);
                        setBanner(imgUrl);
                    }
                }}
                onClose={closeBanner}
                title="Upload Profile Banner"
                rejectMessage="File not accepted"
                idleMessage="Drag and drop your image here"
                message="Or select a file"
            />
            <div style={{height: rem(BANNER_HEIGHT), marginBottom: rem(25)}}>
                <div className="bannerContainer">
                    <MantineImage
                        height={rem(BANNER_HEIGHT)}
                        width="100%"
                        src={profileBanner}
                        withPlaceholder
                        imageProps={{
                            height: rem(BANNER_HEIGHT),
                        }}
                    />
                    <Button
                        className={classes.bannerEdit}
                        variant="default"
                        onClick={openBanner}
                    >
                        Edit Banner
                    </Button>
                </div>
                <div className={classes.profilePicture}>
                    <Avatar
                        radius="50%"
                        className={classes.avatar}
                        variant="filled"
                        src={profilePicture}
                        onClick={openPFP}
                    >
                        <IconUserCircle size={rem(PROFILE_PICTURE_SIZE/2)} stroke={1} color={theme.colors.gray[6]} />
                    </Avatar>
                    <Overlay className={classes.editOverlay}>
                        <IconEdit size={rem(PROFILE_PICTURE_SIZE/3)} stroke={1} color={theme.colors.gray[3]} />
                    </Overlay>
                </div>
            </div>
            <ScrollArea h={`calc(100vh - ${rem(BANNER_HEIGHT + 25)})`}>
                <div className={classes.settingsContainer}>
                    <div className={classes.settingsArea}>
                        <TextInput
                            placeholder="Your display name"
                            label="Display Name"
                            autoComplete="off"
                            defaultValue={user?.displayName}
                        />
                        <Select
                            label="Mature Works"
                            placeholder="Select your mature works preference"
                            data={[
                                { value: 'show', label: 'Show mature works' },
                                { value: 'hide', label: 'Hide mature works' },
                                { value: 'blur', label: 'Show mature works but blur their media' },
                            ]}
                            value={settings.matureWorks || 'blur'}
                            onChange={(value) => {
                                setSettings(prev => ({ ...prev, matureWorks: value }));
                                setPending('settings', true);
                            }}
                            mt="sm"
                        />
                        <Select
                            label="Gender"
                            placeholder="Select your gender"
                            data={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'other', label: 'Other' },
                                { value: 'none', label: 'Prefer not to say' },
                            ]}
                            mt="sm"
                            value={settings.gender || 'none'}
                            onChange={(value) => {
                                setSettings(prev => ({ ...prev, gender: value }));
                                setPending('settings', true);
                            }}
                        />
                        <DateInput
                            label="Birthday"
                            placeholder="Select your birthday"
                            mt="sm"
                            value={settings.birthday ? new Date(settings.birthday) : undefined}
                            onChange={(value) => {
                                setSettings(prev => ({ ...prev, birthday: value?.toISOString() }));
                                setPending('settings', true);
                            }}
                        />
                        <Select
                            label="Language"
                            placeholder="Select your language"
                            description="Some languages may not yet be fully supported"
                            data={generateLanguages()}
                            mt="sm"
                            value={settings?.language || getDefaultLanguage()}
                            onChange={(value) => {
                                setSettings(prev => ({ ...prev, language: value }));
                                setPending('settings', true);
                            }}
                        />
                        <Checkbox
                            label="Allow personalized advertisements"
                            description="Enable this setting to let us use basic information about you to show more personalized advertisements"
                            mt="sm"
                            value={settings?.allowPersonalizedAds || false}
                            onChange={(value) => {
                                setSettings(prev => ({ ...prev, allowPersonalizedAds: value }));
                                setPending('settings', true);
                            }}
                        />
                        <Divider my="sm" />
                        <PasswordInput
                            mt="lg"
                            placeholder="Current password"
                            label="Confirm Password"
                            description="Enter your current password to change the settings below"
                        />
                        <TextInput
                            mt="sm"
                            placeholder={user?.email ? anonymizeEmail(user.email) : "Your email address"}
                            label="Email Address"
                            autoComplete="off"
                        />
                        {
                            user && !user.emailVerified && (
                                <Paper
                                    p="sm"
                                    withBorder
                                    mt="sm"
                                    mb="sm"
                                >
                                    <Group>
                                        <IconAlertCircle size={26} color={theme.colors.red[6]} stroke={2} />
                                        <Text size="sm">
                                            Your email address has not been verified.
                                        </Text>
                                    </Group>
                                    <Button
                                        variant="subtle"
                                        mt="sm"
                                        size="sm"
                                    >
                                        Resend Verification Email
                                    </Button>
                                </Paper>
                            ) || null
                        }
                        <PasswordInput
                            placeholder="New password"
                            label="Change Password"
                            autoComplete="new-password"
                        />
                        <Divider my="lg" />
                        <Title color="red" order={2} mb="sm">Danger Zone</Title>
                        <Group>
                            <Input.Wrapper
                                label="Delete Account"
                                description="This action cannot be undone"
                            >
                                <Button
                                    variant="filled"
                                    color="red"
                                    mt="sm"
                                    onClick={confirmDelete}
                                >
                                    Delete Account
                                </Button>
                            </Input.Wrapper>
                        </Group>
                    </div>
                </div>
            </ScrollArea>
        </>
    )
}