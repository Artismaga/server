"use client";
import { useToggle, upperFirst } from '@mantine/hooks';
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
} from '@mantine/core';
import { getBackgroundImage } from '../background-images';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useState, useEffect } from 'react';

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

function AuthenticationForm(props: PaperProps) {
    const [type, toggle] = useToggle(['login', 'register']);
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
        name: (val) => (val.length <= 2 ? 'Name must be longer than 2 characters' : null),
        terms: (val) => (val ? null : 'You must agree to terms'),
      },
    });

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
      <Paper radius="md" p="xl" withBorder {...props}>
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
                onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                error={form.errors.name}
                radius="md"
                required
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
            />
  
            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && 'Password not strong enough'}
              radius="md"
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
                    label="I accept terms and conditions"
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
              component="button"
              type="button"
              color="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === 'register'
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    );
}

export default function Login() {
    const [background, setBackground] = useState('');

    useEffect(() => {
      setBackground(getBackgroundImage());
    }, []);

    return (
      <main>
        <BackgroundImage sx={{height: '100vh'}} src={background}>
            <Center h={'100%'}>
                <div>
                  <Anchor href="/" underline={false}><Title align='center' mb={8} color='white'>Artismaga</Title></Anchor>
                  <AuthenticationForm />
                </div>
            </Center>
        </BackgroundImage>
      </main>
    )
}