export const rulesNickname = [
  {
    rule: 'No space is allowed.',
    test: (value: string) => {
      return value.replace(/ /g, '').length === value.length;
    },
  },
  {
    rule: 'Nickname must be 1 to 10 characters long.',
    test: (value: string) => {
      return value.length >= 1 && value.length <= 10;
    },
  },
];
