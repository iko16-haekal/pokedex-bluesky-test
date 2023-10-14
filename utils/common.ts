export const formatNumberWithLeadingZero = (number, desiredLength = 3) => {
  const numberString = number.toString()
  const currentLength = numberString.length

  if (currentLength < desiredLength) {
    const zerosToAdd = desiredLength - currentLength
    const leadingZeros = "0".repeat(zerosToAdd)
    return leadingZeros + numberString
  }

  return numberString
}
