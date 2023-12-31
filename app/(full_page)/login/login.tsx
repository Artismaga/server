"use client";
import { upperFirst, useDebouncedState } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  BackgroundImage,
  Checkbox,
  Anchor,
  Stack,
  Center,
  Box,
  Progress,
  Title,
  LoadingOverlay,
} from '@mantine/core';
import { getBackgroundImage } from '@/components/background-images';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
    return (
      <Text color={meets ? 'teal' : 'red'} mt={5} size="sm">
        <Center inline>
          {meets ? <IconCheck size="0.9rem" stroke={1.5} /> : <IconX size="0.9rem" stroke={1.5} />}
          <Box ml={7}>{label}</Box>
        </Center>
      </Text>
    );
}

const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password: string) {
    let multiplier = password.length > 5 ? 0 : 1;
  
    requirements.forEach((requirement) => {
      if (!requirement.re.test(password)) {
        multiplier += 1;
      }
    });
  
    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

function AuthenticationForm({ returnpath = '/', register = false, ...props }: { returnpath?: string, register?: boolean } & PaperProps) {
    const router = useRouter();
    if (useSession().status == 'authenticated') {
      router.push('/account/settings');
    }
    const type = register ? 'register' : 'login';
    const form = useForm({
      initialValues: {
        email: '',
        name: '',
        password: '',
        terms: false,
      },
  
      validate: {
        email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
        password: (val) => type == 'register' && (getStrength(val) < 100 ? 'Password not strong enough' : null) || null,
        name: (val) => (val.length <= 2 && type == 'register' ? 'Name must be longer than 2 characters' : null),
        terms: (val) => (val || type == 'login' ? null : 'You must agree to terms'),
      },
    });

    const [submitting, setSubmitting] = useState(false);
    const [nameEmail, setNE] = useDebouncedState({
      name: form.values.name,
      email: form.values.email,
    }, 200);

    useEffect(() => {
      if (nameEmail.name != form.values.name || nameEmail.email != form.values.email) {
        setNE({
          name: form.values.name,
          email: form.values.email,
        });
      }
    }, [form.values.name, form.values.email]);

    useEffect(() => {
      if (type !== 'register') {
        form.setFieldError('name', null);
        form.setFieldError('email', null);
        return;
      }

      if (nameEmail.name.length == 0 && nameEmail.email.length == 0) return;
      let url = '/api/auth/register?';
      if (nameEmail.name.length > 0) {
        url += `name=${nameEmail.name}`;
      }
      if (nameEmail.email.length > 0) {
        if (nameEmail.name.length > 0) {
          url += '&';
        }
        url += `email=${nameEmail.email}`;
      }

      fetch(encodeURI(url), {
        method: 'GET',
      }).then((response) => {
        if (response.ok) {
          response.json().then((json) => {
            if (json.field == 'email') {
              form.setFieldError('email', json.message);
            } else if (json.field == 'name') {
              if (json?.suggestedName) {
                form.setFieldError('name', `Name unavailable, however "${json.suggestedName}" is available.`);
              } else {
                form.setFieldError('name', json.message);
              }
            }
          });
        }
      })
    }, [nameEmail.email, nameEmail.name]);

    const submitClicked = () => {
      const validateResult = form.validate();

      if (!validateResult.hasErrors) {
        setSubmitting(true);
        if (type == 'login') {
          signIn('credentials', {
            email: form.values.email,
            password: form.values.password,
            callbackUrl: returnpath,
          })
        } else {
          fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
              email: form.values.email,
              password: form.values.password,
              name: form.values.name,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }).then((response) => {
            if (response.ok) {
              signIn('credentials', {
                email: form.values.email,
                password: form.values.password,
              });
            } else {
              if (response.body) {
                response.json().then((json) => {
                  if (json.field == 'email') {
                    form.setFieldError('email', json.message);
                  } else if (json.field == 'name') {
                    if (json?.suggestedName) {
                      form.setFieldError('name', `Name unavailable, however "${json.suggestedName}" is available.`);
                    } else {
                      form.setFieldError('name', json.message);
                    }
                  } else if (json.field == 'password') {
                    form.setFieldError('password', json.message);
                  }
                });
              }
            }
            setSubmitting(false);
          });
        }
      } else {
        console.log(validateResult.errors);
        console.log(form.values);
      }
    };

    const strength = getStrength(form.values.password);
    const checks = requirements.map((requirement, index) => (
        <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(form.values.password)} />
    ));
    const bars = Array(4)
        .fill(0)
        .map((_, index) => (
        <Progress
            styles={{ bar: { transitionDuration: '0ms' } }}
            value={
              form.values.password.length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0
            }
            color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
            key={index}
            size={4}
        />
    ));

    return (
      <Paper pos="relative" radius="md" p="xl" withBorder {...props}>
        <LoadingOverlay visible={submitting} zIndex={1000} radius="sm" overlayBlur={2} />
        <Text size="lg" weight={800}>
          <Center>
            {type == 'register' && 'Create an account' || 'Welcome back!'}
          </Center>
        </Text>
  
        <form onSubmit={form.onSubmit(() => {})}>
          <Stack>
            {type === 'register' && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) => {
                  let value = event.currentTarget.value;
                  value = value.replace(' ', '_');
                  form.setFieldValue('name', value);
                }}
                error={form.errors.name}
                radius="md"
                required
                autoComplete='off'
              />
            )}
  
            <TextInput
              required
              label="Email"
              placeholder="contact@artismaga.com"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && 'Invalid email'}
              radius="md"
              autoComplete={type === 'register' ? 'off' : 'email'}
            />
  
            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && 'Password not strong enough'}
              radius="md"
              autoComplete={type === 'register' ? 'new-password' : undefined}
            />
  
            {type === 'register' && (
              <>
                <div>
                    <Group spacing={5} grow mt="xs" mb="md">
                        {bars}
                    </Group>

                    <PasswordRequirement label="Has at least 6 characters" meets={form.values.password.length > 5} />
                    {checks}
                </div>

                <Checkbox
                    label={<Text>I accept the <Anchor href='/terms'>terms and conditions</Anchor></Text>}
                    checked={form.values.terms}
                    onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                    error={form.errors.terms && 'You must agree to terms'}
                    required
                />
              </>
            )}
          </Stack>
  
          <Group position="apart" mt="xl">
            <Anchor
              component={Link}
              type="button"
              color="dimmed"
              size="xs"
              href={type === 'register' ? '/login' : '/register'}
            >
              {type === 'register'
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
            <Button onClick={submitClicked} disabled={submitting} type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    );
}

export default function Login({register = false}: { register?: boolean }) {
    const [background, setBackground] = useState('');
    const searchParams = useSearchParams();
    const returnPath = searchParams.get('callbackUrl') || '/';

    useEffect(() => {
      setBackground(getBackgroundImage());
    }, []);

    return (
      <main>
        <BackgroundImage sx={{height: '100vh', ':after': {position: 'absolute', width: '100%', height: '100%', backdropFilter: 'blur(5px)', content: '""', backgroundColor: 'rgba(255, 255, 255, 0.01)', top: 0}}} src={background}>
            <Center h={'100%'}>
                <div style={{zIndex: 1}}>
                  <Anchor href="/" underline={false}><Title sx={{textShadow: '0 4px 10px rgba(0, 0, 0, 0.6)'}} align='center' mb={8} color='white'>Artismaga</Title></Anchor>
                  <AuthenticationForm register={register} returnpath={returnPath} />
                </div>
            </Center>
        </BackgroundImage>
      </main>
    )
}