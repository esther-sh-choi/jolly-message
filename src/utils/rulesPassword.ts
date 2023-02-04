export const rulesPassword = [
  {
    rule: 'Password must contain at least 7 characters.',
    test: (value: string) => {
      return value.length >= 7;
    },
  },
  {
    rule: 'Password must contain less than 15 characters.',
    test: (value: string) => {
      return value.length < 15;
    },
  },
  {
    rule: 'Password must contain at least one number and one special character.',
    test: (value: string | undefined) => {
      return (
        !!value?.match(/[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/g) &&
        !!value?.match(/\d/)
      );
    },
  },
  {
    rule: 'No spaces allowed.',
    test: (value: string) => {
      return !value.match(/\s/g);
    },
  },
];
