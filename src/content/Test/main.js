
const regex_string = /\d+(?:\s*-\s*\d+)?/g;
const input_list = ["25, 5-8", "89", "11", "5", "6-9", "3-8, 11", "3", "bobasdh", "58"];

input_list.forEach((input) => {
   const matches = input.match(regex_string);

   const string_value = matches ? matches.join(", ") : " - "

   console.log(input + " => ", matches, regex_string.test(input), string_value);
});
