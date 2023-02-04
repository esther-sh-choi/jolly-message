export const rulesUsername = [
  {
    rule: 'Username must be at least 5 characters long.',
    test: (value: string) => {
      return value.length >= 5;
    },
  },
  {
    rule: 'Maximum characters length is 15.',
    test: (value: string) => {
      return value.length <= 15;
    },
  },
  {
    rule: 'Username must contain only numbers and alphabets.',
    test: (value: string) => {
      return !value.match(/[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/g);
    },
  },
  {
    rule: 'Username must contain at least 2 alphabets.',
    test: (value: string) => {
      return (value.match(/[a-zA-Z]/g) || []).length >= 2;
    },
  },
  {
    rule: 'No blank spaces are allowed.',
    test: (value: string) => {
      return !value.match(/\s/g);
    },
  },
];
