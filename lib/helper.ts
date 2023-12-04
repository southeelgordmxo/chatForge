export function checkFullName(name: string) {
  const nameArr = name.split(" ");
  let fullName = "";

  nameArr.map((n) => {
    if (n !== "null") {
      fullName += `${n} `;
    }
  });
  return fullName.trim();
}
