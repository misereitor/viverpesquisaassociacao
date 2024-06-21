export function validateName(name: string) {
  const n = name.split(' ');
  if (n.length < 2) {
    return true;
  }
  return false;
}

export function validateIfNameHasNumber(name: string) {
  if (!name) {
    return;
  }
  const regex = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;
  return !regex.test(name);
}
