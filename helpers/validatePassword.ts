const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

export default function validatePassword(password: string) {
    if (password.length < 7) {
        return false;
    }

    for (const requirement of requirements) {
        if (!requirement.re.test(password)) {
            return false;
        }
    }
    return true;
}