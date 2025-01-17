const string_regex = /\d+(?:\s*-\s*\d+)?/g;
export function Get_Assigned_Questions(skill_content_list: string[]): number[] {
   const result: number[] = skill_content_list.flatMap(Get_Questions_From_Item);
   return result;
}

export function Get_Questions_From_Item(item: string) {
   console.log(item)
   
   const matches = item.match(string_regex) || [];
   
   const result: number[] = matches.flatMap((range)=>{
      if (!range.includes("-")) {
         return [+range];
      }

      const [start, end] = range.split("-").map(Number);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
   });


   return result;
}
