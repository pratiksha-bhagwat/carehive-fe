export const REGEX = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    phone: /^[0-9]{10}$/,
    name: /^[a-zA-Z\s-']+$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
};

export const ERROR_MESSAGES = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    password: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
    confirmPassword: 'Passwords do not match',
    phone: 'Please enter a valid 10-digit phone number',
    name: 'Name can only contain letters, spaces, hyphens, and apostrophes'
};

export const USER_TYPES = [
    { value: 'Elder', label: 'Elder' },
    { value: 'Caretaker', label: 'Caretaker' }
];

export const GENDER_OPTIONS = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
];