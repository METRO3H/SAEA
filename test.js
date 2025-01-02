const regex = /\d+(?:\s*-\s*\d+)?/g;
const inputs = ["25, 5-8", "89", "11", "5", "6-9", "3-8, 11", "3", "bobasdh", "58"];

inputs.forEach((input) => {
   const matches = input.match(regex);

   const string_value = matches ? matches.join(", ") : " - "

   console.log(input + " => ", matches, regex.test(input), string_value);
});
